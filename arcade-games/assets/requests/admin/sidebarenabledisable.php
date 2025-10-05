<?php
if (!defined('R_PILOT')) {
    exit();
}
error_reporting(-1);

$update = $GameMonetizeConnect->query("UPDATE " . SETTING . " SET is_sidebar_enabled = NOT is_sidebar_enabled ");
if ($update) {
    $data['success_message'] = 'Success';
}else{
    $data['success_message'] = 'Error';
}
