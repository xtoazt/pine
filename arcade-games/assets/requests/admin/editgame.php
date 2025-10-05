<?php
if (!defined('R_PILOT')) {
    exit();
}

// Url checking
$isUrlAllowed = checkAllowedUrlFromJson($_POST['eg_file']);
if ($isUrlAllowed){
    if (!empty($_POST['eg_name']) && !empty($_POST['eg_width']) && !empty($_POST['eg_height']) && !empty($_POST['eg_category'])) {
        if (isset($_POST['eg_name']) && isset($_POST['eg_width']) && isset($_POST['eg_height']) && isset($_POST['eg_category'])) {
            $editgame = array();
            $editgame['name']         = secureEncode($_POST['eg_name']);
            $editgame['description']  = htmlspecialchars_decode($_POST['eg_description']);
            $editgame['description']  = convertBoldTags($editgame['description']); 
            $editgame['instructions'] = $_POST['eg_instructions'];
            $editgame['width']        = secureEncode($_POST['eg_width']);
            $editgame['height']       = secureEncode($_POST['eg_height']);
            $editgame['category']     = secureEncode($_POST['eg_category']);
            $editgame['import']       = secureEncode($_POST['eg_import']);
            $editgame['type']         = secureEncode($_POST['eg_file_type']);
            $editgame['id']           = secureEncode($_POST['eg_id']);
            $editgame['rating']       = 0;
            $editgame['sorting']      = secureEncode($_POST['eg_sorting']);
            $editgame['game_tags']    = json_encode($_POST['eg_tags']);
            $editgame['video_url']    = $_POST['eg_video_url'];
            $gamename = seo_friendly_url($_POST['eg_name']);
            $editgame['game_name']    = secureEncode($gamename);
            $editgame['is_last_rewrite'] = $_POST['eg_is_last_rewrite'] == "on" ? 1 : 0;

            // Ambil kategori dan tag lama sebelum update
            $old_game_query = $GameMonetizeConnect->query("SELECT category, tags_ids FROM " . GAMES . " WHERE game_id='{$editgame['id']}'");
            $old_game = $old_game_query->fetch_assoc();

            $old_category = $old_game['category'];
            $old_tags = json_decode($old_game['tags_ids'], true);

            if ($editgame['import'] == 0) {
                if (!empty($_POST['eg_image']) && !empty($_POST['eg_file'])) {
                    $editgame_mediaurl = secureEncode($_POST['eg_image']);
                    $editgame['file'] = secureEncode($_POST['eg_file']);

                    $isSuccess = $GameMonetizeConnect->query("UPDATE " . GAMES . " SET 
                                name='{$editgame['name']}',
                                game_name='{$editgame['game_name']}',
                                image='{$editgame_mediaurl}',
                                import='0',
                                category='{$editgame['category']}',
                                description='{$editgame['description']}',
                                instructions='{$editgame['instructions']}',
                                file='{$editgame['file']}',
                                game_type='{$editgame['type']}',
                                w='{$editgame['width']}',
                                h='{$editgame['height']}',
                                rating='{$editgame['rating']}',
                                featured_sorting='{$editgame['sorting']}', 
                                tags_ids='{$editgame['game_tags']}', 
                                video_url='{$editgame['video_url']}', 
                                is_last_rewrite='{$editgame['is_last_rewrite']}' 
                                WHERE game_id='{$editgame['id']}'
                            ");

                    $data = array(
                        'status' => 200,
                        'success_message' => $lang['game_saved'],
                        'game_name' => $editgame['name'],
                        'game_img' => $editgame_mediaurl
                    );
                } else {
                    $data['error_message'] = $lang['fileurl_empty'];
                }
            } else {
                $data['error_message'] = $lang['error_message'];
            }

            // Update category total_games jika kategori berubah
            if ($old_category != $editgame['category']) {
                $GameMonetizeConnect->query("UPDATE " . CATEGORIES . " SET total_games = GREATEST(total_games - 1, 0) WHERE id = '{$old_category}'");
                $GameMonetizeConnect->query("UPDATE " . CATEGORIES . " SET total_games = total_games + 1 WHERE id = '{$editgame['category']}'");
            }

            // Update tag totalgames jika tag berubah
            $new_tags = json_decode($editgame['game_tags'], true);
            $removed_tags = array_diff($old_tags, $new_tags);
            $added_tags = array_diff($new_tags, $old_tags);

            // Kurangi totalgames dari tag yang dihapus
            if (!empty($removed_tags)) {
                $tag_ids = implode(',', array_map('intval', $removed_tags));
                $GameMonetizeConnect->query("UPDATE " . TAGS . " SET total_games = GREATEST(total_games - 1, 0) WHERE id IN ($tag_ids)");
            }

            // Tambah totalgames ke tag yang baru ditambahkan
            if (!empty($added_tags)) {
                $tag_ids = implode(',', array_map('intval', $added_tags));
                $GameMonetizeConnect->query("UPDATE " . TAGS . " SET total_games = total_games + 1 WHERE id IN ($tag_ids)");
            }

        } else {
            $data['error_message'] = $lang['error_message'];
        }
    } else {
        $data['error_message'] = $lang['empty_place'];
    }
} else {
    $data['error_message'] = $lang['url_not_allowed'];
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

function convertBoldTags($text) {
    $pattern = '/\*\*(.*?)\*\*/';
    $replacement = '<b>$1</b>';
    return preg_replace($pattern, $replacement, $text);
}
