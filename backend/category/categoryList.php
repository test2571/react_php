<?php
include '../header.php';
include '../db.php';

$searchQuery = isset($_GET['searchQuery']) ? $_GET['searchQuery'] : "";
$page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
$recordsPerPage = 5;
$startFrom = ($page - 1) * $recordsPerPage;

if (!empty($searchQuery)) {
    $query = 'SELECT c1.category_id, c1.category_name, c1.parent_id, c1.level, c2.category_name AS parent_category_name
                FROM category c1
                LEFT JOIN category c2 ON c1.parent_id = c2.category_id
                WHERE c1.category_name LIKE ?
                LIMIT ?,?';

    $stmt = $conn->prepare($query);
    $searchTerm = '%' . $searchQuery . '%';
    $stmt->bind_param("sii", $searchTerm, $startFrom, $recordsPerPage);
    $stmt->execute();
    $result = $stmt->get_result();
} else {
    $query = 'SELECT c1.category_id, c1.category_name, c1.parent_id, c1.level, c2.category_name AS parent_category_name
                FROM category c1
                LEFT JOIN category c2 ON c1.parent_id = c2.category_id
                LIMIT ?,?';

    $stmt = $conn->prepare($query);
    $stmt->bind_param('ii', $startFrom, $recordsPerPage);
    $stmt->execute();
    $result = $stmt->get_result();
}

if (!empty($searchQuery)) {
    $countQuery = 'SELECT COUNT(*) AS total FROM category WHERE category_name LIKE ?';
    $countStmt = $conn->prepare($countQuery);
    $countStmt->bind_param("s", $searchTerm);
    $countStmt->execute();
    $countResult = $countStmt->get_result();
    $totalCategories = $countResult->fetch_assoc()['total'];
} else {
    $countQuery = 'SELECT COUNT(*) AS total FROM category';
    $countResult = $conn->query($countQuery);
    $totalCategories = $countResult->fetch_assoc()['total'];
}

$categories = array();
while ($row = $result->fetch_assoc()) {
    $categories[] = $row;
}

$response = array(
    'categories' => $categories,
    'totalCategories' => $totalCategories,
);

echo json_encode($response);