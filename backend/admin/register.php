<?php
include '../header.php';
include '../db.php';
$data = json_decode(file_get_contents("php://input"));
$errorMsg = '';

if (isset($data->username) && isset($data->email) && isset($data->password) && isset($data->fullname) && isset($data->phoneno) && isset($data->status)) {
    $username = trim($data->username);
    $email = trim($data->email);
    $password = trim($data->password);
    $fullname = trim($data->fullname);
    $phoneno = trim($data->phoneno);
    $status = trim($data->status);

    // PHP validation
    if (empty($username)) {
        $errorMsg = "Username is required!";
    } elseif (strlen($username) < 5) {
        $errorMsg = "Username must be atleast 5 characters long.";
    }

    if (empty($email)) {
        $errorMsg = "Email is required!";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errorMsg = 'Invalid email format.';
    }

    if (empty($password)) {
        $errorMsg = 'Password is required!';
    } elseif (strlen($password) < 6) {
        $errorMsg = 'Password must be atleast 6 characters long.';
    }

    if (empty($fullname)) {
        $errorMsg = "Fullname is required!";
    }

    if (empty($phoneno) || strlen($phoneno) != 10) {
        $errorMsg = 'Phone no should be exactly 10 digits long.';
    }

    if (empty($errorMsg)) {

        $hashedPassword = md5($password);

        $sql = "INSERT INTO admin (username, email, password, full_name, phone_no, status) VALUES (?,?,?,?,?,?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ssssss', $username, $email, $hashedPassword, $fullname, $phoneno, $status);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Registered Successfully"]);
        } else {
            if ($stmt->errno === 1062 && strpos($stmt->error, "'username'") !== false) {
                echo json_encode(["status" => "error", "message" => "Username already exists. Please choose another."]);
            } else {
                echo json_encode(["status" => "error", "message" => "Error: Could not register. Please try again. Error details: " . $stmt->error]);
            }

        }
    } else {
        echo json_encode(["status" => "error", "message" => $errorMsg]);
    }

} else {
    echo json_encode(["status" => "error", "message" => "Invalid input"]);
}

$conn->close();