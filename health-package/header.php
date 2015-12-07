<!DOCTYPE html>
<html lang="en" ng-app="meddApp" class="ng-scope"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><style type="text/css">@charset "UTF-8";[ng\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide:not(.ng-hide-animate){display:none !important;}ng\:form{display:block;}</style><head>
	<meta charset="UTF-8">
	<title>header</title>
	<link rel="icon" href="http://medd.in/tests/files/2015/10/cropped-favicon-32x32.png" sizes="32x32">
	<link rel="icon" href="http://medd.in/tests/files/2015/10/cropped-favicon-192x192.png" sizes="192x192">
	<link rel="stylesheet" type="text/css" href="http://localhost/temp/assets/materialize.min.css">
	<link rel="stylesheet" type="text/css" href="http://localhost/temp/assets/font-awesome.min.css">
	<link rel="stylesheet" type="text/css" href="http://localhost/temp/assets/select.min.css">
	<link rel="stylesheet" type="text/css" href="http://localhost/temp/assets/select2.min.css">
	<link rel="stylesheet" type="text/css" href="http://localhost/temp/assets/selectize.default.min.css">
	<link rel="stylesheet" type="text/css" href="http://localhost/temp/assets/icon" >
	<link rel="stylesheet" type="text/css" href="http://localhost/temp/assets/style.min.css">
	<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
</head>
<body>
<?php
session_start();
if(isset($_GET["city"]))
{
  $city=$_GET["city"];
  $city=strtolower($city);
  $city=str_replace("_", " ", $city);
}

?>
<div class="navbar-fixed ">
	<nav class="white black-text">
		<div class="nav-wrapper">
			<div class="col s12">
				<a class="brand-logo" href="http://book.medd.in/"><img src="http://localhost/temp/assets/logo.png" alt=""></a>
				 <a href="http://www.medd.in/#" data-activates="mobile-nav" class="button-collapse"><i class="mdi-navigation-menu"></i></a>
				 <span class="city-selector medd-blue-text" >
				 <div class="dropdown" style="background-color: #ffffff">
                    <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">
                    <?php 
                    if(is_null($city)){echo "Select City!";}
                    else {echo $city;}
                    ?>
					  <span class="caret"></span></button>
					  <ul class="dropdown-menu">
					    <li><a href="http://localhost/temp/health-package/mumbai/">Mumbai</a></li>
					    <li><a href="http://localhost/temp/health-package/indore/">Indore</a></li>
					    <li><a href="http://localhost/temp/health-package/jaipur/">Jaipur</a></li>
					  </ul>
				 </div>
				 </span>
                 
				<ul class="right hide-on-med-and-down">
					<li>
						<a class="google-play" href="http://bit.ly/medd-app" target="_blank"><img alt="Get it on Google Play" src="http://localhost/temp/assets/google_play.png"></a>
					</li>
					<li>
						<a href="tel:02225701102" class="center-align" id="signup-navbar"><i class="material-icons left font-20" style="margin-right:5px;">phone</i> 022-2570-1102</a>
					</li>
				</ul>
			</div>
		</div>
	</nav>
</div></div>
</body>
</html>