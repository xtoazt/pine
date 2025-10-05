<?php
require 'vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\IOFactory;

if (!defined('R_PILOT')) {
    exit();
}

error_reporting(-1);

$files = $_FILES['file'];
$extension  = explode('.', $files['name']);
if (strtolower(end($extension)) === 'xlsx' && $files["size"] > 0) {
    // Load the uploaded XLSX file directly from the temporary location
    $spreadsheet = IOFactory::load($files["tmp_name"]);

    // Get the active worksheet
    $worksheet = $spreadsheet->getActiveSheet();

    // Get the data as an array
    $gameData = $worksheet->toArray();

    $count = 1;
    $successCount = $failedCount = 0;
    foreach ($gameData as $index => $row) {
        $key = str_replace(" ", "", $row[0]);

        $value = str_replace('"', "'", $row[1]);
        $value = str_replace("\"", "'", $value);
        $value = cleanHtmlTag($value);
        $value = replaceGameIdLinks($value);

        // Update game description
        $sql = "UPDATE ".GAMES." SET description = \"{$value}\" WHERE game_id = {$key}";
        $query = $GameMonetizeConnect->query($sql);
        if ($query) {
            $successCount++;
        }else{
            $failedCount++;
        }

        $data['status'] = 200;
        $data['success_message'] = "Upload success. Success: $successCount, failed: $failedCount";
    }
    
} else {
    $data['error_message'] = "Upload Failed";
}

function replaceGameIdLinks($text)
{
    $pattern = "/{{(.*?)}}/";
    if (preg_match_all($pattern, $text, $matches, PREG_SET_ORDER)) {
        foreach ($matches as $match) {
            $uniqueCode = explode("-", $match[1]);
            if ($uniqueCode[0] == "1") {
                // Games
                $itemData = getItemDataById($uniqueCode[1], GAMES, "game_name", "name", "game_id");
                if ($itemData != null) {
                    $url = siteUrl() . "/game/" . $itemData['game_name'];
                    $placeholder = "<a href='$url'><b>" . ucfirst($itemData['name']) . "</b></a>";
                }
            }

            if ($uniqueCode[0] == "2") {
                // Keywords
                $itemData = getItemDataById($uniqueCode[1], TAGS, "url", "name");
                if ($itemData != null) {
                    $url = siteUrl() . "/tag/" . $itemData['url'];
                    $placeholder = "<a href='$url'><b>" . ucfirst($itemData['name']) . "</b></a>";
                }
            }

            if ($uniqueCode[0] == "3") {
                // Categories
                $itemData = getItemDataById($uniqueCode[1], CATEGORIES, "category_pilot", "name");
                if ($itemData != null) {
                    $url = siteUrl() . "/category/" . $itemData['category_pilot'];
                    $placeholder = "<a href='$url'><b>" . ucfirst($itemData['name']) . "</b></a>";
                }
            }

            if ($uniqueCode[0] == "4") {
                // External links
                $itemData = getItemDataById($uniqueCode[1], EXTERNAL_LINKS, "url", "title");
                if ($itemData != null) {
                    $url = $itemData['url'];
                    $placeholder = "<a href='$url'><b>" . ucfirst($itemData['title']) . "</b></a>";
                }
            }

            if (!is_null($itemData)) {
                // Replace the link with the placeholder
                $text = str_replace("{{{$match[1]}}}", $placeholder, $text);
            }
        }
    }

    return $text;
}

function cleanHtmlTag($html)
{
    $html = str_replace("\\ $", "\\$", $html);
    $html = str_replace("</ ", "</", $html);
    $html = str_replace("< /", "</", $html);
    $html = str_replace("$ ", "$", $html);
    $html = str_replace(" _", "_", $html);
    $html = str_replace(" -", "-", $html);
    $html = str_replace("- ", "-", $html);
    $html = str_replace(" /", "/", $html);
    $html = str_replace("/ ", "/", $html);
    $html = str_replace('"', "'", $html);
    $html = str_replace(" .", ".", $html);
    // $html = str_replace(". ", ".", $html);
    $html = str_replace("< span ", "<span ", $html);
    $html = str_replace("https :", "https:", $html);
    $html = str_replace("> strong>", ">", $html);
    $html = str_replace("< strong>", "<strong>", $html);
    $html = str_replace(' „>', "'", $html);
    $html = str_replace("„", "", $html);
    $html = str_replace("”", "'", $html);
    $html = str_replace("</b> a>", "</b></a>", $html);
    $html = str_replace("< a", "<a", $html);
    $html = str_replace("> a>", "> </a>", $html);
    $html = str_replace('"nu >', '"no">', $html);
    $html = str_replace('> un>', '></a>', $html);
    $html = str_replace("&Acirc;", " ", $html);
    $html = str_replace("true „", "true'", $html);
    $html = str_replace(" Jocul „", "'", $html);
    $html = str_replace(' mai complex ', '', $html);
    $html = str_replace("=' sofisticate ", "='", $html);
    $html = str_replace("16967} }", "169678}}", $html);
    $html = str_replace("{ {", "{{", $html);
    $html = str_replace("} }", "}}", $html);
    $html = str_replace("?", "? ", $html);

    // Special tags replacement
    $html = str_replace("{{99}}", "<p>", $html);
    $html = str_replace("{{98}}", "</p>", $html);
    $html = str_replace("{{97}}", "", $html);
    $html = str_replace("<br>", " ", $html);
    $html = str_replace("{{96}}", "<ul>", $html);
    $html = str_replace("{{95}}", "</ul>", $html);
    $html = str_replace("{{94}}", "<li>", $html);
    $html = str_replace("{{93}}", "</li>", $html);
    // Regex replace
    $html = preg_replace('/>(\w)/', '> $1', $html);

    $html = trim($html);

    return $html;
}

function getItemDataById($id, $table, $fieldUrl, $fieldTitle, $fieldId = "id")
{
    global $GameMonetizeConnect;
    $sql = "SELECT $fieldUrl, $fieldTitle FROM $table WHERE $fieldId = {$id} LIMIT 1";
    $query = $GameMonetizeConnect->query($sql);
    if ($query->num_rows > 0) {
        return $query->fetch_array();
    }
    return null;
}