<?php
require_once __DIR__ . '/../../config.php';

$data = json_decode(file_get_contents('php://input'), true);
validateRequired($data, ['username', 'email', 'password']);

$username = $data['username'];
if (!preg_match('/^[\p{L}0-9_\-]{3,50}$/u', $username)) {
    sendJson(['error' => 'Логин должен содержать только буквы, цифры, дефис или подчёркивание'], 400);
}

validateEmail($data['email']);
if (strlen($data['password']) < 6) {
    sendJson(['error' => 'Пароль должен быть не менее 6 символов'], 400);
}

global $conn;
$check = fetchOne("SELECT id FROM users WHERE email = ? OR username = ?", 'ss', [$data['email'], $username]);
if ($check) {
    sendJson(['error' => 'Пользователь с таким email или логином уже существует'], 400);
}
$hash = password_hash($data['password'], PASSWORD_DEFAULT);
execute(
    "INSERT INTO users (username, email, password_hash, role_id, status) VALUES (?, ?, ?, 2, 'pending')",
    'sss',
    [$username, $data['email'], $hash]
);
sendJson(['message' => 'Регистрация успешна. Ожидайте подтверждения администратором.']);
?>