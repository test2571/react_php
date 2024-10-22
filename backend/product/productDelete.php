<?php

include '../header.php';
include '../db.php';

$productId = isset($_GET['pid']) ? intval($_GET['pid']) : 0;

if ($productId > 0) {
    $imageSql = 'SELECT image_link FROM product WHERE product_id = ?';

    if ($stmt = $conn->prepare($imageSql)) {
        $stmt->bind_param('i', $productId);

        if ($stmt->execute()) {
            $result = $stmt->get_result();

            if ($row = $result->fetch_assoc()) {
                $imageLinks = $row['image_link'];
                if (!empty($imageLinks)) {
                    $imageArray = explode(',', $imageLinks);

                    foreach ($imageArray as $imagePath) {
                        $imagePath = '../images/' . trim($imagePath);

                        if (file_exists($imagePath)) {
                            unlink($imagePath);
                        }
                    }
                }
            }
        } else {
            echo json_encode(["success" => false, "message" => "Error retrieving product images."]);
            exit;
        }
        $stmt->close();
    }

    $sql = 'DELETE FROM product WHERE product_id = ?';

    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param('i', $productId);

        if ($stmt->execute()) {
            if ($stmt->affected_rows >= 0) {
                echo json_encode(["success" => true, "message" => "Product deleted successfully."]);
            } else {
                echo json_encode(["success" => false, "message" => "Product not found or already deleted."]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Error deleting product."]);
        }

        $stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "Error preparing the SQL statement."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid Product ID."]);
}

$conn->close();
