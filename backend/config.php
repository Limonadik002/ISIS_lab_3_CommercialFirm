<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

$host = 'db';
$user = 'root';
$pass = 'root';
$db   = 'commercialfirm';

$conn = mysqli_connect($host, $user, $pass, $db);
if (!$conn) {
    sendJson(['error' => 'Ошибка подключения к базе данных: ' . mysqli_connect_error()], 500);
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
    if (!$result) sendJson(['error' => 'Ошибка запроса: ' . mysqli_error($conn)], 500);
    $rows = [];
    while ($row = mysqli_fetch_assoc($result)) $rows[] = $row;
    return $rows;
}

function fetchOne($sql, $types, $params) {
    global $conn;
    $stmt = mysqli_prepare($conn, $sql);
    if (!$stmt) sendJson(['error' => 'Ошибка подготовки запроса: ' . mysqli_error($conn)], 500);
    if ($params) mysqli_stmt_bind_param($stmt, $types, ...$params);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $row = mysqli_fetch_assoc($result);
    mysqli_stmt_close($stmt);
    return $row;
}

function execute($sql, $types, $params) {
    global $conn;
    try {
        $stmt = mysqli_prepare($conn, $sql);
        if (!$stmt) sendJson(['error' => 'Ошибка подготовки запроса: ' . mysqli_error($conn)], 500);
        if ($params) mysqli_stmt_bind_param($stmt, $types, ...$params);
        $success = mysqli_stmt_execute($stmt);
        $affected = mysqli_stmt_affected_rows($stmt);
        $insertId = mysqli_stmt_insert_id($stmt);
        $error = mysqli_stmt_error($stmt);
        mysqli_stmt_close($stmt);
        if (!$success) {
            $rusError = translateMySQLError($error);
            sendJson(['error' => $rusError], 400);
        }
        return ['affected' => $affected, 'insert_id' => $insertId];
    } catch (mysqli_sql_exception $e) {
        $rusError = translateMySQLError($e->getMessage());
        sendJson(['error' => $rusError], 400);
    }
}

function translateMySQLError($error) {
    if (strpos($error, 'Duplicate entry') !== false && strpos($error, 'Phone') !== false) {
        return 'Ошибка: Пользователь с таким номером телефона уже существует. Введите другой номер.';
    }
    if (strpos($error, 'Duplicate entry') !== false && strpos($error, 'Email') !== false) {
        return 'Ошибка: Пользователь с таким email уже существует. Введите другой email.';
    }
    if (strpos($error, 'Duplicate entry') !== false && strpos($error, 'Name') !== false) {
        return 'Ошибка: Поставщик с таким названием уже существует.';
    }
    if (strpos($error, 'Duplicate entry') !== false && strpos($error, 'PRIMARY') !== false) {
        return 'Ошибка: Запись с таким ID уже существует.';
    }
    if (strpos($error, 'foreign key constraint') !== false) {
        return 'Ошибка: Невозможно удалить запись, так как на неё ссылаются другие таблицы.';
    }
    if (strpos($error, 'cannot be null') !== false) {
        return 'Ошибка: Обязательное поле не может быть пустым.';
    }
    return 'Ошибка базы данных: ' . $error;
}

function validateRequired($data, $fields) {
    $missing = [];
    foreach ($fields as $field) {
        if (!isset($data[$field]) || $data[$field] === '') $missing[] = $field;
    }
    if ($missing) sendJson(['error' => 'Не заполнены обязательные поля: ' . implode(', ', $missing)], 400);
}

function validateNotEmpty($value, $fieldName) {
    if (empty($value) && $value !== '0') {
        sendJson(['error' => "Поле '$fieldName' обязательно для заполнения"], 400);
    }
}

function validateInt($value, $fieldName, $min = null) {
    if (!is_numeric($value) || $value != (int)$value) {
        sendJson(['error' => "Поле '$fieldName' должно быть целым числом"], 400);
    }
    $intVal = (int)$value;
    if ($min !== null && $intVal < $min) {
        sendJson(['error' => "Поле '$fieldName' не может быть меньше $min"], 400);
    }
}

function validateFloat($value, $fieldName, $min = 0) {
    if (!is_numeric($value)) {
        sendJson(['error' => "Поле '$fieldName' должно быть числом"], 400);
    }
    $floatVal = (float)$value;
    if ($floatVal < $min) {
        sendJson(['error' => "Поле '$fieldName' не может быть меньше $min"], 400);
    }
}

function validateStringLength($value, $fieldName, $maxLength, $minLength = 0) {
    $len = mb_strlen($value, 'UTF-8');
    if ($len < $minLength) {
        sendJson(['error' => "Поле '$fieldName' должно содержать не менее $minLength символов"], 400);
    }
    if ($len > $maxLength) {
        sendJson(['error' => "Поле '$fieldName' не может быть длиннее $maxLength символов"], 400);
    }
}

function validatePhone($phone) {
    if (!preg_match('/^[\d+\-\(\)\s]+$/', $phone)) {
        sendJson(['error' => 'Некорректный формат телефона. Используйте только цифры, пробелы и символы +, -, (, )'], 400);
    }
}

function validateEmail($email) {
    if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendJson(['error' => 'Некорректный формат email. Пример: name@domain.ru'], 400);
    }
}

function validateDate($date) {
    $d = DateTime::createFromFormat('Y-m-d', $date);
    if (!$d || $d->format('Y-m-d') !== $date) {
        sendJson(['error' => 'Некорректная дата. Используйте формат ГГГГ-ММ-ДД'], 400);
    }
}

function validateForeignKey($table, $field, $value, $fieldName) {
    global $conn;
    $stmt = mysqli_prepare($conn, "SELECT 1 FROM $table WHERE $field = ?");
    mysqli_stmt_bind_param($stmt, 'i', $value);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    if (mysqli_num_rows($result) == 0) {
        $tableName = getRussianTableName($table);
        sendJson(['error' => "Значение '$value' для поля '$fieldName' не найдено в таблице '$tableName'"], 400);
    }
}

function getRussianTableName($table) {
    $names = [
        'client' => 'клиенты',
        'employees' => 'сотрудники',
        'suppliers' => 'поставщики',
        'model' => 'модели авто',
        'pricelist' => 'прайс-лист',
        'deal' => 'сделки',
        'supplieroffer' => 'предложения поставщиков',
        'modelsindeal' => 'позиции в сделках'
    ];
    return $names[$table] ?? $table;
}

function validateName($value, $fieldName, $required = true, $maxLength = 50) {
    if ($required && empty($value)) {
        sendJson(['error' => "Поле '$fieldName' обязательно для заполнения"], 400);
    }
    if (!empty($value)) {
        if (mb_strlen($value, 'UTF-8') > $maxLength) {
            sendJson(['error' => "Поле '$fieldName' не может быть длиннее $maxLength символов"], 400);
        }
        if (!preg_match('/^[\p{L}\s\-]+$/u', $value)) {
            sendJson(['error' => "Поле '$fieldName' может содержать только буквы, пробелы и дефисы"], 400);
        }
    }
}
?>