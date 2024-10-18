<?php
include '../header.php';
include '../db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data["adminId"])) {
        $adminId = $data["adminId"];

        $query = "SELECT admin_id, username, email,full_name, phone_no, status FROM admin WHERE admin_id = ?";

        $stmt = $conn->prepare($query);

        $stmt->bind_param("s", $adminId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 1) {
            $adminDetails = $result->fetch_assoc();
            echo json_encode([
                "status" => "success",
                "adminDetails" => $adminDetails
            ]);
        } else {
            echo json_encode([
                "status" => "error",
                "message" => "Admin not found.",
            ]);
        }
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "adminId is missing from the request body.",
        ]);
    }
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid request method. Only POST requests are allowed."
    ]);
}

$conn->close();