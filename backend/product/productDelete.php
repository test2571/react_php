<?php

include '../header.php';
include '../db.php';

$productId = isset($_GET['pid']) ? intval($_GET['pid']) : 0;

if ($productId > 0) {
    $sql = 'DELETE FROM product where product_id = ?';

    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param('i', $productId);

        if ($stmt->execute()) {
            if ($stmt->affected_rows >= 0) {
                echo json_encode(["success" => true, "message" => "Product deleted successfully."]);
            } else {
                echo json_encode(["success" => false, "message" => "Product not found or already deleted."]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Error deleting Product."]);
        }

        $stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "Error preparing the SQL statement."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid Product ID."]);
}

$conn->close();