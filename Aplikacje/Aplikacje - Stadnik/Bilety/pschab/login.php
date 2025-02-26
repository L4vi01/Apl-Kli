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
    $pass = $_POST["password"];

    $stmt = $conn->prepare("SELECT id, password FROM users WHERE username = ?");
    $stmt->bind_param("s", $user);
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($id, $hashed_password);
    $stmt->fetch();

    if ($stmt->num_rows > 0 && password_verify($pass, $hashed_password)) {
        $_SESSION["user_id"] = $id;
        header("Location: screenings.php");
        exit();
    } else {
        $_SESSION["error"] = "Invalid credentials";
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
    <title>Login</title>
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
            <h2>Login</h2>
            Username: <input type="text" name="username" required><br>
            Password: <input type="password" name="password" required><br>
            <input type="submit" value="Login">
        </form>
    </div>
</body>
</html>