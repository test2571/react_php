<?php

include '../header.php';
include '../db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['categoryIds']) || !is_array($input['categoryIds'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid input: Category IDs are required and should be an array.'
        ]);
        exit;
    }

    $categoryIds = $input['categoryIds'];

    $categoryIds = array_map('intval', $categoryIds);

    $idsString = implode(',', $categoryIds);

    $sql = "DELETE FROM category WHERE category_id IN ($idsString)";

    if (mysqli_query($conn, $sql)) {
        echo json_encode([
            'success' => true,
            'message' => 'Categories deleted successfully.'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'An error occurred while deleting categories due to foreign key reference.'
        ]);
    }

    mysqli_close($conn);

} else {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method. Use POST.'
    ]);
}