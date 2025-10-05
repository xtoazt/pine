<?php
if (!defined('R_PILOT')) {
    exit();
}
$api_key = $_POST['api_key'];
$template_game = $_POST['template_game'];
$template_category = $_POST['template_category'];
$template_tags = $_POST['template_tags'];
$template_footer = $_POST['template_footer'];
$random_words_before_tags = $_POST['random_words_before_tags'];
$random_words_after_tags = $_POST['random_words_after_tags'];
$chatgpt_model = $_POST['chatgpt_model'];
$maximum_words = $_POST['maximum_words'];

$GameMonetizeConnect->query("UPDATE " . CHATGPT . " 
    SET api_key='$api_key', 
    template_game='$template_game',
    template_category='$template_category',
    template_tags='$template_tags',
    template_footer='$template_footer',
    random_words_before_tags='$random_words_before_tags',
    random_words_after_tags='$random_words_after_tags',
    chatgpt_model='$chatgpt_model',
    maximum_words='$maximum_words'
") or die();

$data['status'] = 200;
$data['success_message'] = $lang['chatgpt_saved'];
