<?php
require_once __DIR__ . '/../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

if ($method === 'GET' && !$id) {
    $sql = "SELECT m.*, pl.Price 
            FROM model m 
            JOIN pricelist pl ON m.PriceList_ID = pl.PriceList_ID 
            WHERE m.Deleted = 0";
    sendJson(fetchAll($sql));
}
elseif ($method === 'GET' && $id) {
    $data = fetchOne("SELECT * FROM model WHERE Model_ID = ? AND Deleted = 0", 'i', [$id]);
    if ($data) {
        $priceData = fetchOne("SELECT Price FROM pricelist WHERE PriceList_ID = ?", 'i', [$data['PriceList_ID']]);
        $data['Price'] = $priceData['Price'] ?? null;
    }
    sendJson($data ?: ['error' => 'Not found'], $data ? 200 : 404);
}
elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    validateRequired($data, ['Model_name', 'Color', 'Transmission', 'FuelType', 'Price']);
    validateName($data['Model_name'], 'Модель', true, 30);
    validateName($data['Color'], 'Цвет', true, 30);
    validateName($data['Transmission'], 'КПП', true, 50);
    validateName($data['FuelType'], 'Топливо', true, 50);
    validateFloat($data['Price'], 'Цена', 0.01);
    if (!empty($data['Horsepower'])) validateInt($data['Horsepower'], 'Horsepower', 1);
    if (!empty($data['Weight'])) validateInt($data['Weight'], 'Weight', 1);

    $priceRes = execute("INSERT INTO pricelist (Price) VALUES (?)", 'd', [$data['Price']]);
    $priceListId = $priceRes['insert_id'];

    $res = execute(
        "INSERT INTO model (PriceList_ID, Color, Model_name, Horsepower, Weight, Transmission, FuelType) 
         VALUES (?, ?, ?, ?, ?, ?, ?)",
        'issiiss',
        [$priceListId, $data['Color'], $data['Model_name'], $data['Horsepower'] ?? null, $data['Weight'] ?? null, $data['Transmission'], $data['FuelType']]
    );
    sendJson(['id' => $res['insert_id'], 'message' => 'Created']);
}
elseif ($method === 'PUT' && $id) {
    $data = json_decode(file_get_contents('php://input'), true);
    validateRequired($data, ['Model_name', 'Color', 'Transmission', 'FuelType', 'Price']);
    validateName($data['Model_name'], 'Модель', true, 30);
    validateName($data['Color'], 'Цвет', true, 30);
    validateName($data['Transmission'], 'КПП', true, 50);
    validateName($data['FuelType'], 'Топливо', true, 50);
    validateFloat($data['Price'], 'Цена', 0.01);
    if (!empty($data['Horsepower'])) validateInt($data['Horsepower'], 'Horsepower', 1);
    if (!empty($data['Weight'])) validateInt($data['Weight'], 'Weight', 1);

    $current = fetchOne("SELECT PriceList_ID FROM model WHERE Model_ID = ?", 'i', [$id]);
    if (!$current) sendJson(['error' => 'Model not found'], 404);
    $oldPriceListId = $current['PriceList_ID'];

    execute("UPDATE pricelist SET Price = ? WHERE PriceList_ID = ?", 'di', [$data['Price'], $oldPriceListId]);
    execute(
        "UPDATE model SET Color=?, Model_name=?, Horsepower=?, Weight=?, Transmission=?, FuelType=? WHERE Model_ID=?",
        'ssiissi',
        [$data['Color'], $data['Model_name'], $data['Horsepower'] ?? null, $data['Weight'] ?? null, $data['Transmission'], $data['FuelType'], $id]
    );
    sendJson(['message' => 'Updated']);
}
elseif ($method === 'DELETE' && $id) {
    execute("UPDATE model SET Deleted = 1 WHERE Model_ID = ?", 'i', [$id]);
    sendJson(['message' => 'Deleted']);
}
else {
    sendJson(['error' => 'Method not allowed'], 405);
}
?>