
  <?php
  include 'db.php';
  session_start();
$username=$_SESSION['username'];
$query=mysqli_query($con,"SELECT * FROM users1 where username='bhu'")or die(mysqli_error());
$row=mysqli_fetch_array($query);
  ?>
  <?php
      if(isset($_POST['submit'])){
        $fullname = $_POST['fname'];
        $gender = $_POST['gender'];
        $age = $_POST['age'];
        $address = $_POST['address'];
      $query = "UPDATE users SET full_name = '$fullname',
                      gender = '$gender', age = $age, address = '$address'
                      WHERE user_id = '$id'";
                    $result = mysqli_query($con, $query) or die(mysqli_error($con));
                    ?>
                     <script type="text/javascript">
            alert("Update Successfull.");
            window.location = "index.php";
        </script>
        <?php
             }              
?>
