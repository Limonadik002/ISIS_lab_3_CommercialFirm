<?php
require_once __DIR__ . '/../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

if ($method === 'GET' && !$id) {
    $sql = "SELECT d.*, CONCAT(c.LastName,' ',c.FirstName) as ClientName, CONCAT(e.LastName,' ',e.FirstName) as EmployeeName 
            FROM deal d 
            JOIN client c ON d.Client_ID = c.Client_ID 
            JOIN employees e ON d.Employee_ID = e.Employee_ID 
            WHERE d.Deleted = 0";
    sendJson(fetchAll($sql));
} elseif ($method === 'GET' && $id) {
    $data = fetchOne("SELECT * FROM deal WHERE Deal_ID = ? AND Deleted = 0", 'i', [$id]);
    sendJson($data ?: ['error' => 'Not found'], $data ? 200 : 404);
} elseif ($method === 'GET' && isset($_GET['options']) && $_GET['options'] === 'clients') {
    sendJson(fetchAll("SELECT Client_ID, CONCAT(LastName,' ',FirstName) as Name FROM client WHERE Deleted = 0"));
} elseif ($method === 'GET' && isset($_GET['options']) && $_GET['options'] === 'employees') {
    sendJson(fetchAll("SELECT Employee_ID, CONCAT(LastName,' ',FirstName) as Name FROM employees WHERE Deleted = 0"));
} elseif ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    validateRequired($data, ['Client_ID', 'Employee_ID', 'OrderDate']);
    $orderStatus = $data['OrderStatus'] ?? 1;
    $res = execute(
        "INSERT INTO deal (Client_ID, Employee_ID, OrderStatus, OrderDate) VALUES (?,?,?,?)",
        'iiis',
        [$data['Client_ID'], $data['Employee_ID'], $orderStatus, $data['OrderDate']]
    );
    sendJson(['id' => $res['insert_id'], 'message' => 'Created']);
} elseif ($method === 'PUT' && $id) {
    $data = json_decode(file_get_contents('php://input'), true);
    execute(
        "UPDATE deal SET Client_ID=?, Employee_ID=?, OrderStatus=?, OrderDate=? WHERE Deal_ID=?",
        'iiisi',
        [$data['Client_ID'], $data['Employee_ID'], $data['OrderStatus'], $data['OrderDate'], $id]
    );
    sendJson(['message' => 'Updated']);
} elseif ($method === 'DELETE' && $id) {
    execute("UPDATE deal SET Deleted = 1 WHERE Deal_ID = ?", 'i', [$id]);
    sendJson(['message' => 'Deleted']);
} else sendJson(['error' => 'Method not allowed'], 405);
?>