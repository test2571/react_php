<?php

include '../header.php';
include '../db.php';

$cid = isset($_GET['cid']) ? intval($_GET['cid']) : 0;

function getAllChildCategories($parent_id, $level = 0, $maxLevel = 4)
{
    global $conn;
    $categories = [$parent_id];

    if ($level < $maxLevel) {
        $query = "SELECT category_id FROM category WHERE parent_id = $parent_id";
        $result = mysqli_query($conn, $query);

        while ($row = mysqli_fetch_assoc($result)) {
            $categories = array_merge($categories, getAllChildCategories($row['category_id'], $level + 1, $maxLevel));
        }
    }

    return $categories;
}

function getProductsByCategories($category_ids)
{
    global $conn;
    $products = [];

    $category_ids_str = implode(',', $category_ids);
    $query = "SELECT * FROM product WHERE category IN ($category_ids_str)";
    $result = mysqli_query($conn, $query);

    while ($row = mysqli_fetch_assoc($result)) {
        $images = explode(',', $row['image_link']);
        $row['image_link'] = trim($images[0]);
        $products[] = $row;
    }

    return $products;
}

$allCategoryIds = getAllChildCategories($cid);
$products = getProductsByCategories($allCategoryIds);

echo json_encode([
    "success" => true,
    "products" => $products,
]);