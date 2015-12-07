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
if(isset($_GET["value"])){
  $val=$_GET["value"];
}


$val = $_GET['value'];
  // Initiate curl
$ch = curl_init('http://api.medd.in/api/healthPackages/getall'); 
// Disable SSL verification
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
// Will return the response, if false it print the response
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// Execute
$result1=curl_exec($ch);
// Closing
curl_close($ch);
// Will decode the json
$b=json_decode($result1, true);

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



class Patient {
      public $name = "";
      public $age  = 1;
      public $email = "";
      public $phone = "";
      public $gender = "";
      public $address = "";
   }

   $patient = new Patient();

  if (isset($_POST["submit"])) {
     $patient->name = $_POST['name'];
    $patient->email = $_POST['email'];
    $patient->age=$_POST['age'];
    $patient->phone=$_POST['phone'];
    $patient->address=$_POST['address'];
    $patient->gender=$_POST['gender'];
    
    // Check if name has been entered
    if (!$_POST['name']) {
      $errName = 'Please enter your name';
    }
    
    // Check if age has been entered
    if (!$_POST['age']) {
      $errAge = 'Please enter your age';
    }

    // Check if email has been entered and is valid
    if (!$_POST['email'] || !filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
      $errEmail = 'Please enter a valid email address';
    }

    // Check if phone number has been entered and is valid
    if (!$_POST['phone'] || (int)$_POST['phone'] >=  10000000000 || (int)$_POST['phone'] <= 999999999) {
      $errPhone = 'Please enter a valid phone number.'.$_POST['phone'];
    }
    
    //Check if address has been entered
    if (!$_POST['address']) {
      $erraddress = 'Please enter your address';
    }

     //Check if gender has been entered
    if (!$_POST['gender']) {
      $errGender = 'Please select your gender';
    }
    
// If there are no errors, send the data to api
if (!$errName && !$errEmail && !$erraddress && !$errPhone && !$errAge && !$errGender) {
  
  $json=json_encode($patient);
  $post_data = json_encode(array("patient"=>$json));

  //code for register response    
  $curl = curl_init("http://api.medd.in/api/patients/create");
  curl_setopt($curl, CURLOPT_HEADER, false);
  curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($curl, CURLOPT_HTTPHEADER,
          array('Content-type: application/json'));
  curl_setopt($curl, CURLOPT_POST, true);
  curl_setopt($curl, CURLOPT_POSTFIELDS, $post_data);
  curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false); //curl error SSL certificate problem, verify that the CA cert is OK
   
  $result     = curl_exec($curl);
  $response   = json_decode($result);
  echo "<h1>".$response->patient->_id."</h1>";

  //code for booking conformation
  class patientfin{
      public $name = "";
      public $_id  = "";
      public $email = "";
      public $phone = "";
  }
  class amount{
      public $mrp =1;
      public $medd=1;
      public $user=1;
  }
  class diagnostics{
      public $_id="";
      public $name="";
      public $email="";
      public $phone="";
      public $address="";
      public $healthPackage="";
      public $price;
      public $test;
      public function Initialize($a,$b)
      {
        $this->price=$a;
        $this->test=$b;
      }
  }
  class txnfin{
    public $type="";
    public $user="";
    public $home_service;
    public $timestamp;
    public $source;
    public $patient;
    public $diagnostics;
    public $pharmacy="";
    public $version=4;
    public $app_version=9;
    public function Initialize($a,$b,$c,$d,$e)
    {
      $this->patient=$a;
      $this->diagnostics=$b;
      $this->home_service=$c;
      $this->source=$d;
      $this->timestamp=$e;
    }
  }
  class test{
    public $_id="";
    public $name="";
  }
  class homeser{
    public $address="";
    public $required;
  }
  class sourceinfo{
    public $type="";
    public $_id="";
    public $geolocation="";
  }
  class timestmp{
    public $booking="";
  }
  $patfin=new patientfin();
  $patfin->_id=$response->patient->_id;
  $patfin->name=$_POST['name'];
  $patfin->email= $_POST['email'];
  $patfin->phone= $_POST['phone'];
  
  $diogfin=new diagnostics();
  $money=new amount();
  $money->mrp=$n["price"]["total"];
  $money->medd=$n["price"]["medd"];
  $money->user=$n["price"]["list"];
  $diogfin->_id=$n["lab"]["_id"];
  $diogfin->name=$n["labs"][0]["name"];
  $diogfin->email=$n["labs"][0]["email"];
  $diogfin->phone=$n["labs"][0]["phone"];
  $diogfin->address=$n["labs"][0]["address"];
  $diogfin->healthPackage=$n["name"];
  $testgroup=new test();
  $testgroup->_id=$n["testgroups"][0]["_id"];
  $testgroup->name=$n["testgroups"][0]["name"];
  $ar=array($testgroup);
  $ar=array_pad($ar, sizeof($n["testgroups"]) , $testgroup);
  for ($i=1; $i <sizeof($n["testgroups"]) ; $i++) {
     $testgroup=new test(); 
     $testgroup->_id=$n["testgroups"][$i]["_id"];
     $testgroup->name=$n["testgroups"][$i]["name"];
     $ar[$i]=$testgroup;
  }
  $diogfin->Initialize($money,$ar);

  $homeserve=new homeser();
  if($n["home_collection"]){
  $homeserve->address=$_POST['address'];}
  else {
    $homeserve->address="";
  }
  $homeserve->required=$n["home_collection"];

  $srcinfo=new sourceinfo();
  $srcinfo->type="web";
  $srcinfo->geolocation="";
  
  $time=new timestmp();
  $time->booking=date("Y-m-d")."T"."."."Z";

  $fintxn=new txnfin();
  $fintxn->type="healthPackage";
  $fintxn->user=$response->patient->_id;
  $fintxn->Initialize($patfin,$diogfin,$homeserve,$srcinfo,$time); 
  $temp=json_encode($fintxn);
  $sjson = json_encode(array("transaction"=>$temp));
  echo $sjson;
  $curl = curl_init("http://api.medd.in/api/transactions/create");
  curl_setopt($curl, CURLOPT_HEADER, false);
  curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($curl, CURLOPT_HTTPHEADER,
          array('Content-type: application/json'));
  curl_setopt($curl, CURLOPT_POST, true);
  curl_setopt($curl, CURLOPT_POSTFIELDS, $sjson);
  curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false); //curl error SSL certificate problem, verify that the CA cert is OK
   
  $result1     = curl_exec($curl);
  $response1   = json_decode($result1);

  //code for sending data to confirming page here
  session_start();
  $_SESSION["response"]=$response1;
  $_SESSION["value"]=$val;
  header("Location:http://localhost/temp/health-package/$city/$labname/$packname/confirmation/");
  exit();
}
  }
