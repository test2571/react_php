<?php
include '../header.php';
include '../db.php';
$data = json_decode(file_get_contents("php://input"));
$errorMsg = '';

if (isset($data->username) && isset($data->password)) {
    $username = trim($data->username);
    $password = trim($data->password);

    // PHP validation
    if (empty($username)) {
        $errorMsg = 'Username is required!';
    } elseif (strlen($username) < 5) {
        $errorMsg = 'Username must be atleast 5 characters long.';
    }

    if (empty($password)) {
        $errorMsg = 'Password is required!';
    } elseif (strlen($password) < 6) {
        $errorMsg = 'Password must be atleast 6 characters long.';
    }

    if (empty($errorMsg)) {

        $hashedPassword = md5($password);

        $sql = "SELECT * FROM admin WHERE username = ? AND password = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ss', $username, $hashedPassword);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 1) {
            $user = $result->fetch_assoc();
            echo json_encode(["status" => "success", "message" => "Logged In successfully", "adminId" => $user['admin_id']]);
        } else {
            echo json_encode(["status" => "error", "message" => "Invalid username or password"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => $errorMsg]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid input"]);
}

$conn->close();