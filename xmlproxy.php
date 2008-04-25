<?php
$url = $_GET['url'];
if(!(substr($url, 0, 7) == 'http://')) { die('URLs only'); }
ob_start();

$cache = './xmlcache/'.md5($url);
if(!(file_exists($cache) and (filemtime($cache) > strtotime('today 06:00:00')))) {
//if(!(file_exists($cache) and (filemtime($cache) > (time()-(12*60*60))))) {
	// If the cache doesn't exist, or it was updated before last sunday
	$remote = curl_init($url);
	// Don't return HTTP headers. Do return the contents of the call
	curl_setopt($remote, CURLOPT_HEADER, false);
	curl_setopt($remote, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($remote, CURLOPT_USERAGENT, "Shockwave Flash");
	$xml = curl_exec($remote);
	$cachef = fopen($cache, "w");
	if (!($xml and $cachef)) {
		echo "Error.\n";
	} else {
		fwrite($cachef, $xml);
	}
	curl_close($remote);
	fclose($cachef);
}
header('Content-Type: text/xml');
print file_get_contents($cache);
?>
