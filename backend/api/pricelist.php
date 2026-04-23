<?php
require_once __DIR__ . '/../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

if ($method === 'GET' && !$id) {
    $sql = "SELECT pl.PriceList_ID, pl.Price, m.Model_name 
            FROM pricelist pl
            LEFT JOIN model m ON pl.PriceList_ID = m.PriceList_ID AND m.Deleted = 0
            WHERE pl.Deleted = 0";
    sendJson(fetchAll($sql));
} elseif ($method === 'GET' && $id) {
    $data = fetchOne("SELECT * FROM pricelist WHERE PriceList_ID = ? AND Deleted = 0", 'i', [$id]);
    sendJson($data ?: ['error' => 'Not found'], $data ? 200 : 404);
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    validateRequired($data, ['Price']);
    validateFloat($data['Price'], 'Цена', 0.01);
    $res = execute("INSERT INTO pricelist (Price) VALUES (?)", 'd', [$data['Price']]);
    sendJson(['id' => $res['insert_id'], 'message' => 'Created']);
} elseif ($method === 'PUT' && $id) {
    $data = json_decode(file_get_contents('php://input'), true);
    validateRequired($data, ['Price']);
    validateFloat($data['Price'], 'Цена', 0.01);
    execute("UPDATE pricelist SET Price=? WHERE PriceList_ID=?", 'di', [$data['Price'], $id]);
    sendJson(['message' => 'Updated']);
} elseif ($method === 'DELETE' && $id) {
    execute("UPDATE pricelist SET Deleted = 1 WHERE PriceList_ID = ?", 'i', [$id]);
    sendJson(['message' => 'Deleted']);
} else sendJson(['error' => 'Method not allowed'], 405);
?>