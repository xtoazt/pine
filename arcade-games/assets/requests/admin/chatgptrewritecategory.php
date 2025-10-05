<?php
if (!defined('R_PILOT')) {
    exit();
}
// Get chatgpt settings
$chatgptSetting = $GameMonetizeConnect->query("SELECT * FROM " . CHATGPT . "");
if ($chatgptSetting && $chatgptSetting->num_rows > 0) {
    $chatgptSetting = $chatgptSetting->fetch_assoc();
    
    $api_key = $chatgptSetting['api_key'];
    $template_category = $chatgptSetting['template_category'];

    // Data preparation
    $gameCategory = $GameMonetizeConnect->query("SELECT * FROM " . CATEGORIES . " WHERE id = '{$_POST['cat_id']}'");
    $gameCategory = $gameCategory->fetch_assoc();
    if (!is_null($gameCategory)) {
        $categoryDescription = $gameCategory['footer_description'];
        $categoryTitle = $gameCategory['name'];

        $categoryRandomGame = '';
        $sqlQuerySimilar = $GameMonetizeConnect->query("SELECT * FROM " . GAMES . " WHERE category = {$gameCategory['id']} AND published='1' ORDER BY RAND() LIMIT 1");
        if ($sqlQuerySimilar->num_rows > 0) {
            while ($similarGames = $sqlQuerySimilar->fetch_array()) {
                // var_dump($similarGames);die;
                $categoryRandomGame = siteUrl() . "/game/" . $similarGames['game_name'];
            }
        }

        $template_category = str_replace(
            [
                "\$description",
                "\$title",
                "\$game_link",
            ],
            [
                $categoryDescription,
                $categoryTitle,
                $categoryRandomGame,
            ],
            $chatgpt_data['template_category']
        );
        $postData = [
            'model' => 'gpt-3.5-turbo',
            'messages' => [
                [
                    'role' => 'system',
                    'content' => 'You are a game description rephrasing or rewriter assistant.'
                ],
                [
                    'role' => 'user',
                    'content' => $template_category
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

        // Output the response
        var_dump($response);
        die;

        $data['status'] = 200;
        $data['success_message'] = $lang['chatgpt_saved'];
    }
} else {
    $data['error_message'] = $lang['chatgpt_saved'];
}
