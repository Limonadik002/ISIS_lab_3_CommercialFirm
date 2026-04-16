<?php
require_once __DIR__ . '/../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

if ($method === 'GET' && !$id) {
    $sql = "SELECT mid.*, m.Model_name, d.Deal_ID,
                   CONCAT(c.LastName,' ',c.FirstName) AS ClientName
            FROM modelsindeal mid
            JOIN model m ON mid.Model_ID = m.Model_ID
            JOIN deal d ON mid.Deal_ID = d.Deal_ID
            JOIN client c ON d.Client_ID = c.Client_ID
            WHERE mid.Deleted = 0";
    sendJson(fetchAll($sql));
}
elseif ($method === 'GET' && $id) {
    $data = fetchOne("SELECT * FROM modelsindeal WHERE Position_ID = ? AND Deleted = 0", 'i', [$id]);
    sendJson($data ?: ['error' => 'Not found'], $data ? 200 : 404);
}
// GET options for models
elseif ($method === 'GET' && isset($_GET['options']) && $_GET['options'] === 'models') {
    sendJson(fetchAll("SELECT Model_ID, Model_name FROM model WHERE Deleted = 0"));
}
// GET options for deals
elseif ($method === 'GET' && isset($_GET['options']) && $_GET['options'] === 'deals') {
    $sql = "SELECT d.Deal_ID, CONCAT('Deal #', d.Deal_ID, ' - ', c.LastName, ' ', c.FirstName) AS Description
            FROM deal d
            JOIN client c ON d.Client_ID = c.Client_ID
            WHERE d.Deleted = 0";
    sendJson(fetchAll($sql));
}
elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    validateRequired($data, ['Model_ID', 'Deal_ID']);
    $quantity = $data['Quantity'] ?? 1;
    $res = execute(
        "INSERT INTO modelsindeal (Model_ID, Deal_ID, Quantity) VALUES (?, ?, ?)",
        'iii',
        [$data['Model_ID'], $data['Deal_ID'], $quantity]
    );
    sendJson(['id' => $res['insert_id'], 'message' => 'Created']);
}
elseif ($method === 'PUT' && $id) {
    $data = json_decode(file_get_contents('php://input'), true);
    $quantity = $data['Quantity'] ?? 1;
    execute(
        "UPDATE modelsindeal SET Model_ID=?, Deal_ID=?, Quantity=? WHERE Position_ID=?",
        'iiii',
        [$data['Model_ID'], $data['Deal_ID'], $quantity, $id]
    );
    sendJson(['message' => 'Updated']);
}
elseif ($method === 'DELETE' && $id) {
    execute("UPDATE modelsindeal SET Deleted = 1 WHERE Position_ID = ?", 'i', [$id]);
    sendJson(['message' => 'Deleted']);
}
else {
    sendJson(['error' => 'Method not allowed'], 405);
}
?>