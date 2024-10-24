<?php

include '../header.php';
include '../db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'] ?? '';
    $username = $data['username'] ?? '';

    if (empty($email) || empty($username)) {
        echo json_encode(['success' => false, 'message' => 'Email or username cannot be empty.']);
        exit;
    }

    $stmt = $conn->prepare("SELECT admin_id FROM admin WHERE email = ? AND username = ?");
    $stmt->bind_param("ss", $email, $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        $userId = $user['admin_id'];

        $resetLink = "http://localhost:5173/resetPassword/?userid=$userId";

        $subject = "Password Reset Request";
        $message = "Hello $username,\n\nTo reset your password, please click the following link:\n$resetLink\n\nIf you did not request this, please ignore this email.";
        $headers = "From: no-reply@yourdomain.com";

        if (mail($email, $subject, $message, $headers)) {
            echo json_encode(['success' => true, 'message' => 'Password reset email has been sent, please check your inbox.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to send email. Please try again later.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'No user found with this email and username.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}