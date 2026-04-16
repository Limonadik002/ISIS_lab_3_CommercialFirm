<?php
require_once __DIR__ . '/../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

// GET all
if ($method === 'GET' && !$id) {
    $result = mysqli_query($conn, "SELECT * FROM client");
    $data = [];
    while ($row = mysqli_fetch_assoc($result)) $data[] = $row;
    sendJson($data);
}

// GET one
if ($method === 'GET' && $id) {
    $stmt = mysqli_prepare($conn, "SELECT * FROM client WHERE Client_ID = ?");
    mysqli_stmt_bind_param($stmt, 'i', $id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $data = mysqli_fetch_assoc($result);
    sendJson($data ?: ['error' => 'Not found'], $data ? 200 : 404);
}
?>