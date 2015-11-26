
<form name="myform" action="" method="post">
    <select name="page" onchange="this.form.submit()">
        <option value="page1"<?php if($page == "page1"){ echo " selected"; }?>>Page 1</option>
        <option value="page2"<?php if($page == "page2"){ echo " selected"; }?>>Page 2</option>
        <option value="page3"<?php if($page == "page3"){ echo " selected"; }?>>Page 3</option>
    </select>
</form>



<?php
$test=0;
$page = null;
if(isset($_POST['page'])){
    $page = $_POST['page'];
}
switch($page){
    case 'page3': $test=3;include_once('temp.php'); break;
    case 'page2': $test=2;include_once('index.html'); break;
    case 'page1': $test=1;include_once('index1.html'); break;
    default: include_once('t.php'); break;
}
?>
