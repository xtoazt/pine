<?php 
if (!defined('R_PILOT')) { exit(); }

if (is_logged() && isset($_POST['gid'])) {
    $manage_game_id = secureEncode($_POST['gid']);

    // Ambil kategori dan tag sebelum dihapus
    $sql_manage_dlt = $GameMonetizeConnect->query("SELECT category, tags_ids FROM ".GAMES." WHERE game_id='{$manage_game_id}'");

    if ($sql_manage_dlt->num_rows > 0) {
        $game_data = $sql_manage_dlt->fetch_assoc();
        $category_id = $game_data['category'];
        $tags_ids = json_decode($game_data['tags_ids'], true);

        // Hapus game dari database
        $GameMonetizeConnect->query("DELETE FROM ".GAMES." WHERE game_id='{$manage_game_id}'");

        // Kurangi total_games di kategori
        $GameMonetizeConnect->query("UPDATE ".CATEGORIES." SET total_games = GREATEST(total_games - 1, 0) WHERE id = '{$category_id}'");

        // Kurangi totalgames di tag terkait
        if (!empty($tags_ids)) {
            $tag_ids = implode(',', array_map('intval', $tags_ids));
            $GameMonetizeConnect->query("UPDATE ".TAGS." SET total_games = GREATEST(total_games - 1, 0) WHERE id IN ($tag_ids)");
        }
    }
}
