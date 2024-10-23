<?php

include '../header.php';
include '../db.php';

$data = json_decode(file_get_contents('php://input'));

$productId = $data->productId;
$imageToDelete = $data->image;

$query = "SELECT image_link FROM product WHERE product_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $productId);
$stmt->execute();
$stmt->bind_result($imageLinks);
$stmt->fetch();
$stmt->close();

if ($imageLinks) {
    $imagesArray = explode(',', $imageLinks);

    $updatedImagesArray = array_filter($imagesArray, function ($img) use ($imageToDelete) {
        return trim($img) !== trim($imageToDelete);
    });

    $newImageLinks = implode(',', $updatedImagesArray);
    $updateQuery = "UPDATE product SET image_link = ? WHERE product_id = ?";
    $updateStmt = $conn->prepare($updateQuery);
    $updateStmt->bind_param("si", $newImageLinks, $productId);

    if ($updateStmt->execute()) {
        $filePath = "../images/" . trim($imageToDelete);
        if (file_exists($filePath)) {
            unlink($filePath);
        }
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Could not update image links."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Product not found."]);
}

$conn->close();