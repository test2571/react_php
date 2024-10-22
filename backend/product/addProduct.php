<?php
session_start();
include '../header.php';
include '../db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($_POST['productName'], $_POST['sku'], $_POST['color'], $_POST['size'], $_POST['description'], $_POST['category'], $_POST['price'], $_POST['stockQuantity'], $_POST['mfrCost'], $_POST['minPrice'])) {
    echo json_encode(["status" => "error", "message" => "Invalid Input data."]);
    exit;
}

$productName = $_POST['productName'];
$sku = $_POST['sku'];
$color = $_POST['color'];
$size = $_POST['size'];
$description = $_POST['description'];
$category = $_POST['category'];
$price = $_POST['price'];
$discount = $_POST['discount'];
$stockQuantity = $_POST['stockQuantity'];
$mfrCost = $_POST['mfrCost'];
$shippingCost = $_POST['shippingCost'];
$minPrice = $_POST['minPrice'];
$status = $_POST['status'];
$addedBy = $_POST['adminId'];

$target_dir = "../images/";
$imageNames = [];

if (isset($_FILES['images']) && !empty($_FILES['images']['name'][0])) {
    foreach ($_FILES['images']['name'] as $key => $name) {
        $imageFileType = strtolower(pathinfo($name, PATHINFO_EXTENSION));
        $allowedTypes = ['jpg', 'jpeg', 'png', 'jfif', 'webp'];

        if (!in_array($imageFileType, $allowedTypes)) {
            echo json_encode(["status" => "error", "message" => "Only JPG, JPEG, PNG, and JFIF files are allowed."]);
            exit;
        }

        $uniqueName = uniqid() . '-' . time() . '.' . $imageFileType;
        $target_file = $target_dir . $uniqueName;

        if (move_uploaded_file($_FILES['images']['tmp_name'][$key], $target_file)) {
            $imageNames[] = $uniqueName;
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to upload image."]);
            exit;
        }
    }
}

$images = implode(',', $imageNames);

$sql = "INSERT INTO product (product_name, sku, color, size, description, image_link, category, price, discount, stock_quantity, mfr_cost, shipping_cost, min_price, status, added_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param('ssssssiddidddss', $productName, $sku, $color, $size, $description, $images, $category, $price, $discount, $stockQuantity, $mfrCost, $shippingCost, $minPrice, $status, $addedBy);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Product added successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to add product"]);
}

$stmt->close();
$conn->close();