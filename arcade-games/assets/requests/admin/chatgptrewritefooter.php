<?php
if (!defined('R_PILOT')) {
    exit();
}
// Get chatgpt settings
$chatgptSetting = $GameMonetizeConnect->query("SELECT * FROM " . CHATGPT . "");
if ($chatgptSetting && $chatgptSetting->num_rows > 0) {
    $chatgptSetting = $chatgptSetting->fetch_assoc();
    $api_key = $chatgptSetting['api_key'];
    $template_footer = $chatgptSetting['template_footer'];

    // Data preparation
    $footerData = $GameMonetizeConnect->query("SELECT * FROM " . FOOTER_DESCRIPTION . " WHERE id = '{$_POST['footer_id']}'");
    $footerData = $footerData->fetch_assoc();
    if (!is_null($footerData)) {
        $footerDescription = $footerData['description'];
        $footerTitle = $footerData['page_name'];

        $template_footer = str_replace(
            [
                "\$description",
                "\$title",
            ],
            [
                $footerDescription,
                $footerTitle,
            ],
            $chatgpt_data['template_footer']
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
