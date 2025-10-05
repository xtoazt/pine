<?php
if (!defined('R_PILOT')) {
    exit();
}
error_reporting(-1);
if (!empty($_POST['slider_type'])) {
    $slider_id = $_POST['slider_id'];
    $slider_type = $_POST['slider_type'];
    $slider_category_tags = $_POST['slider_category_tags'];
    $slider_ordering = $_POST['slider_ordering'] < 1 ? 0 : $_POST['slider_ordering'];

    if (!($slider_type == 'category' || $slider_type == 'tags')) {
        $slider_category_tags = 'none';
    }
    if ($slider_category_tags != 'none') {
        $slider_category_tags = explode("-", $slider_category_tags);
        if (count($slider_category_tags) > 1) {
            if ($slider_category_tags[0] != $slider_type) {
                $data['error_message'] = 'Slider type unmatched.';
            } else {
                $insert = update_sliders($slider_id, $slider_type, $slider_category_tags[1], $slider_ordering);
                if ($insert === true) {
                    $data['status'] = 200;
                    $data['success_message'] = 'Success';
                } else {
                    $data['error_message'] = $insert;
                }
            }
        } else {
            $data['error_message'] = $lang['error_message'];
        }
    } else {
        $insert = update_sliders($slider_id, $slider_type, $slider_category_tags[1], $slider_ordering);
        if ($insert === true) {
            $data['status'] = 200;
            $data['success_message'] = 'Success';
        } else {
            $data['error_message'] = $insert;
        }
    }
} else {
    $data['error_message'] = $lang['error_message'];
}


function update_sliders($id, $type, $category_tags, $ordering)
{
    global $GameMonetizeConnect, $lang;
    $category_tags = $category_tags == 'none' ? 0 : $category_tags;

    $insert = $GameMonetizeConnect->query("UPDATE " . SLIDERS . " SET type = '{$type}', category_tags_id = '{$category_tags}', ordering = '{$ordering}' WHERE id = {$id}");

    if ($insert) {
        return true;
    }

    if ($GameMonetizeConnect->errno == '1062') {
        return "The slider already exists.";
    }

    return $lang['error_message'];
}
