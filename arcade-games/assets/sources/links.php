<?php
// Get the full request URI
$requestUri = $_SERVER['REQUEST_URI'];

// Use explode to split the URI into segments based on '/'
$uriSegments = explode('/', $requestUri);

// Assuming the structure is always like /links/{code},
// {code} will be the third segment (index 2 since arrays are zero-indexed in PHP)
$linkCode = end($uriSegments) ?? null;
$linksData = $GameMonetizeConnect->query("SELECT * FROM " . LINKS . " WHERE url = '$linkCode' AND is_active = 1");
if ($linksData && $linksData->num_rows > 0) {
    $linksData = $linksData->fetch_array();
    if ($linksData['name'] == 'autopost') {
        error_reporting(-1);
        // Autopost new game
        $catalog = file_get_contents('https://gamemonetize.com/feed.php?format=0&num=30');
        if (!!$catalog) {
            $isError = false;
            $games = json_decode($catalog, true);
            $i = 0;
            $installedGamesCounter = 0;
            $installedGamesMaximum = 1;
            foreach ($games as $game) {
                if ($installedGamesCounter >= $installedGamesMaximum) break;
                $title = seo_friendly_url($game['title']);
                $user_info = "SELECT * FROM `" . GAMES . "` WHERE `game_name` = '$title'";
                $user_info_query = $GameMonetizeConnect->query($user_info);
                if ($user_info_query->num_rows == 0) {
                    $game_data = array();
                    $game_data['catalog_id'] = secureEncode($game['id']);
                    $game_data['game_name'] = secureEncode($title);
                    $game_data['name'] = secureEncode($game['title']);

                    $gameDescription = !empty($game['description']) ? secureEncode($game['description']) : '';
                    if ($gameDescription != "") {
                        // Chatgpt
                        // if ($linksData['rewrite_method'] == 'chatgpt') {
                        //     // Get chatgpt settings
                        //     $chatgptSetting = $GameMonetizeConnect->query("SELECT * FROM " . CHATGPT . "");
                        //     if ($chatgptSetting && $chatgptSetting->num_rows > 0) {
                        //         $chatgptSetting = $chatgptSetting->fetch_assoc();

                        //         $api_key = $chatgptSetting['api_key'];
                        //         $template_game = $chatgptSetting['template_game'];

                        //         if (strlen($api_key) > 1) {
                        //             $textToRewrite = $gameDescription;
                        //             if (strlen($textToRewrite) > 2) {
                        //                 $postData = [
                        //                     'model' => 'gpt-3.5-turbo',
                        //                     'messages' => [
                        //                         [
                        //                             'role' => 'system',
                        //                             'content' => 'You are a game description rephrasing or rewriter assistant. Please rephrase/rewrite the description. Result only.'
                        //                         ],
                        //                         [
                        //                             'role' => 'user',
                        //                             'content' => $textToRewrite
                        //                         ]
                        //                     ]
                        //                 ];
                            
                        //                 // Initialize a cURL session
                        //                 $ch = curl_init('https://api.openai.com/v1/chat/completions');
                            
                        //                 // Set the options for the cURL session
                        //                 curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                        //                 curl_setopt($ch, CURLOPT_HTTPHEADER, [
                        //                     'Content-Type: application/json',
                        //                     'Authorization: Bearer ' . $api_key,
                        //                 ]);
                        //                 curl_setopt($ch, CURLOPT_POST, true);
                        //                 curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));
                            
                        //                 // Execute the cURL session and store the response
                        //                 $response = $rawResponse = curl_exec($ch);
                            
                        //                 // Close the cURL session
                        //                 curl_close($ch);
                        //                 $response = json_decode($response);
                            
                        //                 if ($response != null && isset($response->choices)) {
                        //                     $response = $response->choices[0]->message->content;
                        //                     $gameDescription = $response;
                        //                     $gameDescription = convertBoldTags($gameDescription);
                        //                 } else {
                        //                     echo "Error from chatgpt: <br>";
                        //                     print_r($rawResponse);
                        //                     die;
                        //                 }
                        //             } else {
                        //             } 
                        //         } else {
                        //         }
                        //     }
                        // }

                        // Google
                        if ($linksData['rewrite_method'] == 'google') {
                            // auto translate some language and back to english
                            $translateLanguage = explode(",", $linksData["google_translate_language"]);
                            $currentLanguage = "en";
                            foreach ($translateLanguage as $index => $language) {
                                $language = trim($language);
                                $gameDescriptionTranslated = googleTranslate($gameDescription, $currentLanguage, $language);
                                if ($gameDescriptionTranslated) {
                                    $gameDescription = $gameDescriptionTranslated["data"];
                                }

                                $currentLanguage = $language;
                            }
                        }

                        // Spinner
                        if ($linksData['rewrite_method'] == 'spinner') {
                            error_reporting(-1);
                            include_once './assets/spinner/class.spin.php';

                            $spinner = new wp_auto_spin_spin(1, '', $gameDescription);

                            $spinResult = $spinner->spin();

                            $gameDescription = preg_replace_callback('/{([^}]+)}/', function($matches) {
                                // Split the options by '|'
                                $options = explode('|', $matches[1]);
                                // Randomly select one of the options
                                return $options[array_rand($options)];
                            }, $spinResult);

                        }
                    }
                    
                    $game_data['description'] = $gameDescription;

                    $game_data['instructions'] = !empty($game['instructions']) ? secureEncode($game['instructions']) : '';
                    $game_data['file'] = secureEncode($game['url']);
                    $game_data['width'] = $game['width'];
                    $game_data['height'] = $game['height'];
                    $game_data['image'] = $game['thumb'];

                    preg_match("/\/([a-zA-Z0-9]+)\//", $game_data['image'], $matches);
                    $imageId = $matches[1];
                    $imageUrl = $game_data['image'];
                    $imagePath = $_SERVER['DOCUMENT_ROOT'] . '/games-image/' . $imageId . '/250x150.webp';
                    resizeAndCompressImage($imageUrl, $imagePath, 200, 150);

                    // Get category from database
                    $category_data = getCategoriesLikeName($game['category']);
                    $category = "";
                    if ($category_data !== null) {
                        $category = $category_data['id'];
                    }

                    // Get tags from database
                    $allTags = explode(",", $game['tags']);
                    $allTagsId = [];
                    foreach ($allTags as $tag) {
                        $tag_data = getTagsLikeName(trim($tag));
                        $allTagsId[] = "\"{$tag_data["id"]}\"";
                    }
                    if (count($allTagsId) > 0) {
                        $tags = "[" . implode(",", $allTagsId) . "]";
                    }

                    $isSuccess = $GameMonetizeConnect->query("INSERT INTO " . GAMES . " (
                                        catalog_id, 
                                        game_name, 
                                        name, 
                                        image, 
                                        description, 
                                        instructions, 
                                        category, 
                                        file, 
                                        game_type, 
                                        w, 
                                        h, 
                                        date_added, 
                                        tags_ids,
                                        published
                                ) VALUES (
                                        'gamemonetize-{$game_data['catalog_id']}',
                                        '{$game_data['game_name']}',
                                        '{$game_data['name']}',
                                        '{$game_data['image']}',
                                        \"{$game_data['description']}\",
                                        '{$game_data['instructions']}',
                                        '{$category}',
                                        '{$game_data['file']}',
                                        'html5',
                                        '{$game_data['width']}',
                                        '{$game_data['height']}',
                                        '{$time}', 
                                        '{$tags}',
                                        '1'
                                )");
                    if ($isSuccess) {
                        $installedGamesCounter++;
                        addGameXml(siteUrl() . '/game/' . $game_data['game_name']);

                        // Chatgpt
                        if($linksData['rewrite_method'] == "chatgpt") {
                            $lastId = $GameMonetizeConnect->insert_id;
                            $isSuccessRewrite = rewriteChatgpt($lastId);

                            if(!$isSuccessRewrite){
                                $isError = true;
                                // Delete game
                                $isSuccess = $GameMonetizeConnect->query("DELETE FROM " . GAMES . " WHERE game_id = {$lastId}");
                            }
                        }
                    } else {
                        var_dump($GameMonetizeConnect->error());
                        $isError = true;
                    }
                    $i++;
                }
            }

            sleep(1);
            $themeData['page_content'] = $i . ' ' . $lang['admin_premium_games_installed'] . " - " . $title;
            if ($isError) {
                $themeData['page_content'] = $i ." Error adding new games. - " . $title;
            }
        } else {
            $themeData['page_content'] = "Something went wrong.";
        }
    } elseif ($linksData['name'] == 'autopost_old_games') {
        error_reporting(-1);
        // Get main autopost data
        $mainLinksData = $GameMonetizeConnect->query("SELECT * FROM " . LINKS . " WHERE name = 'autopost' AND is_active = 1");
        $mainLinksData = $mainLinksData->fetch_array();
        
        // Rewrite old games
        $lastId = $linksData['last_id'];
        $currentId = $lastId + 1;
        $gameData = $GameMonetizeConnect->query("SELECT * FROM " . GAMES . " WHERE game_id = '$currentId' AND published = '1' ORDER BY id ");

        // If first access
        if ($gameData && $gameData->num_rows < 1 && $currentId == 1) {
            $gameData = $GameMonetizeConnect->query("SELECT * FROM " . GAMES . " WHERE published = '1' LIMIT 1");
        }

        if ($gameData && $gameData->num_rows > 0) {
            $game = $gameData->fetch_array();

            if ($currentId == 1) {
                $currentId = $game['game_id'];
            }
            // Check max limit
            $lastRewriteGame = $GameMonetizeConnect->query("SELECT game_id FROM " . GAMES . " WHERE is_last_rewrite = '1' LIMIT 1");
            if ($lastRewriteGame && $lastRewriteGame->num_rows < 1) {
                echo "Caution: No last rewrite game limit is set.<br>";
            } else if ($lastRewriteGame && $lastRewriteGame->num_rows > 0) {
                $lastRewriteGame = $lastRewriteGame->fetch_array();
                if ($lastRewriteGame['game_id'] == $currentId) {
                    echo "Last rewrite game reached. No rewrite will be done. Current ID: {$currentId}";
                    die;
                }
            }

            // Rewrite logic
            $updateSuccess = false;

            $gameDescription = !empty($game['description']) ? secureEncode($game['description']) : '';
            if ($gameDescription != "") {
                // Google
                if ($mainLinksData['rewrite_method'] == 'google') {
                    // auto translate some language and back to english
                    $translateLanguage = explode(",", $mainLinksData["google_translate_language"]);
                    $currentLanguage = "en";
                    foreach ($translateLanguage as $index => $language) {
                        $language = trim($language);
                        $gameDescriptionTranslated = googleTranslate($gameDescription, $currentLanguage, $language);
                        if ($gameDescriptionTranslated) {
                            $gameDescription = $gameDescriptionTranslated["data"];
                        }

                        $currentLanguage = $language;
                    }
                    $gameDescription = googleTranslate($gameDescription, $currentLanguage, "en");
                    $gameDescription = $gameDescription["data"];
                }

                // Spinner
                if ($mainLinksData['rewrite_method'] == 'spinner') {
                    error_reporting(-1);
                    include_once './assets/spinner/class.spin.php';

                    $spinner = new wp_auto_spin_spin(1, '', $gameDescription);

                    $spinResult = $spinner->spin();

                    $gameDescription = preg_replace_callback('/{([^}]+)}/', function($matches) {
                        // Split the options by '|'
                        $options = explode('|', $matches[1]);
                        // Randomly select one of the options
                        return $options[array_rand($options)];
                    }, $spinResult);

                }

                if ($mainLinksData['rewrite_method'] == 'spinner' || $mainLinksData['rewrite_method'] == 'google') {
                    // Update existing description
                    $updateGameData = $GameMonetizeConnect->query("UPDATE " . GAMES . " SET description = '{$gameDescription}' WHERE game_id = '$currentId'");
                    
                    if ($updateGameData) {
                        echo "Successfully rewriting game: " . $game['name'];
                        $updateSuccess = true;
                    } else {
                        echo "Failed rewriting game: " . $game['name'];
                        echo "<br>";
                        print_r($GameMonetizeConnect->error);
                    }
                }
                
            } else {
                echo "Game description is empty.";
            }

            // Chatgpt
            if ($mainLinksData['rewrite_method'] == 'chatgpt') {
                rewriteChatgpt($currentId);
                echo "Successfully rewriting game: " . $game['name'];
                $updateSuccess = true;
            }

            
        } else {
            echo "Game not found.";
        }
        
        // Update last id
        $updateGameData = $GameMonetizeConnect->query("UPDATE " . LINKS . " SET last_id = '{$currentId}' WHERE name = 'autopost_old_games'");

        echo "<br>Current id: " . $currentId;
        die;
    } elseif ($linksData['name'] == 'autopost_tags') {
        error_reporting(-1);
        // Get main autopost data
        // $mainLinksData = $GameMonetizeConnect->query("SELECT * FROM " . LINKS . " WHERE name = 'autopost' AND is_active = 1");
        // $mainLinksData = $mainLinksData->fetch_array();
        
        // Rewrite old tags
        // $lastId = $linksData['last_id'];
        // $currentId = is_null($lastId) ? null : $lastId - 1;
        // $tagsData = $GameMonetizeConnect->query("SELECT * FROM " . TAGS . " WHERE id = '$currentId'");
        $tagsData = $GameMonetizeConnect->query("SELECT * FROM " . TAGS . " WHERE is_rewrited = 0 ORDER BY id DESC LIMIT 1");

        // If first access
        // if ($tagsData && $tagsData->num_rows < 1 && $currentId == null) {
        //     $tagsData = $GameMonetizeConnect->query("SELECT * FROM " . TAGS . " ORDER BY id DESC LIMIT 1");
        // }

        if ($tagsData && $tagsData->num_rows > 0) {
            $tags = $tagsData->fetch_array();

            // if ($currentId == null) {
            // }
            $currentId = $tags['id'];

            // Check max limit
            $lastRewriteTags = $GameMonetizeConnect->query("SELECT id FROM " . TAGS . " WHERE is_last_rewrite = '1' LIMIT 1");
            if ($lastRewriteTags && $lastRewriteTags->num_rows < 1) {
                echo "Caution: No last rewrite tags limit is set.<br>";
            } else if ($lastRewriteTags && $lastRewriteTags->num_rows > 0) {
                $lastRewriteTags = $lastRewriteTags->fetch_array();
                if ($lastRewriteTags['id'] == $currentId) {
                    echo "Last rewrite tags reached. No rewrite will be done. Current ID: {$currentId}";
                    die;
                }
            }

            if ($tags['is_rewrited'] != '1') {
                // Rewrite logic
                $updateSuccess = false;
                $rewritedTags = rewriteTags($tags);
                $rewritedTags = hitChatGpt($rewritedTags);
                $updateTags = $GameMonetizeConnect->query("UPDATE " . TAGS . " SET footer_description = \"{$rewritedTags}\", is_rewrited = 1 WHERE id = {$currentId}");
                
                if ($updateTags) {
                    $updateSuccess = true;
                    echo "Successfully rewriting tags: " . $tags['name'];
                } else {
                    echo "Failed to update tags: " . $tags['name'];
                    var_dump($GameMonetizeConnect->error);
                }
            } else {
                echo "This tags is already rewrited, skipping.";
            }
        } else {
            echo "Game not found.";
        }
        
        // Update last id
        $updateGameData = $GameMonetizeConnect->query("UPDATE " . LINKS . " SET last_id = '{$currentId}' WHERE name = 'autopost_tags'");

        echo "<br>Current id: " . $currentId;
        die;
    }
    else {
        $themeData['page_content'] = "Something went wrong.";
    }
} else {
    $themeData['page_content'] = "Something went wrong.";
}

