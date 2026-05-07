<?php
require_once __DIR__ . '/../../config.php';

$data = json_decode(file_get_contents('php://input'), true);
validateRequired($data, ['login', 'password']);
$login = $data['login'];
$password = $data['password'];
global $conn;
$user = fetchOne("SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = ? OR u.username = ?", 'ss', [$login, $login]);
if (!$user || !password_verify($password, $user['password_hash'])) {
    sendJson(['error' => 'Неверный логин/email или пароль'], 401);
}
if ($user['status'] !== 'active') {
    sendJson(['error' => 'Ваша учётная запись ещё не активирована администратором'], 403);
}
$now = date('Y-m-d H:i:s');
$newCount = $user['login_count'] + 1;
execute("UPDATE users SET last_login = ?, login_count = ? WHERE id = ?", 'sii', [$now, $newCount, $user['id']]);

if (session_status() === PHP_SESSION_NONE) session_start();
session_regenerate_id(true);
$_SESSION['user_id'] = $user['id'];

$isFirstLogin = ($user['login_count'] == 0);
if (isset($data['remember_me']) && $data['remember_me'] === true) {
    $token = bin2hex(random_bytes(32));
    $hashedToken = password_hash($token, PASSWORD_DEFAULT);
    execute("UPDATE users SET remember_token = ? WHERE id = ?", 'si', [$hashedToken, $user['id']]);
    setcookie('remember_token', $token, time() + 86400 * 30, '/', '', false, true);
}
sendJson([
    'message' => 'Вход выполнен',
    'user' => [
        'id' => $user['id'],
        'username' => $user['username'],
        'role_name' => $user['role_name'],
        'login_count' => $newCount,
        'last_login' => $now,
        'is_first_login' => $isFirstLogin
    ]
]);
?>