
<?php
require('db.php');
if (isset($_REQUEST['username'])){
        
	$username = stripslashes($_REQUEST['username']);
	$username = mysqli_real_escape_string($con,$username); 
	$email = stripslashes($_REQUEST['email']);
	$email = mysqli_real_escape_string($con,$email);
	$password = stripslashes($_REQUEST['password']);
	$password = mysqli_real_escape_string($con,$password);
	$trn_date = date("Y-m-d H:i:s");
        $query = "INSERT into `users` (username, password, email, trn_date)
VALUES ('$username', '".md5($password)."', '$email', '$trn_date')";
        $result = mysqli_query($con,$query);
        if($result){
            echo "<div class='form'>
<h3>You are registered successfully.</h3>
<br/>Click here to <a href='login.php'>Login</a></div>";
        }
    }else{
?>
<div class="form"><center>
<h1>Registration</h1>
<form name="registration" action="" method="post"><br>&nbsp;
<input type="text" name="username" placeholder="Username" required /><br>&nbsp;
<input type="email" name="email" placeholder="Email" required /><br>&nbsp;
<input type="password" name="password" placeholder="Password" required /><br>&nbsp;
<input type="submit" name="submit" value="Register" />
</form></center>
</div>
<?php } ?>

