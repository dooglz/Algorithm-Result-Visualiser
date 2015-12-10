<?php
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Credentials: true");
	$files = array_map('basename', glob("./uploads/*.{json,csv}", GLOB_BRACE));
	$allfileObjs = [];
	for ($i=0; $i < sizeof($files); $i++) { 
		//echo "<br>File ".$files[$i]."<br>";
		$file = fopen("uploads/".$files[$i],"r");
		$j = 0;
		$lineObj = [];
		$lineObj["filename"] = $files[$i];
		while(! feof($file))
		{
			$line = fgetcsv($file);
			if($line[0] == "0"){
				break;
			}
			if(sizeof($line) == 1){
				$lineObj[$line[0]] = "";
			}else if(sizeof($line) == 2){
				$lineObj[$line[0]] = $line[1];
			}else{
				$lineObj[$line[0]] = array_slice($line, 1);
			}
		}
		fclose($file);
		array_push($allfileObjs,$lineObj);
	}
	echo json_encode($allfileObjs);
?>