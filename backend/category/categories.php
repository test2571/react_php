<?php

include '../header.php';
include '../db.php';

function fetchCategoryHierarchy($parentId = null, $conn, $level = 0)
{
    if ($parentId === null) {
        $query = "SELECT * FROM category WHERE parent_id IS NULL ORDER BY category_name";
    } else {
        $query = "SELECT * FROM category WHERE parent_id  = ? ORDER BY category_name";
    }

    $stmt = $conn->prepare($query);
    if ($parentId !== null) {
        $stmt->bind_param("i", $parentId);
    }

    $stmt->execute();
    $result = $stmt->get_result();
    $categories = [];

    while ($row = $result->fetch_assoc()) {
        $row['level'] = $level;
        $categories[] = $row;

        $childCategories = fetchCategoryHierarchy($row['category_id'], $conn, $level + 1);
        $categories = array_merge($categories, $childCategories);
    }

    return $categories;
}

$categories = fetchCategoryHierarchy(null, $conn);

header('Content-Type: application/json');
echo json_encode($categories);