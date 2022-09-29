<?php

//validate request functions
function validateX($x): bool
{
    $X_MAX = 2;
    $X_MIN = -2;
    if (isset($x) && is_numeric($x) && $x >= $X_MIN && $x <= $X_MAX) {
        return true;
    }
    else return false;
}
function validateY($y): bool
{
    $Y_MAX = 5;
    $Y_MIN = -3;

    if (isset($y) &&is_numeric($y) && $y <= $Y_MAX && $y >= $Y_MIN) {
        return true;
    }
    else return false;
}
function validateR($r): bool
{
    $R_MAX = 4;
    $R_MIN = 1;
    if (isset($r) &&is_numeric($r) && $r<=$R_MAX && $r >= $R_MIN) {
        return true;
    }
    else return false;
}
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

if (!(validateX($_POST['xval']) && validateR($_POST['rval']) && validateY($_POST['yval'])
    && isset($_POST['type']) && isset($_POST['timezone']))) {
    http_response_code(400);
    echo "низя так делать";
    exit(2);
}

$type = $_POST['type'];
$xVal = $_POST['xval'];
$yVal = $_POST['yval'];
$rVal = $_POST['rval'];

//check by color if experimental is checked
if ($type == 'experimental'){
    $img = imagecreatefrompng("../img/graph.png");
    $pixel = imagecolorat($img, $xVal,$yVal);
    $colors = imagecolorsforindex($img, $pixel);
    $r = ($pixel >> 16) & 0xFF;
    $result = $r == 255 ? 'false' :'true';
    $xVal = "exp";
    $yVal = "exp";
    $rVal = "exp";
}
else{
    $result = checkHit($xVal, $yVal, $rVal) ? 'true' : 'false' ;
}
//format date time and script execution time
$timezoneOffset = $_POST['timezone'];

$currentTime = date('H:i:s', time()-$timezoneOffset*60);
$executionTime = microtime(true) - $_SERVER["REQUEST_TIME_FLOAT"];
//response
$jsonData = '{' .
  "\"xval\":\"$xVal\"," .
  "\"yval\":\"$yVal\"," .
  "\"rval\":\"$rVal\"," .
  "\"curtime\":\"$currentTime\"," .
  "\"exectime\": \"$executionTime\"," .
  "\"result\":$result" .
  "}";
echo $jsonData;
