<?php
if (!defined('R_PILOT')) {
    exit();
}
error_reporting(-1);
if (!empty($_POST['slider_type'])) {
    $slider_type = $_POST['slider_type'];
    $slider_category_tags = $_POST['slider_category_tags'];
    $slider_ordering = $_POST['slider_ordering'] < 1 ? 0 : $_POST['slider_ordering'];
    $tagsCategory = ['tags', 'category'];
    // Validasi slider_type
    if (!in_array($slider_type, $tagsCategory)) {
        $slider_category_tags = 0;
        $insert = insert_sliders($slider_type, $slider_category_tags, $slider_ordering);
        if ($insert === true) {
            $data['status'] = 200;
            $data['href'] = siteUrl() . "/admin/sliders";
            $data['success_message'] = 'Success';
        } else {
            $data['error_message'] = $insert;
        }
    } else {
        $slider_category_tags = explode("-", $slider_category_tags);
        if (count($slider_category_tags) > 1) {
            if ($slider_category_tags[0] != $slider_type) {
                $data['error_message'] = 'Slider type unmatched.';
            } else {
                $insert = insert_sliders($slider_type, $slider_category_tags[1], $slider_ordering);
                if ($insert === true) {
                    $data['status'] = 200;
                    $data['href'] = siteUrl() . "/admin/sliders";
                    $data['success_message'] = 'Success';
                } else {
                    $data['error_message'] = $insert;
                }
            }
        } else {
            $insert = insert_sliders($slider_type, 'none', $slider_ordering);
        }
    }
} else {
    $data['error_message'] = $lang['error_message'];
}

function insert_sliders($type, $category_tags, $ordering)
{
    global $GameMonetizeConnect, $lang;
    $category_tags = $category_tags == 'none' ? 0 : $category_tags;

    $insert = $GameMonetizeConnect->query("INSERT INTO " . SLIDERS . " (type, category_tags_id, ordering) VALUES ('{$type}', '{$category_tags}', '{$ordering}') ");

    error_log($type.$insert.$category_tags.$ordering);
    
    if ($insert) {
        return true;
    }

    if ($GameMonetizeConnect->errno == '1062') {
        return "The slider already exists.";
    }
    return $lang['error_message'];
}
