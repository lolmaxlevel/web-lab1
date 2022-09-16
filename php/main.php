<?php

// Hit check functions
function checkTriangle($xVal, $yVal, $rVal): bool
{
    return (($xVal) * ($rVal) <= 0 &&
            (-$xVal) * ($rVal) - ($rVal) * (-$rVal - $yVal) <= 0 &&
            -(($rVal) * ($yVal)) <=0) || (($xVal) * ($rVal) >= 0 &&
            (-$xVal) * ($rVal) - ($rVal) * (-$rVal - $yVal) >= 0 &&
            -(($rVal) * ($yVal)) >=0);

}

function checkRectangle($xVal, $yVal, $rVal): bool
{
  return $xVal <= 0 && $yVal <= 0 && abs($xVal) <= $rVal && abs($yVal) <= $rVal/2;
}

function checkCircle($xVal, $yVal, $rVal): bool
{
  return $xVal >=0 && $yVal >= 0 && sqrt($xVal*$xVal + $yVal*$yVal) <= $rVal;
}

function checkHit($xVal, $yVal, $rVal): bool
{
  return checkTriangle($xVal, $yVal, $rVal) || checkRectangle($xVal, $yVal, $rVal) || checkCircle($xVal, $yVal, $rVal);
}

// Main
$type = $_POST['type'];
$xVal = $_POST['xval'];
$yVal = $_POST['yval'];
$rVal = $_POST['rval'];
if ($_POST['type'] == 'experimental'){
    $img = imagecreatefrompng("../img/graph.png");
    $abob = imagecolorat($img, $xVal,$yVal);
    $colors = imagecolorsforindex($img, $abob);
    $r = ($abob >> 16) & 0xFF;
    $isHit = $r == 255 ? 0:1;
    $xVal = "exp";
    $yVal = "exp";
    $rVal = "exp";
}
else{
    $isHit = checkHit($xVal, $yVal, $rVal) ;
}
$timezoneOffset = $_POST['timezone'];
$converted_isHit = $isHit ? 'true' : 'false';
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
