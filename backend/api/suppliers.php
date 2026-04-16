<?php
require_once __DIR__ . '/../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

if ($method === 'GET' && !$id) {
    sendJson(fetchAll("SELECT * FROM suppliers WHERE Deleted = 0"));
} elseif ($method === 'GET' && $id) {
    $data = fetchOne("SELECT * FROM suppliers WHERE Supplier_ID = ? AND Deleted = 0", 'i', [$id]);
    sendJson($data ?: ['error' => 'Not found'], $data ? 200 : 404);
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    validateRequired($data, ['Name', 'Address']);
    $res = execute("INSERT INTO suppliers (Name, Address) VALUES (?,?)", 'ss', [$data['Name'], $data['Address']]);
    sendJson(['id' => $res['insert_id'], 'message' => 'Created']);
} elseif ($method === 'PUT' && $id) {
    $data = json_decode(file_get_contents('php://input'), true);
    execute("UPDATE suppliers SET Name=?, Address=? WHERE Supplier_ID=?", 'ssi', [$data['Name'], $data['Address'], $id]);
    sendJson(['message' => 'Updated']);
} elseif ($method === 'DELETE' && $id) {
    execute("UPDATE suppliers SET Deleted = 1 WHERE Supplier_ID = ?", 'i', [$id]);
    sendJson(['message' => 'Deleted']);
} else sendJson(['error' => 'Method not allowed'], 405);
?>