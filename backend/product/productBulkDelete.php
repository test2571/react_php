<?php

include '../header.php';
include '../db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['productIds']) || !is_array($input['productIds'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid input: product IDs are required and should be an array.'
        ]);
        exit;
    }

    $productIds = $input['productIds'];

    $productIds = array_map('intval', $productIds);

    $idsString = implode(',', $productIds);

    $sql = "DELETE FROM product WHERE product_id IN ($idsString)";

    if (mysqli_query($conn, $sql)) {
        echo json_encode([
            'success' => true,
            'message' => 'Products deleted successfully.'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'An error occurred while deleting Products.'
        ]);
    }

    mysqli_close($conn);

} else {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method. Use POST.'
    ]);
}