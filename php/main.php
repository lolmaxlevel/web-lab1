<?php


// Hit check functions
function checkTriangle($xVal, $yVal, $rVal) {
    return (($xVal) * ($rVal) <= 0 &&
            (-$xVal) * ($rVal) - ($rVal) * (-$rVal - $yVal) <= 0 &&
            -(($rVal) * ($yVal)) <=0) || (($xVal) * ($rVal) >= 0 &&
            (-$xVal) * ($rVal) - ($rVal) * (-$rVal - $yVal) >= 0 &&
            -(($rVal) * ($yVal)) >=0);

}

function checkRectangle($xVal, $yVal, $rVal) {
  return $xVal <= 0 && $yVal <= 0 && abs($xVal) <= $rVal && abs($yVal) <= $rVal/2;
}

function checkCircle($xVal, $yVal, $rVal) {
  return $xVal >=0 && $yVal >= 0 && sqrt($xVal*$xVal + $yVal*$yVal) <= $rVal;
}

function checkHit($xVal, $yVal, $rVal) {
  return checkTriangle($xVal, $yVal, $rVal) || checkRectangle($xVal, $yVal, $rVal) || checkCircle($xVal, $yVal, $rVal);
}
// Main
if ($_POST['type'] == 'img'){
    $xImg = $_POST['x_cord'];
    $yImg = $_POST['y_cord'];
    $img = imagecreatefrompng("graph.png");
    $abob = imagecolorat($img, $xImg,$yImg);
    $colors = imagecolorsforindex($img, $abob);
    $r = ($abob >> 16) & 0xFF;
    $isHit = $r == 255 ? 1:0;
    $xVal = "0";
    $yVal = "0";
    $rVal = "0";
}
else{
    $xVal = $_POST['xval'];
    $yVal = $_POST['yval'];
    $rVal = $_POST['rval'];
    $isHit = checkHit($xVal, $yVal, $rVal) ;
}
$timezoneOffset = $_POST['timezone'];
$converted_isHit = $isHit ? 'false' : 'true';
$currentTime = date('H:i:s', time()-$timezoneOffset*60);
$executionTime = microtime(true) - $_SERVER["REQUEST_TIME_FLOAT"];
$jsonData = '{' .
  "\"xval\":\"$xVal\"," .
  "\"yval\":\"$yVal\"," .
  "\"rval\":\"$rVal\"," .
  "\"curtime\":\"$currentTime\"," .
  "\"exectime\": \"$executionTime\"," .
  "\"hitres\":$converted_isHit" .
  "}";

echo $jsonData;
