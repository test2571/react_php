<?php

include '../header.php';
include '../db.php';

$categoryId = isset($_GET['cid']) ? intval($_GET['cid']) : 0;

if ($categoryId <= 0) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid Category ID']);
    exit;
}

$query = "SELECT category_id, category_name, parent_id, status FROM category where category_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $categoryId);

if ($stmt->execute()) {

    $stmt->bind_result($category_id, $category_name, $parent_id, $status);

    if ($stmt->fetch()) {
        $category = [
            'category_id' => $category_id,
            'category_name' => $category_name,
            'parent_id' => $parent_id,
            'status' => $status,
        ];
        echo json_encode(['status' => 'success', 'message' => $category]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Category not Found']);
    }


} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to retrieve category']);
}

$stmt->close();
$conn->close();