<?php
header("Content-Type: application/json");
$jsonData = file_get_contents("level01.json");
echo $jsonData;
?>