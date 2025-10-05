<?php
if (isset($_GET['q']) && !empty($_GET['q'])) {
    $search_parameter = secureEncode($_GET['q']);
    $search_query = searchGames($search_parameter, $config['site_theme']);

    if ($search_query) {
        foreach ($search_query as $game_search) {
            $get_game_data_search = gameData($game_search);
            $game_url = $get_game_data_search['game_url'];
            $game_image = $get_game_data_search['image_url'];
            $game_name = $get_game_data_search['name'];
            $game_video_url = $get_game_data_search['video_url'];
            $game_featured = $get_game_data_search['featured'];
            $game_icon = ''; // Sesuaikan ini jika Anda punya ikon spesial
            echo "
            <a href='{$game_url}' class='flex items-center text-[15px] text-white w-full' aria-label='{$game_name}'>
                <img src='{$game_image}' alt='{$game_name}' class='mx-5 size-10 shrink-0'>
                {$game_name}
            </a>";
        }
        echo "<a href='{$config['site_url']}/search/{$search_parameter}' class='flex items-center text-[15px] text-white w-full' aria-label='View all results'>View all results</a>";
    } else {
        echo "<p>No games found</p>";
    }
} else {
    echo "<p>Type something to search</p>";
}
