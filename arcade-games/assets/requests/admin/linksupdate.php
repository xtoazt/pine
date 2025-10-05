<?php
if (!defined('R_PILOT')) {
    exit();
}
error_reporting(-1);
if (!empty($_POST['rewrite_method'])) {
    $rewrite_method = $_POST['rewrite_method'];
    $google_translate_language = $_POST['google_translate_language'];

    $sqlUpdate = "UPDATE " . LINKS . " SET rewrite_method = '{$rewrite_method}', google_translate_language = '{$google_translate_language}' WHERE name = 'autopost'";
    $updateQuery = $GameMonetizeConnect->query($sqlUpdate);

    if ($updateQuery) {
        $data['status'] = 200;
        $data['success_message'] = "Updated successfully";
    } else {
        $data['error_message'] = $lang['error_message'];
    }
} else {
    $data['error_message'] = $lang['error_message'];
}
