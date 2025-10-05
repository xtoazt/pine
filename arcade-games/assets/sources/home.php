<?php
	$themeData['ads_300'] = getADS('300x250_main');
	$themeData['ads_top'] = getADS('728x90_main');
	$date =  date('Ymdms');
	$date = strtotime($date);
	$themeData['cms'] = "<script src='https://api.gamemonetize.com/cms.js?". $date . "'></script>";

	
	if ($config['site_theme'] == 'poki-like') {
		$newGames_query = $GameMonetizeConnect->query("SELECT * FROM ".GAMES." WHERE published='1' ORDER BY date_added DESC LIMIT 85");
	} elseif ($config['site_theme'] == 'crazygames-like') {
		$newGames_query = $GameMonetizeConnect->query("SELECT g.*, c.name as category_name, c.image as category_image FROM ".GAMES." g JOIN ".CATEGORIES." c ON g.category = c.id WHERE g.published='1' ORDER BY g.plays DESC, g.date_added DESC LIMIT 30");
	} else {
		$newGames_query = $GameMonetizeConnect->query("SELECT * FROM ".GAMES." WHERE published='1' ORDER BY date_added desc, featured_sorting desc LIMIT 65");
	}

	$ngm_r = '';
	$ngm_top = '';
	$ids = '';
	$counter = 0;
	while ($newGames = $newGames_query->fetch_array()) {
		$newGame_data = gameData($newGames);
		$themeData['new_game_url'] = $newGame_data['game_url'];
		
		preg_match("/\/([a-zA-Z0-9]+)\//", $newGame_data['image_url'], $matches);
		$baseImagePath = $_SERVER['DOCUMENT_ROOT'] . '/games-image/' . $matches[1] . '/250x150.webp';
		if (file_exists($baseImagePath)) {
			$themeData['new_game_image'] = str_replace($_SERVER['DOCUMENT_ROOT'], '', $baseImagePath);
		} else {
			$themeData['new_game_image'] = $newGame_data['image_url'];
		}

		preg_match('/([^\/]+\.mp4)$/', $newGames['wt_video'], $matches);
		$baseVideoThumbPath = $_SERVER['DOCUMENT_ROOT'] . '/games-thumb-video/' . $matches[1];
		if (file_exists($baseVideoThumbPath)) {
			$themeData['new_game_wt_video'] = str_replace($_SERVER['DOCUMENT_ROOT'], '', $baseVideoThumbPath);
		} else {
			$themeData['new_game_wt_video'] = $newGames['wt_video'];
		}

		$themeData['new_game_name'] = $newGame_data['name'];
		$themeData['new_game_video_url'] = $newGames['video_url'];
		$themeData['new_game_image_alt'] = $newGame_data['name'];
		
		$themeData['new_game_featured'] = $newGame_data['featured'];

		$ids .= $newGames['game_id'] .',';
		$themeData['new_game_name_1'] = '';
		
		$counter++;
		
		if ($config['site_theme'] == 'crazygames-like') {
			if (isset($_SERVER['HTTP_USER_AGENT']) && preg_match('/(tablet|ipad|playbook)|(android(?!.*(mobi|opera mini)))/i', strtolower($_SERVER['HTTP_USER_AGENT'])) || isset($_SERVER['HTTP_USER_AGENT']) && preg_match('/(mobile|android|touch|webos|hpwos)/i', strtolower($_SERVER['HTTP_USER_AGENT']))) {
				if ($counter > 5) {
					$themeData['new_game_name_1'] = "<div class='flex items-center space-x-5'>
								<img src='{$themeData['new_game_image']}' alt='{$newGame_data['name']}' loading='lazy' class='object-cover rounded-lg size-10 shrink-0'>
								<div class='flex-1 truncate'>
									<div class='text-base font-bold text-white truncate'>{$newGame_data['name']}</div>
									<div class='text-sm font-bold text-white text-opacity-50 truncate'>{$newGame_data['category_name']}</div>
								</div>
								<div class='flex items-center justify-center pl-1 rounded-full size-10 bg-violet-500 shrink-0'><i class='text-xl text-white fa fa-play' aria-hidden='true'></i></div>
							</div>";

					$ngm_r .= \GameMonetize\UI::view('game/list-each/new-games-list');
				} else {
					$themeData['new_game_name'] = '';
					$themeData['new_game_name_1'] = "<div class='flex items-end w-full space-x-4'>
								<img src='{$themeData['new_game_image']}' alt='{$newGame_data['name']}' loading='lazy' class='rounded-lg size-[46px] object-cover shrink-0'>
								<div class='flex-1 truncate'>
									<div class='text-base font-bold text-white truncate'>{$newGame_data['name']}</div>
									<div class='flex items-center mt-1 text-sm font-bold text-white truncate'>
										<img src='{$newGame_data['category_image']}' alt='{$newGame_data['name']}' loading='lazy' class='rounded-sm size-[18px] object-cover shrink-0 mr-2'>
										{$newGame_data['category_name']}
									</div>
								</div>
								<div class='flex items-center justify-center pl-1 rounded-full size-10 bg-violet-500 shrink-0'><i class='text-xl text-white fa fa-play' aria-hidden='true'></i></div>
							</div>";
					$ngm_top .= \GameMonetize\UI::view('game/list-each/home-top-games-list');
				}
			} else {
				$ngm_r .= \GameMonetize\UI::view('game/list-each/new-games-list');
				if ($counter % 5 == 1) {
					$ngm_r .= "<div class='grid grid-cols-2 grid-rows-2 w-[356px] shrink-0 gap-2'>";
				}
				if ($counter % 5 == 0) {
					$ngm_r .= "</div>";
				}
			}
		} else {
			$ngm_r .= \GameMonetize\UI::view('game/list-each/new-games-list');
		}
	}

		

	 if ($_GET['p'] == 'home') {
        $cat=$_GET["cat"];
            if($cat<>""){
            $cat = str_replace('-', '.', $cat); 
            $cat = ucfirst($cat);
			$themeData['tag_name'] = '<div class="category-section-top" style="text-align:center;font-size:20px;margin-bottom:10px;margin-top:0px;">
	<h1 style="color:#fc0;height: inherit;line-height: inherit;font-size: inherit;text-indent: inherit;font-size:29px;line-height: 25px;">'. $cat .'</h2>
	<h2 style="color:#000;font-size:14px;margin-top:15px;">Play '. $cat .' Free Online at GameFree.Games! We have chosen best '. $cat .' games which you can play online for free. enjoy!</h2>
</div>

';
		}
	}

	$themeData['new_game_ids'] .= rtrim($ids, ',');
	$themeData['new_game_page'] = "games";

	$themeData['new_games_list'] = $ngm_r;
	$themeData['home_top_games_list'] = $ngm_top;

	$footer_description = getFooterDescription('home');

	$themeData['footer_description'] = isset($footer_description->description) ? htmlspecialchars_decode($footer_description->description): "";;
	$themeData['footer_description_has_content'] = isset($footer_description->has_content) ? $footer_description->has_content: "";
	$themeData['footer_description_content_value'] = isset($footer_description->content_value) ? $footer_description->content_value: "";

	if ($config['site_theme'] == 'kizi' || $config['site_theme'] == 'y8-like' || $config['site_theme'] == 'crazygames-like') {
		// get all slider games
		$all_slider_container = "";
		if ($config['site_theme'] == 'crazygames-like') {
			$slider_data = $GameMonetizeConnect->query("SELECT * FROM ".SLIDERS." ORDER BY ordering ASC LIMIT 4");
		} else {
			$slider_data = $GameMonetizeConnect->query("SELECT * FROM ".SLIDERS." ORDER BY ordering ASC");
		}

		$index = 1;
		while ($slider = $slider_data->fetch_array()) {
			if($slider['type'] == 'new'){
				// new games
				$all_splide_item = "";
				$newGames_query = $GameMonetizeConnect->query("SELECT * FROM ".GAMES." WHERE published='1' ORDER BY date_added desc, featured_sorting desc LIMIT 20");
			
				while ($newGames = $newGames_query->fetch_array()) {
					$newGame_data = gameData($newGames);
					$themeData['splide_item_url'] = $newGame_data['game_url'];
					preg_match("/\/([a-zA-Z0-9]+)\//", $newGame_data['image_url'], $matches);
					$baseImagePath = $_SERVER['DOCUMENT_ROOT'] . '/games-image/' . $matches[1] . '/250x150.webp';
					if (file_exists($baseImagePath)) {
						$themeData['splide_item_image'] = str_replace($_SERVER['DOCUMENT_ROOT'], '', $baseImagePath);
					} else {
						$themeData['splide_item_image'] = $newGame_data['image_url'];
					}
					$themeData['splide_item_title'] = $newGame_data['name'];
					$themeData['splide_item_video_url'] = $newGames['video_url'];

					preg_match('/([^\/]+\.mp4)$/', $newGames['wt_video'], $matches);
					$baseVideoThumbPath = $_SERVER['DOCUMENT_ROOT'] . '/games-thumb-video/' . $matches[1];
					if (file_exists($baseVideoThumbPath)) {
						$themeData['splide_item_wt_video'] = str_replace($_SERVER['DOCUMENT_ROOT'], '', $baseVideoThumbPath);
					} else {
						$themeData['splide_item_wt_video'] = $newGames['wt_video'];
					}
				
					$all_splide_item .= \GameMonetize\UI::view('game/splide_item');
				}
			
				$themeData['splide_header_id'] = $index;
				$themeData['splide_header_title'] = 'New Games';
				$themeData['splide_header_url'] = siteUrl() . "/new-games";
			
				$themeData['splide_items'] = $all_splide_item;
			
				$all_slider_container .= \GameMonetize\UI::view('game/splide_container');
			}

			if($slider['type'] == 'best'){
				// new games
				$all_splide_item = "";
				$games_query = $GameMonetizeConnect->query("SELECT * FROM ".GAMES." WHERE published='1' ORDER BY plays DESC LIMIT 20");
			
				while ($newGames = $games_query->fetch_array()) {
					$newGame_data = gameData($newGames);
					$themeData['splide_item_url'] = $newGame_data['game_url'];
					$themeData['splide_item_image'] = $newGame_data['image_url'];
					preg_match("/\/([a-zA-Z0-9]+)\//", $newGame_data['image_url'], $matches);
					$baseImagePath = $_SERVER['DOCUMENT_ROOT'] . '/games-image/' . $matches[1] . '/250x150.webp';
					if (file_exists($baseImagePath)) {
						$themeData['splide_item_image'] = str_replace($_SERVER['DOCUMENT_ROOT'], '', $baseImagePath);
					} else {
						$themeData['splide_item_image'] = $newGame_data['image_url'];
					}
					$themeData['splide_item_title'] = $newGame_data['name'];
					$themeData['splide_item_video_url'] = $newGames['video_url'];

					preg_match('/([^\/]+\.mp4)$/', $newGames['wt_video'], $matches);
					$baseVideoThumbPath = $_SERVER['DOCUMENT_ROOT'] . '/games-thumb-video/' . $matches[1];
					if (file_exists($baseVideoThumbPath)) {
						$themeData['splide_item_wt_video'] = str_replace($_SERVER['DOCUMENT_ROOT'], '', $baseVideoThumbPath);
					} else {
						$themeData['splide_item_wt_video'] = $newGames['wt_video'];
					}
				
					$all_splide_item .= \GameMonetize\UI::view('game/splide_item');
				}
			
				$themeData['splide_header_id'] = $index;
				$themeData['splide_header_title'] = 'Best Games';
				$themeData['splide_header_url'] = siteUrl() . "/best-games";
			
				$themeData['splide_items'] = $all_splide_item;
			
				$all_slider_container .= \GameMonetize\UI::view('game/splide_container');
			}
			
			if($slider['type'] == 'featured'){
				// new games
				$all_splide_item = "";
				$games_query = $GameMonetizeConnect->query("SELECT * FROM ".GAMES." WHERE published='1' AND featured='1' ORDER BY date_added DESC LIMIT 20");
			
				while ($newGames = $games_query->fetch_array()) {
					$newGame_data = gameData($newGames);
					$themeData['splide_item_url'] = $newGame_data['game_url'];
					$themeData['splide_item_image'] = $newGame_data['image_url'];
					preg_match("/\/([a-zA-Z0-9]+)\//", $newGame_data['image_url'], $matches);
					$baseImagePath = $_SERVER['DOCUMENT_ROOT'] . '/games-image/' . $matches[1] . '/250x150.webp';
					if (file_exists($baseImagePath)) {
						$themeData['splide_item_image'] = str_replace($_SERVER['DOCUMENT_ROOT'], '', $baseImagePath);
					} else {
						$themeData['splide_item_image'] = $newGame_data['image_url'];
					}
					$themeData['splide_item_title'] = $newGame_data['name'];
					$themeData['splide_item_video_url'] = $newGames['video_url'];

					preg_match('/([^\/]+\.mp4)$/', $newGames['wt_video'], $matches);
					$baseVideoThumbPath = $_SERVER['DOCUMENT_ROOT'] . '/games-thumb-video/' . $matches[1];
					if (file_exists($baseVideoThumbPath)) {
						$themeData['splide_item_wt_video'] = str_replace($_SERVER['DOCUMENT_ROOT'], '', $baseVideoThumbPath);
					} else {
						$themeData['splide_item_wt_video'] = $newGames['wt_video'];
					}
				
					$all_splide_item .= \GameMonetize\UI::view('game/splide_item');
				}
			
				$themeData['splide_header_id'] = $index;
				$themeData['splide_header_title'] = 'Featured Games';
				$themeData['splide_header_url'] = siteUrl() . "/featured-games";
			
				$themeData['splide_items'] = $all_splide_item;
			
				$all_slider_container .= \GameMonetize\UI::view('game/splide_container');
			}

			if($slider['type'] == 'played'){
				// new games
				$all_splide_item = "";
				$fav = explode(',,', $_COOKIE['playedgames']);
				// remove empty values from $fav
				if (strlen($_COOKIE['playedgames']) > 0) {
					foreach ($fav as $game_id) {
						$resultset[] = $game_id;
					}
					$string = implode(",", $resultset);
					$str = trim($string, ",");
					$comma_separated = rtrim($str, ',');
					$games_query = $GameMonetizeConnect->query("SELECT * FROM " . GAMES . " where `game_id` IN (" . $comma_separated . ") order by date_added DESC LIMIT 20");
				
			
					while ($newGames = $games_query->fetch_array()) {
						$newGame_data = gameData($newGames);
						$themeData['splide_item_url'] = $newGame_data['game_url'];
						$themeData['splide_item_image'] = $newGame_data['image_url'];
						preg_match("/\/([a-zA-Z0-9]+)\//", $newGame_data['image_url'], $matches);
						$baseImagePath = $_SERVER['DOCUMENT_ROOT'] . '/games-image/' . $matches[1] . '/250x150.webp';
						if (file_exists($baseImagePath)) {
							$themeData['splide_item_image'] = str_replace($_SERVER['DOCUMENT_ROOT'], '', $baseImagePath);
						} else {
							$themeData['splide_item_image'] = $newGame_data['image_url'];
						}
						$themeData['splide_item_title'] = $newGame_data['name'];
						$themeData['splide_item_video_url'] = $newGames['video_url'];
						
						preg_match('/([^\/]+\.mp4)$/', $newGames['wt_video'], $matches);
						$baseVideoThumbPath = $_SERVER['DOCUMENT_ROOT'] . '/games-thumb-video/' . $matches[1];
						if (file_exists($baseVideoThumbPath)) {
							$themeData['splide_item_wt_video'] = str_replace($_SERVER['DOCUMENT_ROOT'], '', $baseVideoThumbPath);
						} else {
							$themeData['splide_item_wt_video'] = $newGames['wt_video'];
						}
					
						$all_splide_item .= \GameMonetize\UI::view('game/splide_item');
					}
				
					$themeData['splide_header_id'] = $index;
					$themeData['splide_header_title'] = 'Played Games';
					$themeData['splide_header_url'] = siteUrl() . "/played-games";
				
					$themeData['splide_items'] = $all_splide_item;
				
					$all_slider_container .= \GameMonetize\UI::view('game/splide_container');
				}
			}

			if($slider['type'] == 'category'){
				// new games
				$all_splide_item = "";
				$category_id = $slider['category_tags_id'];
				$games_query = $GameMonetizeConnect->query("SELECT * FROM ".GAMES." WHERE category = '{$category_id}' AND published = '1' ORDER BY featured DESC LIMIT 20");
			
				while ($newGames = $games_query->fetch_array()) {
					$newGame_data = gameData($newGames);
					$themeData['splide_item_url'] = $newGame_data['game_url'];
					$themeData['splide_item_image'] = $newGame_data['image_url'];
					preg_match("/\/([a-zA-Z0-9]+)\//", $newGame_data['image_url'], $matches);
					$baseImagePath = $_SERVER['DOCUMENT_ROOT'] . '/games-image/' . $matches[1] . '/250x150.webp';
					if (file_exists($baseImagePath)) {
						$themeData['splide_item_image'] = str_replace($_SERVER['DOCUMENT_ROOT'], '', $baseImagePath);
					} else {
						$themeData['splide_item_image'] = $newGame_data['image_url'];
					}
					$themeData['splide_item_title'] = $newGame_data['name'];
					$themeData['splide_item_video_url'] = $newGames['video_url'];
					
					preg_match('/([^\/]+\.mp4)$/', $newGames['wt_video'], $matches);
					$baseVideoThumbPath = $_SERVER['DOCUMENT_ROOT'] . '/games-thumb-video/' . $matches[1];
					if (file_exists($baseVideoThumbPath)) {
						$themeData['splide_item_wt_video'] = str_replace($_SERVER['DOCUMENT_ROOT'], '', $baseVideoThumbPath);
					} else {
						$themeData['splide_item_wt_video'] = $newGames['wt_video'];
					}
				
					$all_splide_item .= \GameMonetize\UI::view('game/splide_item');
				}

				$category_query = $GameMonetizeConnect->query("SELECT * FROM ".CATEGORIES." WHERE id='{$category_id}'");
				$category_data = $category_query->fetch_array();
			
				$themeData['splide_header_id'] = $index;
				$themeData['splide_header_title'] = "{$category_data['name']}";
				$themeData['splide_header_url'] = siteUrl() . "/category/{$category_data['category_pilot']}";
			
				$themeData['splide_items'] = $all_splide_item;
			
				$all_slider_container .= \GameMonetize\UI::view('game/splide_container');
			}

			if($slider['type'] == 'tags'){
				// new games
				$all_splide_item = "";
				$tags_id = $slider['category_tags_id'];
				$games_query = $GameMonetizeConnect->query("SELECT * FROM ".GAMES." WHERE tags_ids LIKE '%\"{$tags_id}\"%' AND published = '1' ORDER BY featured DESC LIMIT 20");
			
				while ($newGames = $games_query->fetch_array()) {
					$newGame_data = gameData($newGames);
					$themeData['splide_item_url'] = $newGame_data['game_url'];
					$themeData['splide_item_image'] = $newGame_data['image_url'];
					preg_match("/\/([a-zA-Z0-9]+)\//", $newGame_data['image_url'], $matches);
					$baseImagePath = $_SERVER['DOCUMENT_ROOT'] . '/games-image/' . $matches[1] . '/250x150.webp';
					if (file_exists($baseImagePath)) {
						$themeData['splide_item_image'] = str_replace($_SERVER['DOCUMENT_ROOT'], '', $baseImagePath);
					} else {
						$themeData['splide_item_image'] = $newGame_data['image_url'];
					}
					$themeData['splide_item_title'] = $newGame_data['name'];
					$themeData['splide_item_video_url'] = $newGames['video_url'];
					
					preg_match('/([^\/]+\.mp4)$/', $newGames['wt_video'], $matches);
					$baseVideoThumbPath = $_SERVER['DOCUMENT_ROOT'] . '/games-thumb-video/' . $matches[1];
					if (file_exists($baseVideoThumbPath)) {
						$themeData['splide_item_wt_video'] = str_replace($_SERVER['DOCUMENT_ROOT'], '', $baseVideoThumbPath);
					} else {
						$themeData['splide_item_wt_video'] = $newGames['wt_video'];
					}
				
					$all_splide_item .= \GameMonetize\UI::view('game/splide_item');
				}

				$tags_query = $GameMonetizeConnect->query("SELECT * FROM ".TAGS." WHERE id='{$tags_id}'");
				$tags_data = $tags_query->fetch_array();
			
				$themeData['splide_header_id'] = $index;
				$themeData['splide_header_title'] = "{$tags_data['name']}";
				$themeData['splide_header_url'] = siteUrl() . "/tag/{$tags_data['url']}";
			
				$themeData['splide_items'] = $all_splide_item;
			
				$all_slider_container .= \GameMonetize\UI::view('game/splide_container');
			}

			$index++;
		}
	}

	if ($config['site_theme'] == 'y8-like' || $config['site_theme'] == 'poki-like') {
		$sql_cat_query = $GameMonetizeConnect->query("SELECT * FROM " . CATEGORIES . " WHERE show_home='1'");
		$ct_r = '';
		while ($category = $sql_cat_query->fetch_array()) {
			$themeData['category_id'] = $category['id'];
			$themeData['category_name'] = $category['name'];
			$themeData['category_image'] = $category['image'];

			$numbergames = $GameMonetizeConnect->query("SELECT COUNT(*) FROM " . GAMES . " where category=" . $category['id']);
			$numbergames = $numbergames->fetch_array()[0];

			$themeData['category_number'] = $numbergames;
			$themeData['category_url'] = siteUrl() . '/category/'	. slugify($category['name']);
			$ct_r .= \GameMonetize\UI::view('category/categories-list-home');
		}

		$themeData['categories_list_home'] = $ct_r;
		$themeData['category_content'] = \GameMonetize\UI::view('category/categories-list-home');

		$sql_tag_query = $GameMonetizeConnect->query("SELECT * FROM " . TAGS . " WHERE show_home='1'");
		$tag_r = '';
		while ($tag = $sql_tag_query->fetch_array()) {
			$themeData['tag_id'] = $tag['id'];
			$themeData['tag_name'] = $tag['name'];

			$baseTagImagePath = 'tag-img/' . slugify($tag['name']);
			$formats = ['.png', '.webp'];
			$defaultTagImagePath = 'templates/poki-like/image/tag.png';

			$themeData['tag_image'] = $defaultTagImagePath; // Default value

			foreach ($formats as $format) {
				if (file_exists($baseTagImagePath . $format)) {
					$themeData['tag_image'] = $baseTagImagePath . $format;
					break;
				}
			}

			$themeData['tag_url'] = siteUrl() . '/tag/'	. slugify($tag['name']);
			$tag_r .= \GameMonetize\UI::view('tags/tags-list-home');
		}

		$themeData['tags_list_home'] = $tag_r;
	}


	// Get setting data
	$settingDataQuery = "SELECT * FROM " . SETTING . " LIMIT 1";
	$settingData = $GameMonetizeConnect->query($settingDataQuery);
	$settingData = $settingData->fetch_array();

	if ($settingData["is_sidebar_enabled"]) {
		$themeData['categories_tags_home'] = "";
	} else {
		$themeData['categories_tags_home'] = \GameMonetize\UI::view('home/categories-tags-home');
	}

	// $themeData['categories_tags_home'] = \GameMonetize\UI::view('home/categories-tags-home');
	if ($config['site_theme'] == 'crazygames-like') {
		// new games
		$all_splide_item = "";
		$fav = array_filter(explode(',', $_COOKIE['playedgames']));
		// remove empty values from $fav
		if (strlen($_COOKIE['playedgames']) > 0) {
			$fav = array_unique($fav);
			foreach ($fav as $game_id) {
				$resultset[] = $game_id;
			}
			$comma_separated = implode(",", array_map('intval', $fav));
			$recentlyPlayedGames_query = $GameMonetizeConnect->query("SELECT * FROM " . GAMES . " where `game_id` IN (" . $comma_separated . ") order by date_added DESC LIMIT 20");
			
			if ($recentlyPlayedGames_query->num_rows > 0) {
				$all_splide_item = "";
	
				while ($newGames = $recentlyPlayedGames_query->fetch_array()) {
					$newGame_data = gameData($newGames);
					$themeData['splide_item_url'] = $newGame_data['game_url'];
					$themeData['splide_item_image'] = $newGame_data['image_url'];
					preg_match("/\/([a-zA-Z0-9]+)\//", $newGame_data['image_url'], $matches);
					$baseImagePath = $_SERVER['DOCUMENT_ROOT'] . '/games-image/' . $matches[1] . '/250x150.webp';
					if (file_exists($baseImagePath)) {
						$themeData['splide_item_image'] = str_replace($_SERVER['DOCUMENT_ROOT'], '', $baseImagePath);
					} else {
						$themeData['splide_item_image'] = $newGame_data['image_url'];
					}
					$themeData['splide_item_title'] = $newGame_data['name'];
					$themeData['splide_item_video_url'] = $newGames['video_url'];
					
					preg_match('/([^\/]+\.mp4)$/', $newGames['wt_video'], $matches);
					$baseVideoThumbPath = $_SERVER['DOCUMENT_ROOT'] . '/games-thumb-video/' . $matches[1];
					if (file_exists($baseVideoThumbPath)) {
						$themeData['splide_item_wt_video'] = str_replace($_SERVER['DOCUMENT_ROOT'], '', $baseVideoThumbPath);
					} else {
						$themeData['splide_item_wt_video'] = $newGames['wt_video'];
					}
				
					$all_splide_item .= \GameMonetize\UI::view('game/splide_item_home_recent_played');
				}
			
				$themeData['splide_header_id'] = 12312312;
				$themeData['splide_header_title'] = 'Played Games';
				$themeData['splide_header_url'] = siteUrl() . "/played-games";
			
				$themeData['splide_items'] = $all_splide_item;
			
				$themeData['top_info'] = \GameMonetize\UI::view('game/splide_container_home_recent_played');
			} else {
				$themeData['top_info'] = \GameMonetize\UI::view('home/top-info');
			}
		} else {
			$themeData['top_info'] = \GameMonetize\UI::view('home/top-info');
		}
	}

	$themeData['all_splide_containers'] = $all_slider_container;

	if ($config['site_theme'] == 'crazygames-like') {
		if (isset($_SERVER['HTTP_USER_AGENT']) && preg_match('/(tablet|ipad|playbook)|(android(?!.*(mobi|opera mini)))/i', strtolower($_SERVER['HTTP_USER_AGENT']))) {
			$themeData['new_games'] = \GameMonetize\UI::view('game/home-games');
		} elseif (isset($_SERVER['HTTP_USER_AGENT']) && preg_match('/(mobile|android|touch|webos|hpwos)/i', strtolower($_SERVER['HTTP_USER_AGENT']))) {
			$themeData['new_games'] = \GameMonetize\UI::view('game/home-games');
		} else {
			$sql_cat_query = $GameMonetizeConnect->query("SELECT * FROM " . CATEGORIES);
			$ct_r = '';
			$counter = 0;
			while ($category = $sql_cat_query->fetch_array()) {
				$themeData['category_id'] = $category['id'];
				$themeData['category_name'] = $category['name'];
				$themeData['category_image'] = $category['image'];

				$numbergames = $GameMonetizeConnect->query("SELECT COUNT(*) FROM " . GAMES . " where category=" . $category['id']);
				$numbergames = $numbergames->fetch_array()[0];

				$themeData['category_number'] = $numbergames;
				$themeData['category_url'] = siteUrl() . '/category/'	. slugify($category['name']);
				$counter++;
				if ($counter % 2 == 1) {
					$ct_r .= "<div class='max-w-[160px] shrink-0 w-1/3 inline-block relative h-full'>";
					$ct_r .= "<div class='flex flex-col h-full space-y-2'>";
				}
				$ct_r .= \GameMonetize\UI::view('category/categories-list-home');
				if ($counter % 2 == 0) {
					$ct_r .= "</div></div>";
				}

				if ($sql_cat_query->num_rows % 2 == 1 && $counter == $sql_cat_query->num_rows - 1) {
					break;
				}
			}

			$themeData['categories_list_home'] = $ct_r;
			$themeData['new_games'] = \GameMonetize\UI::view('game/home-games-desktop');
		}
	} else {
		$themeData['new_games'] = \GameMonetize\UI::view('game/new-games');
	}

	$themeData['page_content'] = \GameMonetize\UI::view('home/content');

