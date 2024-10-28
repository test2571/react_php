<?php

include '../header.php';
include '../db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $input = json_decode(file_get_contents("php://input"), true);

    if (isset($input['admin_id'])) {
        $admin_id = intval($input['admin_id']);

        $stmt = $conn->prepare("DELETE FROM admin WHERE admin_id = ?");
        $stmt->bind_param("i", $admin_id);

        if ($stmt->execute() && $stmt->affected_rows > 0) {
            echo json_encode([
                "success" => true,
                "message" => "Account deleted successfully."
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Failed to delete account. Account may not exist."
            ]);
        }

        $stmt->close();
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Invalid request. Admin ID is missing."
        ]);
    }
} else {
    echo json_encode([
        "success" => false,
        "message" => "Invalid request method."
    ]);
}

$conn->close();