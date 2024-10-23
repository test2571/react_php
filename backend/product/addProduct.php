<?php
session_start();
include '../header.php';
include '../db.php';

$data = json_decode(file_get_contents('php://input'), true);
$errorMsg = '';

if (!isset($_POST['productName'], $_POST['sku'], $_POST['color'], $_POST['size'], $_POST['description'], $_POST['category'], $_POST['price'], $_POST['stockQuantity'], $_POST['mfrCost'], $_POST['minPrice'])) {
    echo json_encode(["status" => "error", "message" => "Invalid Input data."]);
    exit;
}

$productName = trim($_POST['productName']);
$sku = trim($_POST['sku']);
$color = trim($_POST['color']);
$size = trim($_POST['size']);
$description = trim($_POST['description']);
$category = $_POST['category'];
$price = floatval($_POST['price']);
$discount = floatval($_POST['discount']);
$stockQuantity = intval($_POST['stockQuantity']);
$mfrCost = floatval($_POST['mfrCost']);
$shippingCost = floatval($_POST['shippingCost']);
$minPrice = floatval($_POST['minPrice']);
$status = $_POST['status'];
$addedBy = $_POST['adminId'];

// PHP Validation
if (strlen($productName) < 3 || strlen($productName) > 50) {
    $errorMsg = "Product Name should be between 3 to 50 characters.";
}

if (strlen($sku) < 3 || strlen($sku) > 15) {
    $errorMsg = "SKU must be between 3 to 15 characters long";
}

if (!preg_match('/^[a-zA-Z]+$/', $color)) {
    $errorMsg = "Color should only contain letters";
}

if (empty($size)) {
    $errorMsg = "Size is required!";
}

if (strlen($description) < 10) {
    $errorMsg = "Description must be atleast 10 characters long";
}

if ($discount != 0) {
    if ($discount < 0) {
        $errorMsg = "Discount Price should not be negative";
    } elseif ($discount >= $price) {
        $errorMsg = "Discount price should be less than price";
    } elseif ($discount <= $mfrCost) {
        $errorMsg = "Discount price should be greater than Manufacturer Cost";
    } elseif ($discount <= $minPrice) {
        $errorMsg = "Discount Price must be greater than the Min Price";
    }
}

if ($stockQuantity < 0) {
    $errorMsg = "Stock Quantity must be a positive number or zero";
}

if ($mfrCost < 0) {
    $errorMsg = "Manufacturer Cost must be greater than 0";
}

if ($shippingCost < 0) {
    $errorMsg = "Shipping cost cannot be negative";
}

if ($minPrice <= 0) {
    $errorMsg = "Minimum price must be greater than 0";
} elseif ($minPrice > $price) {
    $errorMsg = "Minimum Price must be less than then price";
} elseif ($minPrice <= $mfrCost) {
    $errorMsg = "Minimum Price should be greater than Manufacturer Cost.";
}

if ($stockQuantity === 0) {
    $status = 'Out Of Stock';
}

if (!empty($errorMsg)) {
    echo json_encode(["status" => "error", "message" => $errorMsg]);
    exit;
}

$target_dir = "../images/";
$existingImages = [];
$productId = isset($_POST['pid']) ? intval($_POST['pid']) : null;

if ($productId !== null) {
    $sql = "SELECT image_link FROM product WHERE product_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $productId);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $existingImages = explode(',', $row['image_link']);
    } else {
        echo json_encode(["status" => "error", "message" => "Product not found."]);
        exit;
    }
}

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
    $allImages = array_merge($existingImages, $imageNames);
    $allImages = array_filter($allImages);
} else {
    $allImages = $existingImages;
}

if (!empty($allImages)) {
    $images = implode(",", $allImages);
} else {
    $images = "";
}

if ($productId === null) {
    $sql = "INSERT INTO product (product_name, sku, color, size, description, image_link, category, price, discount, stock_quantity, mfr_cost, shipping_cost, min_price, status, added_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ssssssiddidddss', $productName, $sku, $color, $size, $description, $images, $category, $price, $discount, $stockQuantity, $mfrCost, $shippingCost, $minPrice, $status, $addedBy);
} else {
    $sql = "UPDATE product SET 
                product_name = ?, 
                sku = ?, 
                color = ?, 
                size = ?, 
                description = ?, 
                image_link = ?, 
                category = ?, 
                price = ?, 
                discount = ?, 
                stock_quantity = ?, 
                mfr_cost = ?, 
                shipping_cost = ?, 
                min_price = ?, 
                status = ?, 
                added_by = ?
            WHERE product_id = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ssssssiddidddssi', $productName, $sku, $color, $size, $description, $images, $category, $price, $discount, $stockQuantity, $mfrCost, $shippingCost, $minPrice, $status, $addedBy, $productId);
}

if ($stmt->execute()) {
    if ($productId === null) {
        echo json_encode(["status" => "success", "message" => "Product added successfully"]);
    } else {
        echo json_encode(["status" => "success", "message" => "Product updated successfully"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Failed to add or update product"]);
}

$stmt->close();
$conn->close();