function seo_friendly_url($string)
{
    $string = str_replace(array('[\', \']'), '', $string);
    $string = preg_replace('/\[.*\]/U', '', $string);
    $string = preg_replace('/&(amp;)?#?[a-z0-9]+;/i', '-', $string);
    $string = htmlentities($string, ENT_COMPAT, 'utf-8');
    $string = preg_replace('/&([a-z])(acute|uml|circ|grave|ring|cedil|slash|tilde|caron|lig|quot|rsquo);/i', '\\1', $string);
    $string = preg_replace(array('/[^a-z0-9]/i', '/[-]+/'), '-', $string);
    return strtolower(trim($string, '-'));
}

function rewriteChatgpt($gameId)
{
    error_reporting(-1);
    global $GameMonetizeConnect;

    $get_game = getGame($gameId);
    if ($get_game) {
        $game_tags = [];
        if ($get_game['tags_ids'] != 'null' && !is_null($get_game['tags_ids'])) {
            $game_tags = json_decode($get_game['tags_ids']);
        }
        $addgame_tags = $GameMonetizeConnect->query("SELECT * FROM " . TAGS . " WHERE id!=0");
        $tags_option = '';
        $tags_click_copy = '';
        while ($select_tags = $addgame_tags->fetch_array()) {
            if (in_array("{$select_tags['id']}", $game_tags)) {
                $tags_option .= '<option value="' . $select_tags['id'] . '" selected>' . $select_tags['name'] . '</option>';

                // Tags click copy
                $themeData['tags_url_copy'] = siteUrl() . "/tag/" . $select_tags['url'];
                $themeData['tags_name_copy'] = $select_tags['name'];
                $tags_click_copy .= \GameMonetize\UI::view('admin/sections/tags-click-copy');
            } else {
                $tags_option .= '<option value="' . $select_tags['id'] . '">' . $select_tags['name'] . '</option>';
            }
        }
        $themeData['edit_game_tags'] = $tags_option;
        $themeData['tags_click_to_copy'] = $tags_click_copy;

        $gameNameExplode = explode(' ', $get_game['name']);
        $firstName = substr($gameNameExplode[0], 0, 4);
        $secondName = substr($gameNameExplode[1], 0, 4);
        $threeRandomGame = array();

        // First word similar
        $first_name_click_copy = '';
        $sqlQuerySimilar = $GameMonetizeConnect->query("SELECT * FROM " . GAMES . " WHERE name LIKE '%{$firstName}%' AND published='1' AND name != '{$get_game['name']}' ORDER BY name ASC LIMIT 10");
        if ($sqlQuerySimilar->num_rows > 0) {
            while ($similarGames = $sqlQuerySimilar->fetch_array()) {
                $themeData['tags_url_copy'] = siteUrl() . "/game/" . $similarGames['game_name'];

                $firstWordRandomGame = $threeRandomGame[0] = "<a href='{$themeData['tags_url_copy']}' target='_self' class='gameKeyword'><bold>{$similarGames['name']}</bold></a>";

                $themeData['tags_name_copy'] = $similarGames['name'];
                $first_name_click_copy .= \GameMonetize\UI::view('admin/sections/tags-click-copy');
            }
        }

        $themeData['first_word_click_to_copy'] = $first_name_click_copy;

        // Second word similar
        $second_name_click_copy = '';
        $sqlQuerySimilar = $GameMonetizeConnect->query("SELECT * FROM " . GAMES . " WHERE name LIKE '%{$secondName}%' AND published='1' AND name != '{$get_game['name']}' ORDER BY name ASC LIMIT 10");
        if ($sqlQuerySimilar->num_rows > 0) {
            while ($similarGames = $sqlQuerySimilar->fetch_array()) {
                $themeData['tags_url_copy'] = siteUrl() . "/game/" . $similarGames['game_name'];
                $secondWordRandomGame = $threeRandomGame[1] = "<a href='{$themeData['tags_url_copy']}' target='_self' class='gameKeyword'><bold>{$similarGames['name']}</bold></a>";

                $themeData['tags_name_copy'] = $similarGames['name'];
                $second_name_click_copy .= \GameMonetize\UI::view('admin/sections/tags-click-copy');
            }
        }

        $themeData['second_word_click_to_copy'] = $second_name_click_copy;

        // Random word similar
        $oneRandomGame = "";
        $random_name_click_copy = '';
        $sqlQuerySimilar = $GameMonetizeConnect->query("SELECT * FROM " . GAMES . " WHERE  published='1' AND name != '{$get_game['name']}' ORDER BY RAND() LIMIT 10");
        if ($sqlQuerySimilar->num_rows > 0) {
            $index = 0;
            while ($similarGames = $sqlQuerySimilar->fetch_array()) {
                $themeData['tags_url_copy'] = siteUrl() . "/game/" . $similarGames['game_name'];
                $oneRandomGame = "<a href='{$themeData['tags_url_copy']}' target='_self' class='gameKeyword'><bold>{$similarGames['name']}</bold></a>";

                $themeData['tags_name_copy'] = $similarGames['name'];
                $random_name_click_copy .= \GameMonetize\UI::view('admin/sections/tags-click-copy');
                if ($index > 1) {
                    $thirdRandomGame = siteUrl() . "/game/" . $similarGames['game_name'];
                    $threeRandomGame[2] = "<a href='{$thirdRandomGame}' target='_self' class='gameKeyword'><bold>{$similarGames['name']}</bold></a>";
                }
                $index++;
            }
        }

        // Chatgpt template
        $chatgpt_query = $GameMonetizeConnect->query("SELECT * FROM " . CHATGPT . " WHERE id!=0");
        if ($chatgpt_query && $chatgpt_query->num_rows > 0) {
            $chatgpt_data = $chatgpt_query->fetch_assoc();

            $gameDescription = $get_game['description'];
            $gameTitle = $get_game['name'];
            if (!empty($game_tags)) {
                $beforeWordArray = explode(",", $chatgpt_data['random_words_before_tags']);
                $afterWordArray = explode(",", $chatgpt_data['random_words_after_tags']);

                $allRandomBeforeAfter = [];
                $allGameTagsIds = implode(",", $game_tags);
                $allGameTags = [];
                $gameTags = $GameMonetizeConnect->query("SELECT * FROM " . TAGS . " WHERE id IN({$allGameTagsIds}) ");
                $allRandomSimTagLink = [];
                while ($tagsData = $gameTags->fetch_array()) {
                    $beforeWord = $beforeWordArray[array_rand($beforeWordArray)] . " ";
                    $afterWord = " " . $afterWordArray[array_rand($afterWordArray)];
                    $allGameTags[] = $beforeWord . $tagsData['name'] . $afterWord;

                    $randomSimTagLink = siteUrl() . "/tag/" . $tagsData['url'];
                    $randomSimTagName = $tagsData['name'];
                    $allRandomSimTagLink[] = "<a href='{$randomSimTagLink}' target='_self' class='gameKeyword'><bold>{$randomSimTagName} Games</bold></a>";
                }

                $randomSimTagLink = $allRandomSimTagLink[array_rand($allRandomSimTagLink)];

                $gameTags = implode(",", $allGameTags);
            }

            $gameCategory = $GameMonetizeConnect->query("SELECT * FROM " . CATEGORIES . " WHERE id = '{$get_game['category']}'");
            if ($gameCategory) {
                $gameCategory = $gameCategory->fetch_assoc();
                $gameCategory = !empty($gameCategory['name']) ? $gameCategory['name'] : "";
            } else {
                $gameCategory = "";
            }

            // Random similar tag
            // $randomSimTag = $GameMonetizeConnect->query("SELECT * FROM " . TAGS . " ORDER BY RAND() LIMIT 1");
            // $randomSimTag = $randomSimTag->fetch_assoc();
            // $randomSimTagLink = siteUrl() . "/tag/" . $randomSimTag['url'];
            // $randomSimTagName = ucfirst($randomSimTag['name']);
            // $randomSimTagLink = "<a href='{$randomSimTagLink}' target='_self' class='gameKeyword'><bold>{$randomSimTagName} Games</bold></a>";

            // Random tag link
            $randomTag = $GameMonetizeConnect->query("SELECT * FROM " . TAGS . " ORDER BY RAND() LIMIT 1");
            $randomTag = $randomTag->fetch_assoc();
            $randomTagLink = siteUrl() . "/tag/" . $randomTag['url'];
            $randomTagName = ucfirst($randomTag['name']);
            $randomTagLink = "<a href='{$randomTagLink}' target='_self' class='gameKeyword'><bold>{$randomTagName} Games</bold></a>";
            $themeData['chat_gpt_template_game'] = str_replace(
                [
                    "\$description",
                    "\$title",
                    "\$tags",
                    "\$category",
                    "\$game_link",
                    "\$game_first_word",
                    "\$game_second_word",
                    "\$three_random_game",
                    "\$random_similar_tags",
                    "\$random_tags_link",
                ],
                [
                    $gameDescription,
                    $gameTitle,
                    $gameTags,
                    $gameCategory,
                    $oneRandomGame,
                    $firstWordRandomGame,
                    $secondWordRandomGame,
                    implode(",", $threeRandomGame),
                    $randomSimTagLink,
                    $randomTagLink
                ],
                $chatgpt_data['template_game']
            );
            
            // Get rewrited text
            $chatGptResult = hitChatGpt($themeData['chat_gpt_template_game']);
            if ($chatGptResult !== false) {
                // Update
                // $isSuccessUpdate = $GameMonetizeConnect->query("UPDATE " . GAMES . " SET description = '{$chatGptResult}' WHERE game_id = $gameId");
                $stmt = $GameMonetizeConnect->prepare("UPDATE " . GAMES . " SET description = ? WHERE game_id = ?");
                if ($stmt) {
                    $gameDescription = convertBoldTags($chatGptResult);
                    // Bind the variables to the parameter as strings.
                    $stmt->bind_param("si", $gameDescription, $gameId);

                    // Execute the statement
                    $isSuccessUpdate = $stmt->execute();

                    // Check for successful update
                    // if ($isSuccessUpdate) {
                    //     echo "Update successful.";
                    // } else {
                    //     echo "Update failed: " . $stmt->error;
                    // }

                    // Close the statement
                    $stmt->close();
                    
                    return true;
                } else {
                    echo "Prepare failed: " . $GameMonetizeConnect->error;
                    return false;
                }
            } else {
                var_dump($chatGptResult);
                return false;
            }
        }
    }
}

