<?php
	$themeData['ads_header'] = getADS('header');
	$themeData['ads_footer'] = getADS('footer');
	$themeData['ads_sidebar'] = getADS('column_one');
	$sql_tag_query = $GameMonetizeConnect->query("SELECT * FROM " . TAGS . " ORDER BY name");
	$ct_r = '';
	$activeFirstLetter = '';
	while ($tags = $sql_tag_query->fetch_array()) {
		$themeData['tags_id'] = $tags['id'];
		$themeData['tags_name'] = $tags['name'];

		$baseTagImagePath = 'tag-img/' . slugify($tags['name']);
		$formats = ['.png', '.webp'];
		$defaultTagImagePath = 'templates/poki-like/image/tag.png';

		$themeData['tags_thumb'] = $defaultTagImagePath; // Default value

		foreach ($formats as $format) {
			if (file_exists($baseTagImagePath . $format)) {
				$themeData['tags_thumb'] = $baseTagImagePath . $format;
				break;
			}
		}

		$themeData['tags_number'] = $tags['total_games'];
		$themeData['tags_url'] = siteUrl() . '/tag/' . slugify($tags['name']);

		$firstLetter = ctype_alpha($tags['name'][0]) ? strtolower($tags['name'][0]) : '#';
		if ($config['site_theme'] == 'crazygames-like' && $activeFirstLetter != $firstLetter) {
			$ct_r .= '<div class="my-2 text-5xl font-extrabold text-white text-opacity-60 md:col-span-3 lg:col-span-4 2xl:col-span-6">' . strtoupper($firstLetter) . '</div>';
			$activeFirstLetter = $firstLetter;
		}

		$ct_r .= \GameMonetize\UI::view('category/tags-list');
	}

	$themeData['categories_list'] = $ct_r;

	$tags_footer_description = getFooterDescription('tags');
	$tags_footer_description = htmlspecialchars_decode($tags_footer_description->description);

	// Variabel untuk menyimpan hasil
	$header_title = '';
	$header_desc = '';
	$footer_description = '';

	// Ambil teks dalam tag <h1>
	if (preg_match('/<h1>(.*?)<\/h1>/', $tags_footer_description, $matches)) {
		$header_title = $matches[1]; // Simpan teks <h1> ke variabel header_title
	}

	// Ambil semua tag <p> dalam teks
	if (preg_match_all('/<p>(.*?)<\/p>/', $tags_footer_description, $matches)) {
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
				$footer_description = '<p>' . implode('</p><p>', array_map('trim', array_slice($br_split, 1))) . '</p>'; // Gabungkan sisa bagian setelah <br> pertama menjadi tag <p>
			}

			// Gabungkan sisa tag <p> ke footer_description
			if (count($matches[1]) > 1) {
				$footer_description .= '<p>' . implode('</p><p>', array_map('trim', array_slice($matches[1], 1))) . '</p>';
			}
		}
	}

	$themeData['page_title'] = $header_title;
	$themeData['page_description'] = $header_desc;
	$themeData['footer_description'] = $footer_description;

	$themeData['tags_content'] = \GameMonetize\UI::view('game/tags');
	$themeData['page_content'] = \GameMonetize\UI::view('category/tags-content');