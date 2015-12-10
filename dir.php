<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
echo json_encode(array_map('basename', glob("./uploads/*.{json,csv}", GLOB_BRACE)));
?>