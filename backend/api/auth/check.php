<?php
require_once __DIR__ . '/../../config.php';
$user = getCurrentUser();
if ($user) {
    unset($user['password_hash']);
    sendJson(['authenticated' => true, 'user' => $user]);
} else {
    if (isset($_COOKIE['remember_token'])) {
        $token = $_COOKIE['remember_token'];
        $stmt = mysqli_prepare($conn, "SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.remember_token IS NOT NULL");
        mysqli_stmt_execute($stmt);
        $res = mysqli_stmt_get_result($stmt);
        while ($row = mysqli_fetch_assoc($res)) {
            if (password_verify($token, $row['remember_token'])) {
                if (session_status() === PHP_SESSION_NONE) session_start();
                session_regenerate_id(true);
                $_SESSION['user_id'] = $row['id'];
                unset($row['password_hash']);
                sendJson(['authenticated' => true, 'user' => $row]);
            }
        }
    }
    sendJson(['authenticated' => false]);
}
?>