<?php
include '../header.php';
include '../db.php';

$searchQuery = isset($_GET['searchQuery']) ? $_GET['searchQuery'] : "";
$page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
$recordsPerPage = 5;
$startFrom = ($page - 1) * $recordsPerPage;

if(!empty($searchQuery)){
    $query = 'SELECT product_id, product_name, sku, image_link, price FROM product WHERE product_name LIKE ? LIMIT ?, ?';
    $stmt = $conn->prepare($query);
    $searchTerm = '%' . $searchQuery . '%';
    $stmt->bind_param("sii", $searchTerm, $startFrom, $recordsPerPage);
    $stmt->execute();
    $result = $stmt->get_result();
}else{
    $query = 'SELECT product_id, product_name, sku, image_link, price FROM product LIMIT ?, ?';
    $stmt = $conn->prepare($query);
    $stmt->bind_param('ii', $startFrom, $recordsPerPage);
    $stmt->execute();
    $result = $stmt->get_result();
}


if (!empty($searchQuery)) {
    $countQuery = 'SELECT COUNT(*) AS total FROM product WHERE product_name LIKE ?';
    $countStmt = $conn->prepare($countQuery);
    $countStmt->bind_param("s", $searchTerm);
    $countStmt->execute();
    $countResult = $countStmt->get_result();
    $totalProducts = $countResult->fetch_assoc()['total'];
} else {
    $countQuery = 'SELECT COUNT(*) AS total FROM product';
    $countResult = $conn->query($countQuery);
    $totalProducts = $countResult->fetch_assoc()['total'];
}
$products = array();

while ($row = $result->fetch_assoc()) {
    $products[] = $row;
}

$response = array(
    'products' => $products,
    'totalProducts' => $totalProducts
);

echo json_encode($response);