<html>
<body>  


Welcome <?php $a=$_POST["name"]; echo $a; ?><br>
Your age is: <?php echo $_POST["age"]; ?><br>
Your phone number is :<?php echo $_POST["phone"]; ?><br>
Your email address is: <?php echo $_POST["email"]; ?><br>
Your gender is : <?php echo $_POST["gender"]; ?><br>
Your address is : <?php echo $_POST["address"]; ?><br>


<?php
   class Patient {
      public $name = "";
      public $age  = "";
      public $email = "";
      public $phone = "";
      public $gender = "";
      public $address = "";
   }

   $e = new Patient();
   $e->name = $_POST["name"];
   $e->age = $_POST["age"];
   $e->email = $_POST["email"];
   $e->phone = $_POST["phone"];
   $e->gender = $_POST["gender"];
   $e->address = $_POST["address"];

   $c=json_encode($e);
   echo $c."<br>";
   // $d=new Patient();
   // $d=json_decode($c);
   // echo $d->name;

//code for register response and booking response   
$curl = curl_init('http:/api.medd.in/api/patients/create');
curl_setopt($curl, CURLOPT_HEADER, false);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_HTTPHEADER,
        array("Content-type: application/json"));
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_POSTFIELDS, $c);
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false); //curl error SSL certificate problem, verify that the CA cert is OK
 
$result     = curl_exec($curl);
$response   = json_decode($result);
var_dump($response);
curl_close($curl);

// $data = array ('json' => json_encode($c));
//    $ch = curl_init('http:/api.medd.in/api/patients/create');
// curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");  
// // curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);                                                                   
// curl_setopt($ch, CURLOPT_POSTFIELDS, $data); 
// curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
// curl_setopt($ch, CURLOPT_HTTPHEADER, array( 
//     'Content-Type: application/json',         
//     'Content-Length: ' . strlen($c))         
// );

// $result = curl_exec($ch);
// var_dump($result);echo "<br>";
// curl_close($ch);


//code for collecting info about all health-packages
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

// Will dump a beauty json :3
$b=json_decode($result, true);

// echo $b["data"]
$n=$b["data"][0][name];
echo $n."<br>";
var_dump($b["data"][0][name]);
// $result = file_get_contents($url);
// Will dump a beauty json :3
// var_dump(json_decode($result, true));

?>

</body>
</html>