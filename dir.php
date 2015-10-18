<?php
echo json_encode(array_map('basename', glob("./uploads/*.{json,csv}", GLOB_BRACE)));
?>