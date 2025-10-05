<?php
if (!defined('R_PILOT')) {
    exit();
}

error_reporting(-1);

$linksData = $GameMonetizeConnect->query("SELECT * FROM " . LINKS . " WHERE name = 'autopost' AND is_active = 1");

if ($linksData && $linksData->num_rows > 0) {
    $linksData = $linksData->fetch_array();
    $gameDescription = $_POST['originalText'];
    $translateLanguage = explode(",", $linksData["google_translate_language"]);
    $currentLanguage = "en";
    foreach ($translateLanguage as $index => $language) {
        $language = str_replace(" ", "", $language);
        $gameDescriptionTranslated = googleTranslate($gameDescription, $currentLanguage, $language);
        if ($gameDescriptionTranslated) {
            $gameDescription = $gameDescriptionTranslated["data"];
            
            // Translate back to english
            if ($index != count($translateLanguage) - 1) {
                $gameDescription = googleTranslate($gameDescription, $language, "en");
                $gameDescription = $gameDescription["data"];
            }
        }

        $currentLanguage = "en";
    }
    // $gameDescription = googleTranslate($gameDescription, $currentLanguage, "en");
    // $gameDescription = $gameDescription["data"];
    
    $data['status'] = 200;
    $data['rewrite_result'] = $gameDescription;
} else {
    $data['error_message'] = "Something went wrong.";
}