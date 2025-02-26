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

$screening_id = $_GET["screening_id"] ?? null;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $user_id = $_SESSION["user_id"];
    $screening_id = $_POST["screening_id"];
    $seats = $_POST["seats"];

    foreach ($seats as $seat) {
        $stmt = $conn->prepare("INSERT INTO reservations (user_id, screening_id, seat_row, seat_number) VALUES (?, ?, 0, ?)");
        $stmt->bind_param("iii", $user_id, $screening_id, $seat);

        if (!$stmt->execute()) {
            echo "Error: " . $stmt->error;
        }

        $stmt->close();
    }

    header("Location: confirmation.php");
    exit();
}

$reserved_seats = [];
if ($screening_id) {
    $stmt = $conn->prepare("SELECT seat_number FROM reservations WHERE screening_id = ?");
    $stmt->bind_param("i", $screening_id);
    $stmt->execute();
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
        $reserved_seats[] = $row['seat_number'];
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
    <title>Reserve</title>
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
        <form method="post">
            <h2>Reserve Seats</h2>
            <input type="hidden" name="screening_id" value="<?php echo htmlspecialchars($screening_id); ?>">
            <table>
                <tr>
                    <?php
                    for ($number = 1; $number <= 300; $number++) {
                        if ($number % 20 == 1 && $number != 1) {
                            echo "</tr><tr>";
                        }
                        $checked = in_array($number, $reserved_seats) ? 'checked disabled' : '';
                        echo "<td><input type='checkbox' name='seats[]' value='$number' $checked> $number</td>";
                    }
                    ?>
                </tr>
            </table>
            <input type="submit" value="Reserve">
        </form>
        <form method="get" action="screenings.php">
            <input type="submit" value="Back to Screenings">
        </form>
    </div>
</body>
</html>