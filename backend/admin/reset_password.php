<?php

include '../header.php';
include '../db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $userId = $data['userId'] ?? '';
    $newPassword = $data['newPassword'] ?? '';

    if (empty($userId) || empty($newPassword)) {
        echo json_encode(['success' => false, 'message' => 'User ID or new password cannot be empty.']);
        exit;
    }

    $hashedPassword = md5($newPassword);

    $stmt = $conn->prepare("UPDATE admin SET password = ? WHERE admin_id = ?");
    $stmt->bind_param("si", $hashedPassword, $userId);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Password successfully updated.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update password. Please try again later.']);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}