<?php

include '../header.php';
include '../db.php';

$data = json_decode(file_get_contents("php://input"));
$errorMsg = '';

if (isset($data->newPassword) && isset($data->confirmPassword) && isset($data->adminId)) {
    $newPassword = trim($data->newPassword);
    $confirmPassword = trim($data->confirmPassword);
    $adminId = $data->adminId;

    // PHP validation
    if (empty($newPassword)) {
        $errorMsg = "New Password is Required!";
    } elseif (strlen($newPassword) < 6) {
        $errorMsg = "New password must be atleast 6 characters long.";
    }

    if (empty($confirmPassword)) {
        $errorMsg = "Confirm Password is Required!";
    } elseif (strlen($confirmPassword) < 6) {
        $errorMsg = "Confirm password must be atleast 6 characters long.";
    } elseif ($newPassword !== $confirmPassword) {
        $errorMsg = "Passwords Do not match!";
    }

    if (empty($errorMsg)) {
        $hashedPassword = md5($newPassword);

        $stmt = $conn->prepare("UPDATE admin SET password = ? WHERE admin_id = ?");
        $stmt->bind_param("si", $hashedPassword, $adminId);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Password Changed Successfully!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Could not update Password. Please Try again Later."]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => $errorMsg]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid input"]);
}

$conn->close();