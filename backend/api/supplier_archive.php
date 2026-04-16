<?php
require_once __DIR__ . '/../config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $data = fetchAll("SELECT * FROM supplier_archive ORDER BY Archived_Date DESC");
    sendJson($data);
} else {
    sendJson(['error' => 'Read-only'], 405);
}
?>