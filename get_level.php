<?php
header("Content-Type: application/json");
$jsonData = file_get_contents("test.json");
echo $jsonData;
?>