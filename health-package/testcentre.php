<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="author" content="HolaMed Healthcare Technologies / Medd.in">
	<meta name="description" content="Aarogyam 1.7 is a full body health checkup offered by Thyrocare.">
	<!-- <base href="/"></base> -->
	<title>Health-Care</title>
	<!-- CSS -->
	<!-- <link rel="shortcut icon" href="favicon.png" type="image/x-icon"/> -->
	<link rel="icon" href="http://medd.in/tests/files/2015/10/cropped-favicon-32x32.png" sizes="32x32">
	<link rel="icon" href="http://medd.in/tests/files/2015/10/cropped-favicon-192x192.png" sizes="192x192">
	
	<link rel="stylesheet" href="../../css/materialize.min.css"/>

	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
	<link rel="stylesheet" href="../../css/style.css">
</head>
	<!-- Google Analytics -->
	<script>
	  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

	  ga('create', 'UA-63319268-1', 'auto');
	  ga('send', 'pageview');
	</script>
<body>
<?php include 'header.php'; ?>
<div class="container container-80 ">
	 <?php
	 if(isset($_GET["name"]))
	 {
    $name = $_GET["name"];
    $name=strtolower($name);
	$name=str_replace("_", " ", $name);
	 } 
	 if(isset($_GET["main_lab"]))
	 {
      $lname = $_GET["main_lab"];
      $lname=strtolower($lname);
	$lname=str_replace("_", " ", $lname);
	 } 
	 if(isset($_GET["city"]))
	 {
	 	$cname=$_GET["city"];
	 	$cname=strtolower($cname);
	    $cname=str_replace("_", " ", $cname);
	 }
	 if(isset($_GET["value"]))
	 {
	 	$val=$_GET["value"];
	 }
    // Initiate curl
	$ch = curl_init('http://api.medd.in/api/healthPackages/get?publish=true&city=mumbai'); 
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
    	header("Location:http://localhost/hello.php");
        exit();
    }
	$n=$b["data"][$val];
	$packname=$n["name"];
	$packname=strtolower($packname);
	$packname=str_replace(" ", "_", $packname);
	$labname=$n["main_lab"];
	$labname=strtolower($labname);
	$labname=str_replace(" ", "_", $labname);
	$city=$n["city"];
	$city=strtolower($city);
	$city=str_replace(" ", "_", $city);
	$not=$n["num_tests"];//not stores the number of tests.
    ?>

	<div class="row">
		<br>
		<div class="col l5 hide-on-med-and-down">
			<img src=<?php echo $n["cover"]["image"]; ?> width="100%;">
		</div>
		<div class="col l1 hide-on-med-and-down">
			<span class="white-text">.</span>
		</div>
		<div class="col l6 m12 s12">
			<div class="title font-24 bold"><?php echo $n["name"]; ?> by <?php echo $n["main_lab"]; ?>   in <?php echo $n["city"]; ?> </div>
			<div class="subtitle font-16 grey-text"><?php echo $not; ?> Blood Tests Included in the Package (<?php echo $not; ?> parameters)</div>
			<br>
			<div class="specs">
				<div>
					<i class="material-icons">access_time</i> Reporting time: 24 hours
				</div>
				<?php
				if($n["home_collection"])
				   echo   "<div>
					      <i class=\"material-icons\">directions_car</i> Free home sample collection
				          </div>" ;
                ?>
				<div>
					<i class="material-icons">content_copy</i> Free e-Report will be emailed
				</div>
				<div>
					<i class="material-icons">receipt</i> Hard copy is also available at 35 extra
				</div>
			</div>
			<br>
			<div class="row">
				<div class="col l5 m6 s6">
					<div class="medd-blue-text bold">Samples Collected</div>
					<?php
                       foreach ($n["samples"] as $key => $value){
 							if($value)
 								echo "<div class=\"font-12 grey-text text-darken-2\"> &middot; ".$key."</div>";

                       }
                       ?>
				</div>
				<div class="col l5 m6 s6">
					<div class="medd-blue-text bold">Prerequisites</div>
					<div class="font-12 grey-text text-darken-2"> &middot; Fasting for 10 hours</div>
				</div>
			</div>
			<br>
			<div>
				<div>

					<span class="grey-text font-12">
						List Price : <span class="strikethrough">Rs. <?php echo $n["price"]["list"]; ?></span>
						<span class="medd-blue-text"><?php echo round(($n["price"]["list"]-$n["price"]["medd"])*100/$n["price"]["list"]); ?>% Off</span>					
					</span>
					<br>
					<span class="font-24">Medd Price : Rs.  <?php echo $n["price"]["medd"]; ?>/-</span>
				</div>
				<a href=<?php echo "\"http://localhost/temp/health-package/".$city."/".$labname."/".$packname."/booking\""; ?> >
				<button class="btn waves-effect waves-light medd-blue">
					Book Now
				</button>
				</a>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col s12">
			<div class="medd-blue-text font-20">Organs/Diseases covered under the package</div>
			<div class="organs">
				<div class="line-height-2_5 font-16">
					<span class="circular-border current-step">
						Blood 
					</span>
					<span class="circular-border current-step">
						Diabetes 
					</span>
					<span class="circular-border current-step">
						Thyroid 
					</span>
					
				</div>
			</div>
		</div>
	</div>
	<br>
	<div class="row">
		<div class="col l6 m12 s12 faqs">
			<div class="medd-blue-text font-20">Frequently Asked Questions</div>
			<div class="faq">
				<div class="question">What do I need to do before the health checkup?</div>
				<div class="answer">Please do not eat anything for at-least 10-12 hours before the test. You can drink water and take any regular medications.</div>
			</div>
			<div class="faq">
				<div class="question">Is it uncomfortable?</div>
				<div class="answer">We work with highly trained phlebotomists to ensure minimum discomfort while collecting the blood sample.</div>
			</div>
			<div class="faq">
				<div class="question">What are the payment options available?</div>
				<div class="answer">You can pay the full amount to the collection person after the blood sample is collected.</div>
			</div>
			<div class="faq">
				<div class="question">Are there any other charges?</div>
				<div class="answer">NO! Home collection is free, ecopy of report is free, hard copy is chargeable at 35 extra. </div>
			</div>
			<div class="faq">
				<div class="question">I am super busy! How long will this take?</div>
				<div class="answer">The sample will be collected from your home/ office and will tae hardly 5 minutes</div>
			</div>
		</div>
		<div class="col l6 m12 s12">
			<div class="row">
				<div class="medd-blue-text">About Thyrocare</div>
				<div class="font-12 grey-text">
					Thyrocare has presence across India with centers located in 3000 areas. Thyrocare is an elite pathology and wellness services provider with the motto of "Affordable, Accurate and Accredited pathology'
				</div>
			</div>
			<div class="divider"></div>
			<br>
			<div class="row">
				<div class="medd-blue-text">Package description</div>
				<div class="font-12 grey-text">
					This health checkup is a full body comprehensive pathology package which screens for most common diseases like thyroid, hypertension, diabetes as well as diseases related to heart, kidney, liver, malnutrition, toxicity and blood. It is recommended that health check-ups should be done every 6-12 months to ensure a healthy body
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col s12">
			<div class="font-20 medd-blue-text">Test Details</div>
			<div class="row">
				<div class="col s12">
				<?php
				$i=1;
				foreach ($n["testgroups"] as $key => $value) {
					echo "<div class=\"grey lighten-2\">".$i.". ".$n["testgroups"][$key]["name"]."</div><br>";$i++;
						echo "<div class=\"row\">";
						foreach ($n["testgroups"][$key]["tests"] as $key1 => $value1) {
						       echo "<div class=\"col l4\">".$n["testgroups"][$key]["tests"][$key1]["name"]."</div> " ;
						}
					    echo   "</div>";
					
				}
				?>
					
				</div>
			</div>
		</div>
	</div>
</div>
<?php include 'footer.html';?>
<script type="text/javascript" src="../../js/jquery-2.1.4.min.js"></script>
<script type="text/javascript" src="../../js/materialize.min.js"></script>
</body>
</html>
