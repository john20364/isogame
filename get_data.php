<?php
header("Content-Type: application/json");
if (!empty($_POST["filename"])) {
    $jsonData = file_get_contents("data\\".$_POST["filename"]);
    echo $jsonData;
} else {
    echo "invalid filename";
}
?>