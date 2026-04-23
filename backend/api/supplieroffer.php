<?php
require_once __DIR__ . '/../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

if ($method === 'GET' && !$id && !isset($_GET['options'])) {
    $sql = "SELECT so.*, m.Model_name, s.Name AS SupplierName
            FROM supplieroffer so
            JOIN model m ON so.Model_ID = m.Model_ID
            JOIN suppliers s ON so.Supplier_ID = s.Supplier_ID
            WHERE so.Deleted = 0";
    sendJson(fetchAll($sql));
}
elseif ($method === 'GET' && $id) {
    $data = fetchOne("SELECT * FROM supplieroffer WHERE Offer_ID = ? AND Deleted = 0", 'i', [$id]);
    sendJson($data ?: ['error' => 'Not found'], $data ? 200 : 404);
}
elseif ($method === 'GET' && isset($_GET['options']) && $_GET['options'] === 'models') {
    sendJson(fetchAll("SELECT Model_ID, Model_name FROM model WHERE Deleted = 0"));
}
elseif ($method === 'GET' && isset($_GET['options']) && $_GET['options'] === 'suppliers') {
    $sql = "SELECT Supplier_ID, Name AS Description FROM suppliers WHERE Deleted = 0";
    sendJson(fetchAll($sql));
}
elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    validateRequired($data, ['Model_ID', 'Supplier_ID']);
    validateInt($data['Model_ID'], 'Model_ID', 1);
    validateInt($data['Supplier_ID'], 'Supplier_ID', 1);
    validateForeignKey('model', 'Model_ID', $data['Model_ID'], 'Model_ID');
    validateForeignKey('suppliers', 'Supplier_ID', $data['Supplier_ID'], 'Supplier_ID');
    $res = execute(
        "INSERT INTO supplieroffer (Model_ID, Supplier_ID) VALUES (?, ?)",
        'ii',
        [$data['Model_ID'], $data['Supplier_ID']]
    );
    sendJson(['id' => $res['insert_id'], 'message' => 'Created']);
}
elseif ($method === 'PUT' && $id) {
    $data = json_decode(file_get_contents('php://input'), true);
    validateRequired($data, ['Model_ID', 'Supplier_ID']);
    validateInt($data['Model_ID'], 'Model_ID', 1);
    validateInt($data['Supplier_ID'], 'Supplier_ID', 1);
    validateForeignKey('model', 'Model_ID', $data['Model_ID'], 'Model_ID');
    validateForeignKey('suppliers', 'Supplier_ID', $data['Supplier_ID'], 'Supplier_ID');
    execute(
        "UPDATE supplieroffer SET Model_ID=?, Supplier_ID=? WHERE Offer_ID=?",
        'iii',
        [$data['Model_ID'], $data['Supplier_ID'], $id]
    );
    sendJson(['message' => 'Updated']);
}
elseif ($method === 'DELETE' && $id) {
    execute("UPDATE supplieroffer SET Deleted = 1 WHERE Offer_ID = ?", 'i', [$id]);
    sendJson(['message' => 'Deleted']);
}
else {
    sendJson(['error' => 'Method not allowed'], 405);
}
?>