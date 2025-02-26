<?php
session_start();
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "pschab";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user = $_POST["username"];
    $pass = password_hash($_POST["password"], PASSWORD_DEFAULT);
    $phone = $_POST["phone_number"];

    $stmt = $conn->prepare("INSERT INTO users (username, password, phone_number) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $user, $pass, $phone);
    
    if ($stmt->execute()) {
        $_SESSION["message"] = "Registration successful";
        header("Location: login.php");
        exit();
    } else {
        $_SESSION["error"] = "Error: " . $stmt->error;
    }

    $stmt->close();
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <div class="container">
            <h1><a href="screenings.php">Cinema Reservation</a></h1>
        </div>
    </header>
    <div class="container">
        <?php
        if (isset($_SESSION["error"])) {
            echo "<div class='error'>" . $_SESSION["error"] . "</div>";
            unset($_SESSION["error"]);
        }
        ?>
        <form method="post">
            <h2>Register</h2>
            Username: <input type="text" name="username" required><br>
            Password: <input type="password" name="password" required><br>
            Phone Number: <input type="text" name="phone_number" required><br>
            <input type="submit" value="Register">
        </form>
    </div>
</body>
</html>