?>


<!DOCTYPE html>
<html lang="en">
<head>
  <title>MEDD Health-Care</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
  <link href="http://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet" type="text/css">
  <link href="http://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
  <link rel="stylesheet" type="text/css" href="http://localhost/temp/css/booking.css">
</head>
<body id="myPage" data-spy="scroll" data-target=".navbar" data-offset="60">
<?php include 'header.php'; ?>

<!-- Container (Pricing Section) -->
<div id="pricing" class="container-fluid">
  <div class="row"><br>

  <?php 
      echo  "<a href=\"http://localhost/temp/health-package/".$city."/".$labname."/".$packname."/\"><div class=\"col-sm-4 col-xs-12\">
            <div class=\"panel panel-default text-center\">
              <div class=\"panel-heading\">
                <h2>Cart</h2><br>
                <div class=\"row\">
                  <div class=\"col-sm-4\">Health Package</div>
                  <div class=\"col-sm-4\">MRP</div>
                  <div class=\"col-sm-4\">Medd Price</div>
                </div>
                <div class=\"row\">
                  <div class=\"col-sm-4\">".$n["name"]."</div>
                  <div class=\"col-sm-4\">".$n["price"]["list"]."</div>
                  <div class=\"col-sm-4\">".$n["price"]["medd"]."</div>
                </div>
              </div>
              <div class=\"panel-footer plan\">";
       echo "<span class=\"grey-text font-12\">
            <span class=\"strikethrough\">₹ ".$n["price"]["list"]."</span>
          </span>
          <br>
          <span class=\"font-24\">₹ ".$n["price"]["medd"]."/-</span><br>";
        echo    "
              </div>
            </div>      
          </div></a>" ;  
  ?>   

    <div class="col-sm-8" style="border: 2px solid #f0f0f0;">
        <form class="form-horizontal" role="form" method="post" action=<?php echo "\"http://localhost/temp/health-package/".$city."/".$labname."/".$packname."/booking/\"";?> >
    <h1 style="text-align: center;font-size: 34px;color:#15a6ff;">Patient Details</h1>
    <div class="form-group medd">
        <label for="name" class="col-sm-1 control-label"><i class="material-icons prefix">face</i></label>
        <div class="col-sm-11">
            <input type="text" class="form-control" id="name" name="name" placeholder=" Name" value="<?php echo htmlspecialchars($_POST['name']); ?>">
            <?php echo "<p class='text-danger'>$errName</p>";?>
        </div>
    </div>
    <div class="form-group">
        <label for="age" class="col-sm-1 control-label"><i class="material-icons prefix">cake</i></label>
        <div class="col-sm-5">
            <input type="number" min="0" max="130" class="form-control" id="age" name="age" placeholder="" value="<?php echo htmlspecialchars($_POST['age']); ?>">
            <?php echo "<p class='text-danger'>$errAge</p>";?>
        </div>
        <div class="input-field col s6">
                  <input name="gender" type="radio" id="male" <?php if (isset($gender) && $gender=="male") echo "checked";?>  value="male" >
                  <label for="male">Male</label>
                  <input name="gender" type="radio" id="female" <?php if (isset($gender) && $gender=="female") echo "checked";?>  value="female" >
                  <label for="female">Female</label>
                  <?php echo "<p class='text-danger'>$errGender</p>";?>
        </div>
    </div>
    <div class="form-group ">
        <label for="email" class="col-sm-1 control-label"><i class="material-icons prefix">email</i></label>
        <div class="col-sm-5">
            <input type="email" class="form-control" id="email" name="email" placeholder="example@domain.com" value="<?php echo htmlspecialchars($_POST['email']); ?>">
            <?php echo "<p class='text-danger'>$errEmail</p>";?>
        </div>
        <label for="phone" class="col-sm-1 control-label"><i class="material-icons prefix">phone</i></label>
        <div class="col-sm-5">
            <input type="text" class="form-control" id="phone" name="phone" placeholder="" value="<?php echo htmlspecialchars($_POST['phone']); ?>">
            <?php echo "<p class='text-danger'>$errPhone</p>";?>
        </div>
    </div>
    <div class="form-group">
        <label for="address" class="col-sm-1 control-label"><i class="material-icons prefix">location_on</i></label>
        <div class="col-sm-11">
            <textarea class="form-control" rows="4" name="address"><?php echo htmlspecialchars($_POST['address']);?></textarea>
            <?php echo "<p class='text-danger'>$erraddress</p>";?>
        </div>
    </div>
    <div class="form-group">
        <div class="col-sm-10 col-sm-offset-4" >
            <input id="submit" name="submit" type="submit" value="BOOK APPPOINTMENT" class="btn btn-primary" style="background-color: #15a6ff;">
            <br><br>
        </div>
    </div>
      </form>
    </div>
  </div>
</div>

<?php include 'footer.html';?>


</body>
</html>