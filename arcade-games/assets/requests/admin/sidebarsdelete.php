<?php
if (!defined('R_PILOT')) {
    exit();
}

if (is_logged() && isset($_POST['cid'])) {
    $sidebar_id = secureEncode($_POST['cid']);
    $sql_item = $GameMonetizeConnect->query("SELECT id FROM " . SIDEBAR . " WHERE id='{$sidebar_id}'");
    if ($sql_item->num_rows > 0) {
        $isSuccess = $GameMonetizeConnect->query("DELETE FROM " . SIDEBAR . " WHERE id='{$sidebar_id}'");

        if($isSuccess){
            $data['status'] = 200;
        }
    }
}
