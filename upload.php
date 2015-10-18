<?php

header('Content-Type: text/plain; charset=utf-8');

try {
    
    // Undefined | Multiple Files | $_FILES Corruption Attack
    // If this request falls under any of them, treat it invalid.

    if (
        !isset($_FILES['upfile']['error']) ||
        is_array($_FILES['upfile']['error'])
    ) {
        throw new RuntimeException('Invalid parameters.');
    }

    // Check $_FILES['upfile']['error'] value.
    switch ($_FILES['upfile']['error']) {
        case UPLOAD_ERR_OK:
            break;
        case UPLOAD_ERR_NO_FILE:
            throw new RuntimeException('No file sent.');
        case UPLOAD_ERR_INI_SIZE:
        case UPLOAD_ERR_FORM_SIZE:
            throw new RuntimeException('Exceeded filesize limit.');
        default:
            throw new RuntimeException('Unknown errors.');
    }
	$uploaddir = './uploads/';
	$uploadfile = $uploaddir . basename($_FILES['upfile']['name']);
	// Check if file already exists
	if (file_exists($uploadfile)) {
		throw new RuntimeException('Sorry, file already exists.');
	}
	
    // You should also check filesize here. 
    if ($_FILES['upfile']['size'] > 1000000) {
        throw new RuntimeException('Exceeded filesize limit.');
    }


    if (!move_uploaded_file($_FILES['upfile']['tmp_name'], $uploadfile)) {
        throw new RuntimeException('Failed to move uploaded file.');
    }

    echo 'File is uploaded successfully.';

} catch (RuntimeException $e) {

    echo $e->getMessage();

}

?>
