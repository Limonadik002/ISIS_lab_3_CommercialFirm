<?php
require_once __DIR__ . '/../../../config.php';
$admin = requireRole(['admin']);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $users = fetchAll("SELECT u.id, u.username, u.email, u.status, r.name as role_name, u.login_count, u.last_login FROM users u JOIN roles r ON u.role_id = r.id ORDER BY u.created_at DESC");
    sendJson($users);
} elseif ($method === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (isset($data['approve']) && isset($data['user_id'])) {
        execute("UPDATE users SET status = 'active', role_id = 2 WHERE id = ? AND status = 'pending'", 'i', [$data['user_id']]);
        sendJson(['message' => 'Пользователь одобрен']);
    }
    if (isset($data['make_operator']) && isset($data['user_id'])) {
        execute("UPDATE users SET status = 'active', role_id = 2 WHERE id = ?", 'i', [$data['user_id']]);
        sendJson(['message' => 'Права оператора выданы']);
    }
    if (isset($data['role']) && isset($data['user_id'])) {
        $roleId = $data['role'] === 'admin' ? 3 : 2;
        execute("UPDATE users SET role_id = ? WHERE id = ?", 'ii', [$roleId, $data['user_id']]);
        sendJson(['message' => 'Роль изменена']);
    }
    if (isset($data['revoke']) && isset($data['user_id'])) {
        execute("UPDATE users SET role_id = 1, status = 'blocked' WHERE id = ? AND role_id = 2", 'i', [$data['user_id']]);
        sendJson(['message' => 'Права оператора отозваны']);
    }
    sendJson(['error' => 'Неверные параметры'], 400);
}
?>