function hitChatGpt($textToRewrite)
{
    global $GameMonetizeConnect;
    
    $chatgptSetting = $GameMonetizeConnect->query("SELECT * FROM " . CHATGPT . "");
    if ($chatgptSetting && $chatgptSetting->num_rows < 1) {
        echo "Failed to get chatgpt setting.";
        return false;
    }

    $chatgptSetting = $chatgptSetting->fetch_assoc();
    $chatgpt_model = $chatgptSetting['chatgpt_model'];
    $api_key = $chatgptSetting['api_key'];

    $postData = [
        'model' => $chatgpt_model,
        // 'model' => 'gpt-3.5-turbo',
        // 'model' => 'gpt-4',
        // 'model' => 'gpt-4-turbo',
        'messages' => [
            [
                'role' => 'system',
                'content' => 'You are a game description rephrasing or rewriter assistant. Please do the instruction that i will give. Always include html links if i asked to. Separate the result into some paragraphs with <p> tag.'
            ],
            [
                'role' => 'user',
                'content' => $textToRewrite
            ]
        ]
    ];

    // Initialize a cURL session
    $ch = curl_init('https://api.openai.com/v1/chat/completions');

    // Set the options for the cURL session
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $api_key,
    ]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));

    // Execute the cURL session and store the response
    $response = curl_exec($ch);

    // Close the cURL session
    curl_close($ch);

    $response = json_decode($response);
    if ($response != null && isset($response->choices)) {
        $response = $response->choices[0]->message->content;
        $data['status'] = 200;
        return $response;
    }

    echo "Error from chatgpt: ";
    print_r($response);
    return false;
    // return false;
}

