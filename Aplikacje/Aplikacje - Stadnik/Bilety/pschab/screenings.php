<?php
session_start();

if (!isset($_SESSION["user_id"])) {
    header("Location: login.php");
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "pschab";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT id, movie_title, screening_time FROM screenings";
$result = $conn->query($sql);

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Screenings</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <div class="container">
            <h1><a href="screenings.php">Cinema Reservation</a></h1>
            <nav>
                <ul>
                    <li><a href="logout.php">Logout</a></li>
                </ul>
            </nav>
        </div>
    </header>
    <div class="container">
        <?php
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                echo "<div class='screening'>";
                echo "<h3>" . htmlspecialchars($row["movie_title"]) . "</h3>";
                echo "<p>Time: " . htmlspecialchars($row["screening_time"]) . "</p>";
                echo "<a href='reserve.php?screening_id=" . htmlspecialchars($row["id"]) . "' class='btn'>Reserve</a>";
                echo "</div>";
            }
        } else {
            echo "<div class='message'>No screenings available.</div>";
        }
        ?>
    </div>
</body>
</html>