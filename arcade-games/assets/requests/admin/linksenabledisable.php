<?php
if (!defined('R_PILOT')) {
    exit();
}
$links_id = $_POST['links_id'];
error_reporting(-1);

// Check url generated
$linksData = $GameMonetizeConnect->query("SELECT * FROM " . LINKS . " WHERE id = $links_id");
if ($linksData && $linksData->num_rows > 0) {
    $linksData = $linksData->fetch_array();
    if ($linksData['url'] == "") {
        // Generate random url
        $randomString = generateRandomString(40);
        $GameMonetizeConnect->query("UPDATE " . LINKS . " 
            SET is_active = NOT is_active,
            url = '" . $randomString . "'
            WHERE id = $links_id
        ") or die();

        $htaccessPath = $_SERVER['DOCUMENT_ROOT'] . '/.htaccess'; // Path to your .htaccess file
        $newRule = "\nRewriteRule ^links/" . $randomString . "$ index.php?p=public\n"; // New rule to add

        // Read the current content of the .htaccess file
        $currentContent = file_get_contents($htaccessPath);
        // Define the marker where the new rule should be inserted
        $marker = "## API";

        // Split the content at the marker
        $parts = explode($marker, $currentContent);

        // Check if the marker was found and we have exactly two parts
        if (count($parts) == 2) {
            // Insert the new rule before the marker
            $modifiedContent = $parts[0] . $newRule . $marker . $parts[1];

            // Write the modified content back to the .htaccess file
            file_put_contents($htaccessPath, $modifiedContent);

            // echo "The new rule has been added successfully.";
        } else {
            // echo "The specified marker was not found or is duplicated.";
        }
    } else {
        $newRandomString = generateRandomString(40);
        
        $isSuccess = $GameMonetizeConnect->query("UPDATE " . LINKS . " 
        SET is_active = NOT is_active,
        url = '" . $newRandomString . "'
        WHERE id = $links_id
        ") or die();

        if ($isSuccess) {
            $htaccessFilePath = $_SERVER['DOCUMENT_ROOT'] . '/.htaccess'; // Path to your .htaccess file
            updateHtaccessWithNewString($htaccessFilePath, $newRandomString, $linksData['name']);
        }
    }

    $data['status'] = 200;
    $data['success_message'] = $lang['links_success'];
} else {
    $data['error_message'] = $lang['links_not_found'];
}

function generateRandomString($length = 10)
{
    // Define a string that contains all the characters you want to include in your random string
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    // Get a shuffled version of the $characters string
    $shuffled = str_shuffle($characters);
    // Return the first $length characters of the shuffled string
    return substr($shuffled, 0, $length);
}

function updateHtaccessWithNewString($filePath, $newRandomString, $linkUrl)
{
    $linkUrl = str_replace("autopost", "links", $linkUrl);

    // Read the existing content from the .htaccess file
    $htaccessContent = file_get_contents($filePath);

    // Define the pattern to find the old string
    $pattern = '/RewriteRule \^' . preg_quote($linkUrl, '/') . '\/[A-Za-z0-9]+\$ index\.php\?p=public/';

    // Create a new rule with the new random string
    $replacement = 'RewriteRule ^' . $linkUrl . '/' . $newRandomString . '$ index.php?p=public';

    // Check if a string that matches the pattern exists
    // var_dump($pattern);
    // var_dump(preg_match($pattern, $htaccessContent, $matches));
    // var_dump($matches);
    // die;
    if (preg_match($pattern, $htaccessContent)) {
        // Replace the old rule with the new rule in the file content
        $updatedContent = preg_replace($pattern, $replacement, $htaccessContent);
    } else {
        // If no match, append the new rule to the file content
        $updatedContent = $htaccessContent . PHP_EOL . $replacement;
    }

    // Write the updated content back to the .htaccess file
    file_put_contents($filePath, $updatedContent);
}
