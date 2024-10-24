<?php

include '../header.php';
include '../db.php';

$response = array();

$query = "SELECT product_id, product_name, price, discount, image_link FROM product ORDER BY RAND() LIMIT 4";
$result = $conn->query($query);

if ($result->num_rows > 0) {
    $products = array();

    while ($row = $result->fetch_assoc()) {
        $images = explode(",", $row['image_link']);
        $firstImage = $images[0];

        $products[] = array(
            "id" => $row['product_id'],
            "name" => $row['product_name'],
            "price" => $row['price'],
            "discount" => $row['discount'],
            "imageLink" => $firstImage
        );
    }

    $response['products'] = $products;
    $response['status'] = "success";
} else {
    $response['status'] = "error";
    $response['message'] = "No products found.";
}

echo json_encode($response);