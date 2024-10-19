<?php

include '../header.php';
include '../db.php';

$categoryId = isset($_GET['cid']) ? intval($_GET['cid']) : 0;

if ($categoryId > 0) {
    $sql = 'DELETE FROM category where category_id = ?';

    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param('i', $categoryId);

        if ($stmt->execute()) {
            if ($stmt->affected_rows >= 0) {
                echo json_encode(["success" => true, "message" => "Category deleted successfully."]);
            } else {
                echo json_encode(["success" => false, "message" => "Category not found or already deleted."]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Error deleting category."]);
        }

        $stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "Error preparing the SQL statement."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid category ID."]);
}

$conn->close();