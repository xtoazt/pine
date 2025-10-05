<?php
if (!defined('R_PILOT')) {
    exit();
}

error_reporting(-1);
include_once './assets/spinner/class.spin.php';

$textToRewrite = $_POST['originalText'];

$spinner = new wp_auto_spin_spin(1, '', $textToRewrite);

$spinResult = $spinner->spin();

$gameDescription = preg_replace_callback('/{([^}]+)}/', function ($matches) {
    // Split the options by '|'
    $options = explode('|', $matches[1]);
    // Randomly select one of the options
    return $options[array_rand($options)];
}, $spinResult);

$data['status'] = 200;
$data['rewrite_result'] = $gameDescription;