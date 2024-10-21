<?php

include '../header.php';
include '../db.php';

$data = json_decode(file_get_contents("php://input"));
$errorMsg = '';

if (isset($data->categoryName) && isset($data->parentCategory) && isset($data->status) && $data->adminId) {
    $categoryName = trim($data->categoryName);
    $parentCategory = $data->parentCategory == 0 ? null : $data->parentCategory;
    $status = trim($data->status);
    $adminId = $data->adminId;

    // PHP validation
    if (empty($categoryName)) {
        $errorMsg = "Category name is required";
    } elseif (strlen($categoryName) < 3 || strlen($categoryName) > 20) {
        $errorMsg = "Category name should be between 3 to 20 characters";
    }

    if (empty($errorMsg)) {
        if (is_null($parentCategory)) {
            $level = 1;
        } else {
            $parentQuery = "SELECT level FROM category WHERE category_id = ?";
            $parentstmt = $conn->prepare($parentQuery);
            $parentstmt->bind_param('i', $parentCategory);
            $parentstmt->execute();
            $parentResult = $parentstmt->get_result();

            if ($parentResult->num_rows > 0) {
                $parentRow = $parentResult->fetch_assoc();
                $level = $parentRow['level'] + 1;
            } else {
                $errorMsg = "Invalid Parent category selection";
            }
        }

        if (empty($errorMsg)) {
            if (isset($data->categoryId) && !empty($data->categoryId)) {
                $categoryId = $data->categoryId;
                $sql = "UPDATE category set category_name = ?, parent_id = ?, level = ?, status = ?, created_by = ? WHERE category_id = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param('siisii', $categoryName, $parentCategory, $level, $status, $adminId, $categoryId);

                if ($stmt->execute()) {
                    echo json_encode(['status' => 'success', 'message' => 'Category updated successfully!']);
                } else {
                    echo json_encode(['status' => 'error', 'message' => 'Could not update category. Please try again later.']);
                }

            }else{
                $sql = 'INSERT INTO category (category_name, parent_id, level, status, created_by) VALUES (?,?,?,?,?)';
                $stmt = $conn->prepare($sql);
                $stmt->bind_param('siisi', $categoryName, $parentCategory, $level, $status, $adminId);

                if($stmt->execute()){
                    echo json_encode(['status'=> 'success', 'message'=> 'Category added successfully!']);
                }else{
                    echo json_encode(['status' => 'error', 'message' => 'Could not add category. Please try again later.']);
                }
            }
        } else {
            echo json_encode(["status" => "error", "message" => $errorMsg]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => $errorMsg]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid Input"]);
}