<!DOCTYPE html>
<html lang="en">
<head>
  <title>Bootstrap Theme Company Page</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
  <link href="http://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css">
  <link href="http://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
  <style>
  body {
      font: 400 15px Lato, sans-serif;
      line-height: 1.8;
      color: #000000;
  }
  h1 {
      font-size: 21px;
  }
  h2 {
  	  font-size: 18px;
  }
  h3 {
      font-size: 15px;
  }  
  h4 {
  	  font-size: 12px;
  }
  h5 {
  	  font-size: 09px;
  }
  .jumbotron {
      background-color: #f4511e;
      color: #fff;
      padding: 100px 25px;
      font-family: Montserrat, sans-serif;
  }
  .container-fluid {
      padding: 60px 50px;
  }
  .bg-grey {
      background-color: #f6f6f6;
  }
  .logo-small {
      color: #f4511e;
      font-size: 50px;
  }
  .logo {
      color: #f4511e;
      font-size: 200px;
  }
  .thumbnail {
      padding: 0 0 15px 0;
      border: none;
      border-radius: 0;
  }
  .thumbnail img {
      width: 100%;
      height: 100%;
      margin-bottom: 10px;
  }
  

  .carousel-control.right, .carousel-control.left {
      background-image: none;
      color: #f4511e;
  }
  .carousel-indicators li {
      border-color: #f4511e;
  }
  .carousel-indicators li.active {
      background-color: #f4511e;
  }
  .item h4 {
      font-size: 19px;
      line-height: 1.375em;
      font-weight: 400;
      font-style: italic;
      margin: 70px 0;
  }
  .item span {
      font-style: normal;
  }
  .panel {
      /*border: 1px solid #15a6ff; */
      border-radius:0 !important;
      transition: box-shadow 0.5s;
      text-align: left;
      /*padding-left: 40px;*/
      /*padding-right: 40px;*/
  }
  .panel:hover {
      box-shadow: 5px 0px 40px rgba(0,0,0, .2);
  }
  .panel-footer .btn:hover {
      border: 1px solid #15a6ff;
      background-color: #fff !important;
      color: #15a6ff;
  }
  .panel-heading {
      color: #000000 !important;
      background-color: white !important;
      padding: 10px;
      /*border-bottom: 1px solid transparent;*/
      border-top-left-radius: 0px;
      border-top-right-radius: 0px;
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
      text-align: left;
  }
  .panel-heading h2{
  	  /*background-color: #15a6ff !important;*/
  	  color: #15a6ff ;
  	  line-height: 2px;
  }
  .panel-heading h3{
  	  font-size: 14px;
  }
  .panel-footer {
      background-color: white !important;
  }
  .panel-footer h3 {
  	  color: black;
      /*font-size: 28px;*/
  }
  .panel-footer h4 {
      color: #aaa;
      /*font-size: 14px;*/
  }
  .panel-footer .btn {
      margin: 15px 0;
      background-color: #15a6ff;
      color: #fff;
      float: right;
  }
  
  .row {
      padding-left: 150px;
      padding-right: 150px;
  }

  .navbar {
      margin-bottom: 0;
      background-color: #15a6ff;
      z-index: 9999;
      border: 0;
      /*font-size: 12px !important;*/
      line-height: 1.42857143 !important;
      letter-spacing: 4px;
      border-radius: 0;
      font-family: Montserrat, sans-serif;
  }

  .strikethrough {
  text-decoration: line-through;
  color: #818181;
  font-size: 12px;
  }

  .medd-blue-text{
   color: #818181;
   font-size: 13px;
  }

  .navbar li a, .navbar .navbar-brand {
      color: #fff !important;
  }
  .navbar-nav li a:hover, .navbar-nav li.active a {
      color: #f4511e !important;
      background-color: #fff !important;
  }
  .navbar-default .navbar-toggle {
      border-color: transparent;
      color: #fff !important;
  }

  .text-center h2{
  	font-size: 22px;
  }
  .text-center h3{
  	font-size: 17px;
  }

  footer .glyphicon {
      /*font-size: 20px;*/
      margin-bottom: 20px;
      color: #f4511e;
  }
  
  @media screen and (max-width: 768px) {
    .col-sm-4 {
      text-align: center;
      margin: 25px 0;
    }
    .btn-lg {
        width: 100%;
        margin-bottom: 35px;
    }
  }
  @media screen and (max-width: 480px) {
    .logo {
        font-size: 150px;
    }
  }
  </style>
