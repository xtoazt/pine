<?php
$date =  time();
$themeData['cms'] = "<script type='text/javascript' src='https://api.gamemonetize.com/cms.js?" . $date . "'></script>";
$themeData['ima_sdk'] = "<script type='text/javascript'  src='//imasdk.googleapis.com/js/sdkloader/ima3.js'></script>
<script type='text/javascript' src='https://api.gamemonetize.com/imasdk.js?" . $date . "'></script>";
$ads_video_code = getADS('ads_video');
if ($ads_video_code) { 
    if (!preg_match('/\bdescription_url\b/', $ads_video_code)) {
        $themeData['ads_video'] = $ads_video_code . '&description_url=" + encodeURIComponent(descriptionURL) + "&correlator=' . $date;
    }
}
if (!empty($_GET['id'])) {
    $get_game_id = $_GET['id'];

    $get_game = getGame2($get_game_id);

    if ($get_game) {
        $get_game_data = gameData($get_game);
        $themeData['ads_header'] = getADS('728x90');
        $themeData['ads_header_display'] = '';
        $themeData['game_col_margin_top'] = 0;
        if(strlen($themeData['ads_header']) < 1){
            $themeData['game_col_margin_top'] = 85;
            $themeData['ads_header_display'] = 'none';
        }
        if($themeData['config_is_sidebar_enabled'] == 1){
            $themeData['game_col_margin_top'] = 10;
        }
        $themeData['ads_header_hide'] = "";
        if ($themeData['ads_header'] == "") {
            $themeData['ads_header_hide'] = "hide";
        }
        $actual_link = $config['theme_path'];
        if (getADS('300x250') != "") {
            $themeData['ads_footer'] = getADS('300x250');
        } else {
            $themeData['ads_footer'] = '<a class="ad300" href="https://gamemonetize.com/" target="_blank" style="display: inline;"><img src="' . $actual_link . '/image/banner/1450344261.jpg"></a>
                    <a class="ad300" href="https://gamemonetize.com/" target="_blank" style="display: none;"><img src="' . $actual_link . '/image/banner/1448529775.jpg"></a>
                    <a class="ad300" href="https://gamemonetize.com/" target="_blank" style="display: none;"><img src="' . $actual_link . '/image/banner/1453363439.jpg"></a>
                    <a class="ad300" href="https://gamemonetize.com/" target="_blank" style="display: none;"><img src="' . $actual_link . '/image/banner/1449131593.jpg"></a>
                    <a class="ad300" href="https://gamemonetize.com/" target="_blank" style="display: none;"><img src="' . $actual_link . '/image/banner/1455786054.jpg"></a>
                    <a class="ad300" href="https://gamemonetize.com/" target="_blank" style="display: none;"><img src="' . $actual_link . '/image/banner/1456391965.jpg"></a>
                    <a class="ad300" href="https://gamemonetize.com/" target="_blank" style="display: none;"><img src="' . $actual_link . '/image/banner/1450951822.jpg"></a>
                    <a class="ad300" href="https://gamemonetize.com/" target="_blank" style="display: none;"><img src="' . $actual_link . '/image/banner/1449733199.jpg"></a>';
        }
        $sidebar_ads = getADS('600x300');
        if ($sidebar_ads != "") {
            $themeData['ads_sidebar'] = '<div class="ad160 bgs fn-left">
                                                    ' . $sidebar_ads . '
                                                </div>';
        } else {
            $themeData['ads_sidebar'] = '<div class="fn-left" style="width: 160px;text-align: center;padding: 10px;"></div>';
        }
        $themeData['play_game_embed'] = $get_game_data['embed'];
        $themeData['play_game_embed2'] = $get_game_data['file'];
        $themeData['play_game_name'] = $get_game_data['name'];
        $themeData['play_game_image'] = $get_game_data['image_url'];
        preg_match("/\/([a-zA-Z0-9]+)\//", $get_game_data['image_url'], $matches);
		$baseImagePath = $_SERVER['DOCUMENT_ROOT'] . '/games-image/' . $matches[1] . '/250x150.webp';
		if (file_exists($baseImagePath)) {
			$themeData['play_game_image'] = str_replace($_SERVER['DOCUMENT_ROOT'], '', $baseImagePath);
		} else {
			$themeData['play_game_image'] = $get_game_data['image_url'];
		}
        $themeData['play_game_url'] = $get_game_data['game_url'];
        $themeData['play_game_date'] = $get_game_data['date_added'];
        $themeData['play_game_plays'] = $get_game_data['plays'];
        // replace &lt; and &gt; with < and >
        $description = str_replace(array('&lt;', '&gt;', '&#039;'), array('<', '>', ''), $get_game_data['description']);
        $description = preg_replace('/\[(.*?)\]\((https?:\/\/[^\)]+)\)/', '<a href="$2">$1</a>', $description);
        $themeData['play_game_desc'] = html_entity_decode(html_entity_decode($description), ENT_QUOTES, 'UTF-8');
        $themeData['play_game_inst'] = $get_game_data['instructions'];
        $themeData['play_game_rating'] = $get_game['rating'];
        $themeData['play_game_id'] = $get_game['game_id'];
        $themeData['play_game_display'] = ($config['ads_status']) ? 'display:none;' : '';
        $themeData['play_game_video_url'] = $get_game['video_url'];
        $themeData['play_game_category_name'] = $get_game['category_name'];
        $themeData['play_game_category_image'] = $get_game['category_image'];
        $themeData['play_game_category_url'] = slugify($get_game['category_name']);
        $themeData['play_game_walkthrough'] = "";
        if(strlen($get_game['video_url'])){
            $themeData['play_game_walkthrough'] = "<a href='".$get_game['video_url']."' target='_blank'>Walkthrough</a>";
        }

        $similarGames = getSidebarWidget('similar-name', $get_game_data['name']);
        $themeData['play_sidebar_widgets'] = $similarGames[0];
        
        if ($config['site_theme'] != 'poki-like') {
            $anotherSimilarGames = getSidebarWidget('similar-name', $get_game_data['name'], $similarGames[1]);
            $themeData['play_sidebar_widgets2'] = $anotherSimilarGames[0];

            $themeData['play_sidebar_widgets3'] = getSidebarWidget('random');
            // $themeData['play_sidebar_widgets5'] = getSidebarWidget('top-user');
            //$themeData['play_game_featured'] = getFeaturedGames();
            //$themeData['play_widget_carousel_random_games'] = getCarouselWidget('carousel_random_games', 3);
            $themeData['play_game_ads_counter'] = ($config['ads_status']) ? \GameMonetize\UI::view('game/play-ads-counter') : '';
        }


        $themeData['description_url'] = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
        /* Main page content */
        $gameImage = explode("/", $themeData['game_meta_image']);
        $themeData['game_unique_id'] = $gameImage[3];
        $themeData['game_video_url'] = $get_game_data['wt_video'];

        preg_match('/([^\/]+\.mp4)$/', $get_game_data['wt_video'], $matches);
        $baseVideoThumbPath = $_SERVER['DOCUMENT_ROOT'] . '/games-thumb-video/' . $matches[1];
        if (file_exists($baseVideoThumbPath)) {
            $themeData['game_video_url'] = str_replace($_SERVER['DOCUMENT_ROOT'], '', $baseVideoThumbPath);
        } else {
            $themeData['game_video_url'] = $get_game_data['wt_video'];
        }

        // Game tags
        $gameTags = $get_game["tags_ids"];
        $tags_list = "";

        if (!is_null($gameTags) && $gameTags != 'null') {
            if ($config['site_theme'] == 'crazygames-like') {
                $themeData['tags_url'] = siteUrl() . "/category/" . slugify($get_game['category_name']);
                $themeData['tags_name'] = $get_game['category_name'];

                $themeData['tags_number'] = $get_game['category_total_games'];
                $tags_list .= \GameMonetize\UI::view('game/tags/tags-list');
            }
            
            $gameTags = str_replace("[", "(", $gameTags);
            $gameTags = str_replace("]", ")", $gameTags);
            $sqlGetTags = "SELECT * FROM " . TAGS . " WHERE id IN{$gameTags} ORDER BY name";
            $sqlQueryTags = $GameMonetizeConnect->query($sqlGetTags);
            
            if ($sqlQueryTags->num_rows > 0) {
                $firstTag = $sqlQueryTags->fetch_array();
                $themeData['play_game_first_tag_name'] = $firstTag['name'];
                $themeData['play_game_first_tag_url'] = $firstTag['url'];

                $sqlQueryTags->data_seek(0);

                while ($tags = $sqlQueryTags->fetch_assoc()) {
                    $themeData['tags_url'] = siteUrl() . "/tag/" . $tags['url'];
                    $themeData['tags_name'] = ucwords($tags['name']);

                    $baseTagImagePath = 'tag-img/' . slugify($tags['name']);
                    $formats = ['.png', '.webp'];
                    $defaultTagImagePath = '../templates/poki-like/image/tag.png';

                    $themeData['tags_image'] = $defaultTagImagePath;

                    $themeData['tags_number'] = $tags['total_games'];

                    foreach ($formats as $format) {
                        if (file_exists($baseTagImagePath . $format)) {
                            $themeData['tags_image'] = "../" . $baseTagImagePath . $format;
                            break;
                        }
                    }

                    //$tag['image'] == '' ? $themeData['tags_image'] = '../templates/poki-like/image/tag.png' : $themeData['tags_image'] = $tag['image'];
                    $tags_list .= \GameMonetize\UI::view('game/tags/tags-list');
                    if ($config['site_theme'] == 'poki-like') {
                        $tag_list_grid .= \GameMonetize\UI::view('game/tags/tag-list-grid');
                    }
                }
            } else {
                $tags_list .= "No tags found.";
            }

            $themeData["tags_list"] = $tags_list;
            $themeData['tags_list_grid'] = $tag_list_grid;
        }

        
	    $themeData['ads_300'] = getADS('300x250_main');

        $themeData["play_game_tags"] = \GameMonetize\UI::view('game/tags/tags-element');
        $themeData["play_container_css"] = "play-game-page-container";

        if ($config['site_theme'] == 'crazygames-like') {
            if (isset($_SERVER['HTTP_USER_AGENT']) && preg_match('/(tablet|ipad|playbook)|(android(?!.*(mobi|opera mini)))/i', strtolower($_SERVER['HTTP_USER_AGENT']))) {
                $themeData['page_content'] = \GameMonetize\UI::view('game/play');
            } elseif (isset($_SERVER['HTTP_USER_AGENT']) && preg_match('/(mobile|android|touch|webos|hpwos)/i', strtolower($_SERVER['HTTP_USER_AGENT']))) {
                $themeData['page_content'] = \GameMonetize\UI::view('game/play');
            } else {
                $themeData['page_content'] = \GameMonetize\UI::view('game/play-desktop');
            }
        } else {
            $themeData['page_content'] = \GameMonetize\UI::view('game/play');
        }
    } else {
        $themeData['page_content'] = \GameMonetize\UI::view('game/error');
    }
} else {
    $themeData['page_content'] = \GameMonetize\UI::view('game/error');
}
