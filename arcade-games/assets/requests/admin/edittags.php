<?php 
    if (!defined('R_PILOT')) { exit(); }

        if (!empty($_POST['ec_name'])) {
            if (isset($_POST['ec_name'])) {
                $ec_name = secureEncode($_POST['ec_name']);
                $ec_id   = secureEncode($_POST['ec_id']);
                $ec_footer_description   = $_POST['ec_footer_description'];
                $ec_show_home = isset($_POST['ec_show_home']) && $_POST['ec_show_home'] == 'true' ? 1 : 0;
                $sql_chk_tags = $GameMonetizeConnect->query("SELECT id FROM ".TAGS." WHERE name='{$ec_name}'");
                $is_last_rewrite   = $_POST['is_last_rewrite'] == "on" ? 1 : 0;
                if (true) {
                    // if (preg_match("/^[a-zA-Z- ]+$/", $ec_name)) {
                    if (preg_match("/^[a-zA-Z- 0-9.]+$/", $ec_name)) {
                        if (strlen($ec_name) <= 100) {
                            $seo_name = seo_friendly_url($ec_name);

                            $isSuccess = false;

                            if (isset($_FILES['__game_image']['tmp_name'])) {
                                  if (isset($_FILES['__game_image']['tmp_name'])) {
                                  if ($_FILES['__game_image']['size'] > 1024) {
                                        $addgame_media = $_FILES['__game_image'];
                                        $addgame['image'] = uploadGameMediaTag($addgame_media,$seo_name);
                                        
                                        $addgame_mediaurl = $addgame['image']['url'].'.'.$addgame['image']['extension'];
                                       
                                        $isSuccess = $GameMonetizeConnect->query("UPDATE ".TAGS." SET url='{$seo_name}',name='{$ec_name}',image='{$addgame_mediaurl}',footer_description='{$ec_footer_description}', is_last_rewrite={$is_last_rewrite},show_home='{$ec_show_home}'  WHERE id='{$ec_id}'");
                                                
                                    } else { $data['error_message'] = $lang['error_image_size']; }
                                    } else { $data['error_message'] = $lang['message_select_img_files']; }
                            } else {
                                $isSuccess = $GameMonetizeConnect->query("UPDATE ".TAGS." SET url='{$seo_name}',name='{$ec_name}',footer_description='{$ec_footer_description}', is_last_rewrite={$is_last_rewrite},show_home='{$ec_show_home}'  WHERE id='{$ec_id}'");
                            }

                            if ($isSuccess) {
                                $data = array(
                                    'status' => 200,
                                    'success_message' => $lang['tags_edited']
                                );
                            } else {
                                $data['error_message'] = $lang['error_message'];
                            }
                        } else { $data['error_message'] = $lang['tags_name_exceed']; }
                    } else { $data['error_message'] = $lang['invalid_characters']; }
                } else { $data['error_message'] = $lang['tags_exists']; }
            } else { $data['error_message'] = $lang['error_message']; }
        } else { $data['error_message'] = $lang['must_enter_name']; }

function seo_friendly_url($string){
    $string = str_replace(array('[\', \']'), '', $string);
    $string = preg_replace('/\[.*\]/U', '', $string);
    $string = preg_replace('/&(amp;)?#?[a-z0-9]+;/i', '-', $string);
    $string = htmlentities($string, ENT_COMPAT, 'utf-8');
    $string = preg_replace('/&([a-z])(acute|uml|circ|grave|ring|cedil|slash|tilde|caron|lig|quot|rsquo);/i', '\\1', $string );
    $string = preg_replace(array('/[^a-z0-9]/i', '/[-]+/') , '-', $string);
    return strtolower(trim($string, '-'));
}