<?php
require_once __DIR__ . '/../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

if ($method === 'GET' && !$id) {
    sendJson(fetchAll("SELECT * FROM client WHERE Deleted = 0"));
} elseif ($method === 'GET' && $id) {
    $data = fetchOne("SELECT * FROM client WHERE Client_ID = ? AND Deleted = 0", 'i', [$id]);
    sendJson($data ?: ['error' => 'Not found'], $data ? 200 : 404);
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    validateRequired($data, ['LastName', 'FirstName', 'Phone']);
    validateName($data['LastName'], 'Фамилия', true, 50);
    validateName($data['FirstName'], 'Имя', true, 50);
    validateName($data['MiddleName'] ?? '', 'Отчество', false, 50);
    validatePhone($data['Phone']);
    if (!empty($data['Email'])) validateEmail($data['Email']);
    $res = execute(
        "INSERT INTO client (LastName, FirstName, MiddleName, Phone, Email) VALUES (?,?,?,?,?)",
        'sssss',
        [$data['LastName'], $data['FirstName'], $data['MiddleName'] ?? null, $data['Phone'], $data['Email'] ?? null]
    );
    sendJson(['id' => $res['insert_id'], 'message' => 'Created']);
} elseif ($method === 'PUT' && $id) {
    $data = json_decode(file_get_contents('php://input'), true);
    validateRequired($data, ['LastName', 'FirstName', 'Phone']);
    validateName($data['LastName'], 'Фамилия', true, 50);
    validateName($data['FirstName'], 'Имя', true, 50);
    validateName($data['MiddleName'] ?? '', 'Отчество', false, 50);
    validatePhone($data['Phone']);
    if (!empty($data['Email'])) validateEmail($data['Email']);
    execute(
        "UPDATE client SET LastName=?, FirstName=?, MiddleName=?, Phone=?, Email=? WHERE Client_ID=?",
        'sssssi',
        [$data['LastName'], $data['FirstName'], $data['MiddleName'] ?? null, $data['Phone'], $data['Email'] ?? null, $id]
    );
    sendJson(['message' => 'Updated']);
} elseif ($method === 'DELETE' && $id) {
    execute("UPDATE client SET Deleted = 1 WHERE Client_ID = ?", 'i', [$id]);
    sendJson(['message' => 'Deleted']);
} else sendJson(['error' => 'Method not allowed'], 405);
?>