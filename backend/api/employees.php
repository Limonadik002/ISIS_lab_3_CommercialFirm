<?php
require_once __DIR__ . '/../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

if ($method === 'GET' && !$id) {
    sendJson(fetchAll("SELECT * FROM employees WHERE Deleted = 0"));
} elseif ($method === 'GET' && $id) {
    $data = fetchOne("SELECT * FROM employees WHERE Employee_ID = ? AND Deleted = 0", 'i', [$id]);
    sendJson($data ?: ['error' => 'Not found'], $data ? 200 : 404);
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    validateRequired($data, ['LastName', 'FirstName', 'Phone']);
    $res = execute(
        "INSERT INTO employees (LastName, FirstName, MiddleName, Phone) VALUES (?,?,?,?)",
        'ssss',
        [$data['LastName'], $data['FirstName'], $data['MiddleName'] ?? null, $data['Phone']]
    );
    sendJson(['id' => $res['insert_id'], 'message' => 'Created']);
} elseif ($method === 'PUT' && $id) {
    $data = json_decode(file_get_contents('php://input'), true);
    execute(
        "UPDATE employees SET LastName=?, FirstName=?, MiddleName=?, Phone=? WHERE Employee_ID=?",
        'ssssi',
        [$data['LastName'], $data['FirstName'], $data['MiddleName'] ?? null, $data['Phone'], $id]
    );
    sendJson(['message' => 'Updated']);
} elseif ($method === 'DELETE' && $id) {
    execute("UPDATE employees SET Deleted = 1 WHERE Employee_ID = ?", 'i', [$id]);
    sendJson(['message' => 'Deleted']);
} else sendJson(['error' => 'Method not allowed'], 405);
?>