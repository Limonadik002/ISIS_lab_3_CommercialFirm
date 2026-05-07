<?php
require_once __DIR__ . '/../../config.php';
if (session_status() === PHP_SESSION_NONE) session_start();
setcookie('remember_token', '', time() - 3600, '/');
$_SESSION = [];
session_destroy();
sendJson(['message' => 'Вы вышли из системы']);
?>