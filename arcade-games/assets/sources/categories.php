<?php
	if ( !empty($_GET['category'])) {
		$get_category_id = secureEncode($_GET['category']);
		$themeData['new_game_page'] = "games";
		$sql_cat_query = $GameMonetizeConnect->query("SELECT * FROM ".CATEGORIES." WHERE category_pilot='".$get_category_id . "'");
		if ($sql_cat_query->num_rows > 0) {
			$get_category = $sql_cat_query->fetch_assoc();

			$sql_c_games_query = $GameMonetizeConnect->query("SELECT * FROM ".GAMES." WHERE category = '{$get_category['id']}' AND published = '1' ORDER BY featured DESC limit 50");
			
			if ($config['site_theme'] == 'poki-like') {
				$sql_c_games_query = $GameMonetizeConnect->query("SELECT * FROM ".GAMES." WHERE category = '{$get_category['id']}' AND published = '1' ORDER BY featured DESC limit 71");
			}
			
			$themeData['category_name'] = $get_category['name'];
			if ($sql_c_games_query->num_rows > 0) {
				$ctgm_r = '';
				$ids = '';
				while($cat_games = $sql_c_games_query->fetch_array()) {
					$get_game_data = gameData($cat_games);
					$themeData['category_game_name'] = $get_game_data['name'];
					$themeData['category_game_url'] = $get_game_data['game_url'];
					$themeData['category_game_image'] = $get_game_data['image_url'];

					preg_match("/\/([a-zA-Z0-9]+)\//", $get_game_data['image_url'], $matches);
					$baseImagePath = $_SERVER['DOCUMENT_ROOT'] . '/games-image/' . $matches[1] . '/250x150.webp';
					if (file_exists($baseImagePath)) {
						$themeData['category_game_image'] = str_replace($_SERVER['DOCUMENT_ROOT'], '', $baseImagePath);
					} else {
						$themeData['category_game_image'] = $get_game_data['image_url'];
					}

					$themeData['category_game_rating'] = $cat_games['rating'];
					$themeData['category_game_video_url'] = $cat_games['video_url'];
					$themeData['category_game_wt_video'] = $get_game_data['wt_video'];

					preg_match('/([^\/]+\.mp4)$/', $get_game_data['wt_video'], $matches);
					$baseVideoThumbPath = $_SERVER['DOCUMENT_ROOT'] . '/games-thumb-video/' . $matches[1];
					if (file_exists($baseVideoThumbPath)) {
						$themeData['category_game_wt_video'] = str_replace($_SERVER['DOCUMENT_ROOT'], '', $baseVideoThumbPath);
					} else {
						$themeData['category_game_wt_video'] = $get_game_data['wt_video'];
					}

					$ctgm_r .= \GameMonetize\UI::view('category/category-games-list');

					$ids .= $cat_games['game_id'] .',';
				}
				$themeData['category_games_list'] = $ctgm_r;

			} else {
				$themeData['category_games_list'] = \GameMonetize\UI::view('category/category-games-notfound');
			}
			$themeData['categoryid'] = $get_category['id'];
			$themeData['category_thumb'] = $get_category['image'];
			$themeData['footer_description'] = htmlspecialchars_decode($get_category['footer_description']);
			
			$footer_description = htmlspecialchars_decode($get_category['footer_description']);
			
			$header_desc = '';
			$footer_desc_modified = '';

			$br_split = preg_split('/<br\s*\/?>/i', $footer_description);

			// Simpan bagian pertama sebagai header_desc
			if (!empty($br_split[0])) {
				$header_desc = trim($br_split[0]); // Trim untuk menghapus spasi berlebih
			}

			// Jika ada lebih dari satu bagian, gabungkan sisanya menjadi footer_description
			if (count($br_split) > 1) {
				$footer_desc_modified = implode('<br>', array_map('trim', array_slice($br_split, 1))); // Gabungkan sisa bagian setelah <br> pertama
			}

			$themeData['header_desc'] = $header_desc;
			$themeData['footer_description_modified'] = $footer_desc_modified;

			$themeData['new_game_ids'] .= rtrim($ids, ',');
			$themeData['category_content'] = \GameMonetize\UI::view('category/category-games');
		} else {
			$themeData['category_content'] = \GameMonetize\UI::view('category/category-notfound');
		}
	} 

	else {
		$sql_cat_query = $GameMonetizeConnect->query("SELECT * FROM ".CATEGORIES);
		$ct_r = '';
		while($category = $sql_cat_query->fetch_array()) {
			$themeData['category_id'] = $category['id'];
			$themeData['category_name'] = $category['name'];
			$themeData['category_thumb'] = siteUrl() . $category['image'];

			$themeData['category_number'] = $category['total_games'];
			$themeData['category_url'] = siteUrl() . '/category/'	. slugify($category['name']);
			$ct_r .= \GameMonetize\UI::view('category/categories-list');
		}
		$themeData['categories_list'] = $ct_r;

		$footer_description = getFooterDescription('categories');

		$themeData['footer_description'] = isset($footer_description->description) ? htmlspecialchars_decode($footer_description->description): "";

		// Ambil semua tag <p> dalam teks
		if (preg_match_all('/<p>(.*?)<\/p>/', $themeData['footer_description'], $matches)) {
			// Jika ada setidaknya 1 tag <p>
			if (!empty($matches[1])) {
				// Ambil isi tag <p> pertama
				$first_p_content = $matches[1][0];

				// Pisahkan berdasarkan tag <br>
				$br_split = preg_split('/<br\s*\/?>/i', $first_p_content);

				// Simpan bagian pertama sebagai header_desc
				if (!empty($br_split[0])) {
					$header_desc = trim($br_split[0]); // Trim untuk menghapus spasi berlebih
				}

				// Jika ada lebih dari satu bagian, gabungkan sisanya menjadi footer_description
				if (count($br_split) > 1) {
					$footer_desc_modified = '<p>' . implode('</p><p>', array_map('trim', array_slice($br_split, 1))) . '</p>'; // Gabungkan sisa bagian setelah <br> pertama menjadi tag <p>
				}

				// Gabungkan sisa tag <p> ke footer_description
				if (count($matches[1]) > 1) {
					$footer_desc_modified .= '<p>' . implode('</p><p>', array_map('trim', array_slice($matches[1], 1))) . '</p>';
				}
			}
		} else {
			// Jika tidak ditemukan tag <p>, langsung cek tag <br>
			$br_split = preg_split('/<br\s*\/?>/i', $themeData['footer_description']);

			// Simpan bagian pertama sebagai header_desc
			if (!empty($br_split[0])) {
				$header_desc = trim($br_split[0]); // Trim untuk menghapus spasi berlebih
			}

			// Jika ada lebih dari satu bagian, gabungkan sisanya menjadi footer_description
			if (count($br_split) > 1) {
				$footer_desc_modified = implode('<br>', array_map('trim', array_slice($br_split, 1))); // Gabungkan sisa bagian setelah <br> pertama
			}
		}

		$themeData['header_desc'] = $header_desc;
		$themeData['footer_description_modified'] = $footer_desc_modified;

		$themeData['category_content'] = \GameMonetize\UI::view('category/categories');
	}
	$themeData['page_content'] = \GameMonetize\UI::view('category/content');

