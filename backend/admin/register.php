<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include '../db.php';
$data = json_decode(file_get_contents("php://input"));

if (isset($data->username) && isset($data->email) && isset($data->password) && isset($data->fullname) && isset($data->phoneno) && isset($data->status)) {
    $username = $data->username;
    $email = $data->email;
    $password = $data->password;
    $fullname = $data->fullname;
    $phoneno = $data->phoneno;
    $status = $data->status;

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
    echo json_encode(["status" => "error", "message" => "Invalid input"]);
}

$conn->close();