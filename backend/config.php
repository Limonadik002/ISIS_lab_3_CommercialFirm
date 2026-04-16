<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

$envPath = __DIR__ . '/.env';
if (file_exists($envPath)) {
    $env = parse_ini_file($envPath);
    $host = $env['DB_HOST'] ?? 'db';
    $db   = $env['DB_NAME'] ?? 'commercialfirm';
    $user = $env['DB_USER'] ?? 'root';
    $pass = $env['DB_PASS'] ?? 'root';
} 

$conn = mysqli_connect($host, $user, $pass, $db);
if (!$conn) {
    sendJson(['error' => 'DB connect failed: ' . mysqli_connect_error()], 500);
}
mysqli_set_charset($conn, 'utf8mb4');

function sendJson($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function fetchAll($sql) {
    global $conn;
    $result = mysqli_query($conn, $sql);
    if (!$result) {
        sendJson(['error' => 'Query failed: ' . mysqli_error($conn)], 500);
    }
    $rows = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $rows[] = $row;
    }
    return $rows;
}

function fetchAllPrepared($sql, $types, $params) {
    global $conn;
    $stmt = mysqli_prepare($conn, $sql);
    if (!$stmt) {
        sendJson(['error' => 'Prepare failed: ' . mysqli_error($conn)], 500);
    }
    if (!empty($params)) {
        mysqli_stmt_bind_param($stmt, $types, ...$params);
    }
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $rows = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $rows[] = $row;
    }
    mysqli_stmt_close($stmt);
    return $rows;
}

function fetchOne($sql, $types, $params) {
    global $conn;
    $stmt = mysqli_prepare($conn, $sql);
    if (!$stmt) {
        sendJson(['error' => 'Prepare failed: ' . mysqli_error($conn)], 500);
    }
    if (!empty($params)) {
        mysqli_stmt_bind_param($stmt, $types, ...$params);
    }
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $row = mysqli_fetch_assoc($result);
    mysqli_stmt_close($stmt);
    return $row;
}

function execute($sql, $types, $params) {
    global $conn;
    $stmt = mysqli_prepare($conn, $sql);
    if (!$stmt) {
        sendJson(['error' => 'Prepare failed: ' . mysqli_error($conn)], 500);
    }
    if (!empty($params)) {
        mysqli_stmt_bind_param($stmt, $types, ...$params);
    }
    $success = mysqli_stmt_execute($stmt);
    $affected = mysqli_stmt_affected_rows($stmt);
    $insertId = mysqli_stmt_insert_id($stmt);
    mysqli_stmt_close($stmt);
    
    if (!$success) {
        sendJson(['error' => 'Execute failed: ' . mysqli_error($conn)], 500);
    }
    return ['affected' => $affected, 'insert_id' => $insertId];
}

function validateRequired($data, $fields) {
    $missing = [];
    foreach ($fields as $field) {
        if (empty($data[$field])) {
            $missing[] = $field;
        }
    }
    if (!empty($missing)) {
        sendJson(['error' => 'Missing required fields: ' . implode(', ', $missing)], 400);
    }
}
?>