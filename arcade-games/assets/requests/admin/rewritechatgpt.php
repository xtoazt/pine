<?php
if (!defined('R_PILOT')) {
    exit();
}

$textToRewrite = $_POST['text'];

// Get chatgpt settings
$chatgptSetting = $GameMonetizeConnect->query("SELECT * FROM " . CHATGPT . "");
if ($chatgptSetting && $chatgptSetting->num_rows > 0) {
    $chatgptSetting = $chatgptSetting->fetch_assoc();

    $api_key = $chatgptSetting['api_key'];
    $template_game = $chatgptSetting['template_game'];
    $chatgpt_model = $chatgptSetting['chatgpt_model'];
    $maximum_words = $chatgptSetting['maximum_words'];

    if(str_word_count($textToRewrite) <= $maximum_words) {
        if (strlen($api_key) > 1) {
            if (strlen($textToRewrite) > 2) {
                $postData = [
                    'model' => $chatgpt_model,
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => 'You are a game description rephrasing or rewriter assistant. Please do the instruction that i will give. Always include html links if i asked to.'
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
                    $data['rewrite_result'] = convertBoldTags($response);
                } else {
                    $data['error_message'] = "Invalid response from ChatGPT.";
                }
            } else {
                $data['error_message'] = "Text too short.";
            }
        } else {
            $data['error_message'] = "Invalid API Key.";
        }
    } else {
        $data['error_message'] = "Exceeded maximum words limit.";
    }

    // // Data preparation
    // $get_game = getGame($_POST['game_id']);
    // $gameDescription = $get_game['description'];
    // $gameTitle = $get_game['name'];
    // $gameNameExplode = explode(' ', $get_game['name']);
    // $firstName = substr($gameNameExplode[0], 0, 4);
    // $secondName = substr($gameNameExplode[1], 0, 4);

    // $game_tags = [];
    // if ($get_game['tags_ids'] != 'null' && !is_null($get_game['tags_ids'])) {
    //     $game_tags = json_decode($get_game['tags_ids']);
    // }
    // if (!empty($game_tags)) {
    //     $gameTags = $GameMonetizeConnect->query("SELECT * FROM " . TAGS . " WHERE id = '{$game_tags[0]}'",);
    //     $gameTags = $gameTags->fetch_assoc();
    //     $gameTags = $gameTags['name'];
    // }

    // $gameCategory = $GameMonetizeConnect->query("SELECT * FROM " . CATEGORIES . " WHERE id = '{$get_game['category']}'");
    // if ($gameCategory) {
    //     $gameCategory = $gameCategory->fetch_assoc();
    //     $gameCategory = $gameCategory['name'];
    // }

    // $threeRandomGame = array();
    // $oneRandomGame = "";

    // // Random similar
    // $sqlQuerySimilar = $GameMonetizeConnect->query("SELECT * FROM ".GAMES." WHERE  published='1' AND name != '{$get_game['name']}' ORDER BY RAND() LIMIT 2");

    // if ($sqlQuerySimilar->num_rows > 0) {
    //     $index = 0;
    //     while($similarGames = $sqlQuerySimilar->fetch_array()){
    //         if($index >= 1){
    //             $threeRandomGame[] = siteUrl() . "/game/" . $similarGames['game_name'];
    //         } else {
    //             $oneRandomGame = siteUrl() . "/game/" . $similarGames['game_name'];
    //         }
    //         $i++;
    //     }
    // }

    // // First word similar
    // $firstWordRandomGame = '';
    // $sqlQuerySimilar = $GameMonetizeConnect->query("SELECT * FROM ".GAMES." WHERE name LIKE '%{$firstName}%' AND published='1' AND name != '{$get_game['name']}' ORDER BY RAND() ASC LIMIT 2");
    // if ($sqlQuerySimilar->num_rows > 0) {
    //     $index = 0;
    //     while($similarGames = $sqlQuerySimilar->fetch_array()){
    //         if($index >= 1){
    //             $threeRandomGame[] = siteUrl() . "/game/" . $similarGames['game_name'];
    //         } else {
    //             $firstWordRandomGame = siteUrl() . "/game/" . $similarGames['game_name'];
    //         }
    //         $i++;
    //     }
    // }

    // // Second word similar
    // $secondWordRandomGame = '';
    // $sqlQuerySimilar = $GameMonetizeConnect->query("SELECT * FROM ".GAMES." WHERE name LIKE '%{$secondName}%' AND published='1' AND name != '{$get_game['name']}' ORDER BY RAND() ASC LIMIT 1");
    // if ($sqlQuerySimilar->num_rows > 0) {
    //     $index = 0;
    //     while($similarGames = $sqlQuerySimilar->fetch_array()){
    //         if($index >= 1){
    //             $threeRandomGame[] = siteUrl() . "/game/" . $similarGames['game_name'];
    //         } else {
    //             $secondWordRandomGame = siteUrl() . "/game/" . $similarGames['game_name'];
    //         }
    //         $i++;
    //     }
    // }

    // $templateGame = str_replace(
    //     [
    //         "\$description",
    //         "\$title",
    //         "\$tags",
    //         "\$category",
    //         "\$game_link",
    //         "\$game_first_word",
    //         "\$game_second_word",
    //         "\$three_random_game",
    //     ],
    //     [
    //         $gameDescription,
    //         $gameTitle,
    //         $gameTags,
    //         $gameCategory,
    //         $oneRandomGame,
    //         $firstWordRandomGame,
    //         $secondWordRandomGame,
    //         implode(",", $threeRandomGame),
    //     ],
    //     $template_game
    // );
} else {
    $data['error_message'] = "Chatgpt setting not found.";
}

function convertBoldTags($text) {
    // Use regex to find **text** and replace with <b>text</b>
    $pattern = '/\*\*(.*?)\*\*/';
    $replacement = '<b>$1</b>';
    return preg_replace($pattern, $replacement, $text);
}