function convertBoldTags($text) {
    // Use regex to find **text** and replace with <b>text</b>
    $pattern = '/\*\*(.*?)\*\*/';
    $replacement = '<b>$1</b>';
    return preg_replace($pattern, $replacement, $text);
}

function rewriteTags($edit_tags)
{
    global $GameMonetizeConnect;

        $themeData['edit_tags_id'] = $edit_tags['id'];
        $themeData['edit_tags_name'] = $edit_tags['name'];
        $themeData['edit_tags_footer_description'] = $edit_tags['footer_description'];
        $themeData['edit_tags_url'] = siteUrl() . '/tag/' . $edit_tags['url'];

        $chatgpt_query = $GameMonetizeConnect->query("SELECT * FROM " . CHATGPT . " WHERE id!=0");
        if ($chatgpt_query && $chatgpt_query->num_rows > 0) {
            $chatgpt_data = $chatgpt_query->fetch_assoc();

            $tagsDescription = $edit_tags['footer_description'];
            $tagsTitle = $edit_tags['name'];

            $tagsRandomGame = '';
            $sqlQuerySimilar = $GameMonetizeConnect->query("SELECT * FROM " . GAMES . " WHERE tags_ids LIKE '%\"{$edit_tags['id']}\"%' AND published='1' ORDER BY RAND() LIMIT 1");
            if ($sqlQuerySimilar->num_rows > 0) {
                while ($similarGames = $sqlQuerySimilar->fetch_array()) {
                    $tagsRandomGame = siteUrl() . "/game/" . $similarGames['game_name'];
                    $tagsRandomGame = "<a href='{$tagsRandomGame}' target='_self' class='gameKeyword'><bold>{$similarGames['name']}</bold></a>";

                }
            }

            $firstWordGame = $secondWordGame = $firstWordTagTitle = $secondWordTagTitle = "";

            // First word game
            $tagsTitleExploded = explode(" ", $tagsTitle);

            $firstWordTagTitle = substr($tagsTitleExploded[0], 0, 4);
            $sqlGameFirstWord = $GameMonetizeConnect->query("SELECT * FROM " . GAMES . " WHERE name LIKE '%{$firstWordTagTitle}%' AND published='1' LIMIT 1");
            if ($sqlGameFirstWord && $sqlGameFirstWord->num_rows > 0) {
                $firstGameData = $sqlGameFirstWord->fetch_array();
                $firstGameLink = siteUrl() . "/game/" . $firstGameData['game_name'];
                $firstWordGame = "<a href='{$firstGameLink}' target='_self' class='gameKeyword'><bold>{$firstGameData['name']}</bold></a>";
            }

            if ($sqlGameFirstWord->num_rows > 0) {
                while ($similarGames = $sqlQuerySimilar->fetch_array()) {
                    $tagsRandomGame = siteUrl() . "/game/" . $similarGames['game_name'];
                    $tagsRandomGame = "<a href='{$tagsRandomGame}' target='_self' class='gameKeyword'><bold>{$similarGames['name']}</bold></a>";
                }
            }

            if (count($tagsTitleExploded) > 1) {
                $secondWordTagTitle = $tagsTitleExploded[1];

                $sqlGameSecondWord = $GameMonetizeConnect->query("SELECT * FROM " . GAMES . " WHERE name LIKE '%{$secondWordTagTitle}%' AND published='1' LIMIT 1");

                if ($sqlGameSecondWord && $sqlGameSecondWord->num_rows > 0) {
                    $secondGameData = $sqlGameSecondWord->fetch_array();
                    $secondGameLink = siteUrl() . "/game/" . $secondGameData['game_name'];
                    $secondWordGame = "<a href='{$secondGameLink}' target='_self' class='gameKeyword'><bold>{$secondGameData['name']}</bold></a>";
                }
            }

            // Random games
            $sqlRandomGame = $GameMonetizeConnect->query("SELECT * FROM " . GAMES . " WHERE published='1' ORDER BY RAND() LIMIT 1");

            if ($sqlRandomGame && $sqlRandomGame->num_rows > 0) {
                $randomGameData = $sqlRandomGame->fetch_array();
                $randomGameLink = siteUrl() . "/game/" . $randomGameData['game_name'];
                $randomGame = "<a href='{$randomGameLink}' target='_self' class='gameKeyword'><bold>{$randomGameData['name']}</bold></a>";
            }

            // Random tags
            $sqlRandomTags = $GameMonetizeConnect->query("SELECT * FROM " . TAGS . " ORDER BY RAND() LIMIT 1");

            if ($sqlRandomTags && $sqlRandomTags->num_rows > 0) {
                $randomTagsData = $sqlRandomTags->fetch_array();
                $randomTagsLink = siteUrl() . "/tag/" . $randomTagsData['url'];
                $randomTags = "<a href='{$randomTagsLink}' target='_self' class='gameKeyword'><bold>{$randomTagsData['name']} Games</bold></a>";
                $randomTagText = "{$randomTagsData['name']} Games";
            }

            // Tags with random before and after words
            $beforeWordArray = explode(",", $chatgpt_data['random_words_before_tags']);
            $afterWordArray = explode(",", $chatgpt_data['random_words_after_tags']);

            $allRandomBeforeAfter = [];
            for ($i = 0; $i < 10; $i++) {
                $beforeWord = $beforeWordArray[array_rand($beforeWordArray)] . " ";
                $afterWord = " " . $afterWordArray[array_rand($afterWordArray)];
                $allRandomBeforeAfter[] = $beforeWord . $tagsTitle . $afterWord;
            }
            $allRandomBeforeAfter = implode(",", $allRandomBeforeAfter);

            $chatGptTemplateTags = str_replace(
                [
                    "\$description",
                    "\$title",
                    "\$game_link",
                    "\$firstWord",
                    "\$secondWord",
                    "\$randomSimGames",
                    "\$randomSimTags",
                    "\$randomSimTagBeforeAfter",
                ],
                [
                    $tagsDescription,
                    $tagsTitle,
                    $tagsRandomGame,
                    $firstWordGame,
                    $secondWordGame,
                    $randomGame,
                    $randomTags,
                    $allRandomBeforeAfter,
                ],
                $chatgpt_data['template_tags']
            );

            $chatGptTemplateTags = str_replace('"', "'", $chatGptTemplateTags);
            return $chatGptTemplateTags;
        }
}