</head>
<body id="myPage" data-spy="scroll" data-target=".navbar" data-offset="60">

<!-- <nav class="navbar navbar-default navbar-fixed-top">
  <div class="container">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>                        
      </button>
      <a class="navbar-brand" href="#myPage">Logo</a>
    </div>
    <div class="collapse navbar-collapse" id="myNavbar">
      <ul class="nav navbar-nav navbar-right">
        <li><a href="#about">ABOUT</a></li>
        <li><a href="#services">SERVICES</a></li>
        <li><a href="#portfolio">PORTFOLIO</a></li>
        <li><a href="#pricing">PRICING</a></li>
        <li><a href="#contact">CONTACT</a></li>
      </ul>
    </div>
  </div>
</nav> -->

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
?>



<!-- Container (Pricing Section) -->
<div id="pricing" class="container-fluid">
  <div class="text-center">
    <h2><strong>Health Checkup Packages in Mumbai</strong></h2>
    <h3>Customized Packages | Top Labs | Best Prices</h3><br>
  </div>
  <div class="row">
  <?php 
    foreach ($m as $key => $value) {
      $n=$m[$key];
      echo  "<a href=\"testing.php?value=".$key."\"><div class=\"col-sm-4 col-xs-12\">
            <div class=\"panel panel-default text-center\">
              <div class=\"panel-heading\">
                <h2>".$n["name"]."</h2>
                <h3>at <strong>".$n["main_lab"]."</strong><br><br><br>
                Set of <strong>".$n["num_tests"]."</strong> Tests<br>
                Home Collection</h3>
              </div>
              <div class=\"panel-footer plan\">";
       echo "<table><tr><td align=\"left\"><span class=\"grey-text font-12\">
						<span class=\"strikethrough\">₹ ".$n["price"]["list"]."</span>
						<span class=\"medd-blue-text\">".round(($n["price"]["list"]-$n["price"]["medd"])*100/$n["price"]["list"])."% Off</span>					
					</span>
					<br>
					<span class=\"font-24\">₹ ".$n["price"]["medd"]."/-</span><br></td>";
        echo    "<td align=\"right\"><a href=\"temp.php\"><button class=\"btn btn-lg\">BOOK</button></a></td></tr></table>
              </div>
            </div>      
          </div></a>" ;    
  }
  ?>
    <!-- <div class="col-sm-4 col-xs-12">
      <div class="panel panel-default text-center">
        <div class="panel-heading">
          <h1>Pro</h1>
        </div>
        <div class="panel-body">
          <p><strong>50</strong> Lorem</p>
          <p><strong>25</strong> Ipsum</p>
          <p><strong>10</strong> Dolor</p>
          <p><strong>5</strong> Sit</p>
          <p><strong>Endless</strong> Amet</p>
        </div>
        <div class="panel-footer plan">
          <h3>$29</h3>
          <h4>per month</h4>
          <button class="btn btn-lg">Sign Up</button>
        </div>
      </div>      
    </div>    -->    
    <!-- <div class="col-sm-4 col-xs-12">
      <div class="panel panel-default text-center">
        <div class="panel-heading">
          <h1>Premium</h1>
        </div>
        <div class="panel-body">
          <p><strong>100</strong> Lorem</p>
          <p><strong>50</strong> Ipsum</p>
          <p><strong>25</strong> Dolor</p>
          <p><strong>10</strong> Sit</p>
          <p><strong>Endless</strong> Amet</p>
        </div>
        <div class="panel-footer plan">
          <h3>$49</h3>
          <h4>per month</h4>
          <button class="btn btn-lg">Sign Up</button>
        </div>
      </div>      
    </div>  -->   
  </div>
</div>




</body>
</html>