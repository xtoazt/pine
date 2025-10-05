<?php
	if ( !is_logged() ) {
		$themeData['is_redirect_login'] = (isset($_GET['redirect_url']) && !empty($_GET['redirect_url'])) ? '<input name="redirect_url" value="'.$_GET['redirect_url'].'" type="hidden">' : '';
		$settings = $GameMonetizeConnect->query("SELECT * FROM " . SETTING . " WHERE id='1'");
		$settings = $settings->fetch_array();
		$themeData['is_recaptcha'] = "no";
		if ($settings['recaptcha_site_key'] > 0){
			$themeData['is_recaptcha'] = "yes";
			$themeData['recaptcha_site_key'] = $settings['recaptcha_site_key'];
			$themeData['login_recaptcha'] = \GameMonetize\UI::view('welcome/login_recaptcha');
		}
		$themeData['page_content'] = \GameMonetize\UI::view('welcome/login');
	}
	else {
		$actual_link = "//". $_SERVER['SERVER_NAME'] . "/admin";
		header('Location: '.$actual_link);
		die();
	}