<?php

include '../header.php';
include '../db.php';

$data = json_decode(file_get_contents("php://input"), true);

$field = $data['field'] ?? null;
$value = $data['value'] ?? null;
$admin_id = $data['admin_id'] ?? null;

$response = ["success" => false];

if ($field && $value && $admin_id) {
    $currentValueQuery = "SELECT $field FROM admin WHERE admin_id = ?";
    $stmt = $conn->prepare($currentValueQuery);
    $stmt->bind_param("i", $admin_id);
    $stmt->execute();
    $currentResult = $stmt->get_result();
    $currentRow = $currentResult->fetch_assoc();

    if ($currentRow && $currentRow[$field] === $value) {
        $response["success"] = true;
        echo json_encode($response);
        exit();
    }

    if ($field === "username") {
        $checkQuery = "SELECT COUNT(*) AS count FROM admin WHERE username = ? AND admin_id != ?";
        $stmt = $conn->prepare($checkQuery);
        $stmt->bind_param("si", $value, $admin_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();

        if ($row['count'] > 0) {
            $response["error"] = "username_taken";
            echo json_encode($response);
            exit;
        }
    }

    $updateQuery = "UPDATE admin SET $field = ? WHERE admin_id = ?";
    $stmt = $conn->prepare($updateQuery);
    $stmt->bind_param("si", $value, $admin_id);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        $response["success"] = true;
    } else {
        $response["error"] = "update_failed";
    }
} else {
    $response["error"] = "invalid_parameters";
}

echo json_encode($response);

$stmt->close();
$conn->close();