<?php
require_once __DIR__ . '/../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

if ($method === 'GET' && !$id) {
    $sql = "SELECT m.*, pl.Price FROM model m JOIN pricelist pl ON m.PriceList_ID = pl.PriceList_ID WHERE m.Deleted = 0";
    sendJson(fetchAll($sql));
} elseif ($method === 'GET' && $id) {
    $data = fetchOne("SELECT * FROM model WHERE Model_ID = ? AND Deleted = 0", 'i', [$id]);
    sendJson($data ?: ['error' => 'Not found'], $data ? 200 : 404);
} elseif ($method === 'GET' && isset($_GET['options']) && $_GET['options'] === 'pricelist') {
    sendJson(fetchAll("SELECT PriceList_ID, Price FROM pricelist WHERE Deleted = 0"));
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    validateRequired($data, ['Model_name', 'Color', 'Transmission', 'FuelType', 'PriceList_ID']);
    $res = execute(
        "INSERT INTO model (PriceList_ID, Color, Model_name, Horsepower, Weight, Transmission, FuelType) VALUES (?,?,?,?,?,?,?)",
        'issiiss',
        [$data['PriceList_ID'], $data['Color'], $data['Model_name'], $data['Horsepower'] ?? null, $data['Weight'] ?? null, $data['Transmission'], $data['FuelType']]
    );
    sendJson(['id' => $res['insert_id'], 'message' => 'Created']);
} elseif ($method === 'PUT' && $id) {
    $data = json_decode(file_get_contents('php://input'), true);
    execute(
        "UPDATE model SET PriceList_ID=?, Color=?, Model_name=?, Horsepower=?, Weight=?, Transmission=?, FuelType=? WHERE Model_ID=?",
        'issiissi',
        [$data['PriceList_ID'], $data['Color'], $data['Model_name'], $data['Horsepower'] ?? null, $data['Weight'] ?? null, $data['Transmission'], $data['FuelType'], $id]
    );
    sendJson(['message' => 'Updated']);
} elseif ($method === 'DELETE' && $id) {
    execute("UPDATE model SET Deleted = 1 WHERE Model_ID = ?", 'i', [$id]);
    sendJson(['message' => 'Deleted']);
} else sendJson(['error' => 'Method not allowed'], 405);
?>