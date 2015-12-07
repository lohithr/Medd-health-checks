<!DOCTYPE html>
<html lang="en">
<head>
  <title>MEDD Health-Care</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
  <link rel="stylesheet" href="http://localhost/temp/css/confirmation.css">
 <link href="http://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css">
  <link href="http://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
  
</head>
<body id="myPage" data-spy="scroll" data-target=".navbar" data-offset="60">
  <?php include 'header.php'; ?>

<?php
if(isset($_GET["name1"])){
  $name = $_GET["name1"];
  $name=strtolower($name);
  $name=str_replace("_", " ", $name);
} 
if(isset($_GET["main_lab"])){
  $lname = $_GET["main_lab"];
  $lname=strtolower($lname);
  $lname=str_replace("_", " ", $lname);
} 
if(isset($_GET["city"])){
  $cname=$_GET["city"];
  $cname=strtolower($cname);
  $cname=str_replace("_", " ", $cname);
}
session_start();
if(isset($_SESSION["value"])){
  $val=$_SESSION["value"];
}
if(is_null($val)){
  for ($i=0; $i < sizeof($b["data"]); $i++) {
    if(strcasecmp($b["data"][$i]["name"], $name)==0)
      {
        if(strcasecmp($b["data"][$i]["city"], $cname)==0){
          if(strcasecmp($b["data"][$i]["main_lab"], $lname)==0)
          {
            $val=$i;
          }
        }
      }
  }}
    if(is_null($val)){
      //error page
    }
//code for collecting data from booking page here
$result1=$_SESSION["response"];

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
$n=$b["data"][$val];
?>



<!-- Container (Pricing Section) -->
<div id="pricing" class="container-fluid">
  <div class="row">
  <h4 align="center">Congratulations <font color=#15a6ff><?php echo $result1->data->patient->name; ?></font>! You have successfully made a booking.</h4> 
  <h6 align="center">We have sent the booking confirmation to <font color=#15a6ff><?php echo $result1->data->patient->phone; ?></font> and <font color=#15a6ff><?php echo $result1->data->patient->email; ?></font><br>Show the SMS or email at the center before the test.</h6> 

  <h6 align="center"><font size=3>Details of the booking are as follows:-</font></h6>  </div> 
  <div class="row">
  <?php
      echo  "<div class=\"col-sm-4 col-xs-12\">
          </div>" ;  
  ?>   
  <?php
      echo  "<div class=\"col-sm-4 col-xs-12\">
            <div class=\"panel panel-default text-center\">
              <div class=\"panel-heading\">
                <h2>".$n["main_lab"]." at ".$n["city"]."</h2><br>
                <div class=\"row\">
                  <span class=\"font-20\">Health Checkup Package : ".$n["name"]."</span><br>
                  <span class=\"font-15\">Set of <strong>".$n["num_tests"]."</strong> Tests</span><br>
                  <span class=\"font-20\">Home Collection</span><br>  
                  
                </div>
              </div>
              <div class=\"panel-footer plan\">";
       echo "<span class=\" font-12\">
            <span>Total Price</span>
            <span class=\"strikethrough\"> ₹ ".$n["price"]["list"]."</span>
            <span class=\"medd-blue-text\">".round(($n["price"]["list"]-$n["price"]["medd"])*100/$n["price"]["list"])."% Discount</span>
          <br>
          <span class=\"font-20\">Total Payable Price:  ₹ ".$n["price"]["medd"]."/-</span><h2>Booking ID:<font color=#15a6ff>".$result1->data->coupon."</font></h2>";
        echo    "
              </div>
            </div>      
          </div>" ;  
  ?>
  </div>
  <h1 align="center"><font size=4>You will soon receive a call from us for confirmation. In case of any queries, you may contact us at <font color= #15a6ff >support@medd.in</font> or <font color= #15a6ff >022-2570-1102</font></font></h1> 
</div>

<?php include 'footer.html';?>
</body>
</html>
