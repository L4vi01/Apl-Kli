<?php
session_start();

if (!isset($_SESSION["user_id"])) {
    header("Location: login.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <div class="container">
            <h1><a href="screenings.php">Cinema Reservation</a></h1>
        </div>
    </header>
    <div class="container">
        <h2>Reservation Confirmed</h2>
        <p>Your reservation has been successfully completed.</p>
        <a href="screenings.php" class="btn">Go back to screenings</a>
    </div>
</body>
</html>