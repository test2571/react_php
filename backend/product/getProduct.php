<?php

include '../header.php';
include '../db.php';

$productId = isset($_GET['pid']) ? intval($_GET['pid']) : 0;

if ($productId <= 0) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid Product ID']);
    exit;
}

$query = "SELECT product_id, sku, product_name, color, size, description, image_link, category, price, discount, stock_quantity, mfr_cost, shipping_cost, min_price, status FROM product WHERE product_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $productId);

if ($stmt->execute()) {
    $stmt->bind_result($product_id, $sku, $product_name, $color, $size, $description, $image_link, $category, $price, $discount, $stock_quantity, $mfr_cost, $shipping_cost, $min_price, $status);

    if ($stmt->fetch()) {
        if (strpos($image_link, ',') !== false) {
            $images = explode(",", $image_link);
        } else {
            $images = [$image_link];
        }
        $product = [
            'product_id' => $product_id,
            'sku' => $sku,
            'product_name' => $product_name,
            'color' => $color,
            'size' => $size,
            'description' => $description,
            'images' => $images,
            'category' => $category,
            'price' => $price,
            'discount' => $discount,
            'stock_quantity' => $stock_quantity,
            'mfr_cost' => $mfr_cost,
            'shipping_cost' => $shipping_cost,
            'min_price' => $min_price,
            'status' => $status,
        ];
        echo json_encode(['status' => 'success', 'message' => $product]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Product not Found']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to retrieve product']);
}

$stmt->close();
$conn->close();