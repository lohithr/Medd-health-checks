<!DOCTYPE html>
<html lang="en">
<head>
  <title>Medd Health-Care</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
  <link href="http://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css">
  <link href="http://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
  <link href="http://localhost/temp/css/index.css" rel="stylesheet" type="text/css">
  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
  
</head>
<body id="myPage" data-spy="scroll" data-target=".navbar" data-offset="60">
<?php include 'header.php'; ?>
<?php
  // Initiate curl
$ch = curl_init('http://api.medd.in/api/healthPackages/getall'); 
// Disable SSL verification
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
// Will return the response, if false it print the response
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// Execute
$result=curl_exec($ch);
// Closing
curl_close($ch);
// Will decode the json
$b=json_decode($result, true);
// echo $b["data"]
$m=$b["data"];
// $not=$n["num_tests"];//not stores the number of tests.
// echo $n."<br>";
if(isset($_GET["city"]))
{
  $city=$_GET["city"];
  $city=strtolower($city);
  $city=str_replace("_", " ", $city);
}
if(isset($_GET["main_lab"]))
{
  $labname=$_GET["main_lab"];
  $labname=strtolower($labname);
  $labname=str_replace("_", " ", $labname);
}
?>



<!-- Container (Pricing Section) -->
<div id="pricing" class="container-fluid">
  <div class="text-center">
    <h2><b>Health Checkup Packages in <?php echo $city;?></b></h2>
    <h3>Customized Packages | Top Labs | Best Prices</h3>
  </div>
  <div class="row">
  <?php 
    $count=0;
    foreach ($m as $key => $value) {

      $n=$m[$key];
    if(is_null($labname)){
      $labname=$n["main_lab"];
    }
    if(is_null($city)){
      $city=$n["city"];
    }
    if(strcasecmp($n["city"],$city)!=0){continue;}
    if(strcasecmp($n["main_lab"],$labname)!=0){continue;}
    $packname=$n["name"];
    $packname=strtolower($packname);
    $packname=str_replace(" ", "_", $packname);
      echo  "<a href=\"http://localhost/temp/health-package/".$city."/".$labname."/".$packname."/\"><div class=\"col-sm-4 col-xs-12\">
            <div class=\"panel panel-default text-center\">
              <div class=\"panel-heading\">
                <h2>".$n["name"]."</h2>
                <h3>at <b>".$n["main_lab"]."</b><br>
                Set of <b>".$n["num_tests"]."</b> Tests<br>
                Home Collection</h3>
              </div>
              <div class=\"panel-footer plan\">";
       echo "<table><tr><td align=\"left\"><span class=\"grey-text font-12\">
            <span class=\"strikethrough\">₹ ".$n["price"]["list"]."</span>
            <span class=\"medd-blue-text\">".round(($n["price"]["list"]-$n["price"]["medd"])*100/$n["price"]["list"])."% Off</span>         
          </span>
          <br>
          <span class=\"font-24\">₹ ".$n["price"]["medd"]."/-</span><br></td>";
        echo    "<td align=\"right\"><a href=\"http://localhost/temp/health-package/".$city."/".$labname."/".$packname."/booking/\"><button class=\"btn btn-lg\">BOOK</button></a></td></tr></table>
              </div>
            </div>      
          </div></a>" ;
          $count++;    
    }
    if($count==0){header("Location:http://localhost/hello.php");
        exit();}
  
  ?>
    
  </div>
</div>
<?php include 'footer.html';?>
</body>
</html>
