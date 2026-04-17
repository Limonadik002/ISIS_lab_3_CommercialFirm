<?php
require_once __DIR__ . '/../config.php';

$method = $_SERVER['REQUEST_METHOD'];
$month = $_GET['month'] ?? null;
$year  = $_GET['year'] ?? null;

if ($method === 'GET' && !$month && !$year) {
    $yearsRes = mysqli_query($conn, "
        SELECT DISTINCT YEAR(OrderDate) as y 
        FROM deal 
        WHERE OrderStatus = 1 
        ORDER BY y DESC
    ");
    $years = [];
    while ($row = mysqli_fetch_assoc($yearsRes)) {
        $years[] = $row['y'];
    }

    $months = [
        ['value' => 1,  'name' => 'Январь'],
        ['value' => 2,  'name' => 'Февраль'],
        ['value' => 3,  'name' => 'Март'],
        ['value' => 4,  'name' => 'Апрель'],
        ['value' => 5,  'name' => 'Май'],
        ['value' => 6,  'name' => 'Июнь'],
        ['value' => 7,  'name' => 'Июль'],
        ['value' => 8,  'name' => 'Август'],
        ['value' => 9,  'name' => 'Сентябрь'],
        ['value' => 10, 'name' => 'Октябрь'],
        ['value' => 11, 'name' => 'Ноябрь'],
        ['value' => 12, 'name' => 'Декабрь']
    ];

    sendJson(['years' => $years, 'months' => $months]);
}
elseif ($method === 'GET' && $month && $year) {
    $sql = "
        SELECT 
            Фирма AS firm,
            Наименование_автомобиля AS Model_name,
            Цена AS Price,
            Предпродажная_подготовка AS prep_cost,
            Транспортная_подготовка AS transport_cost,
            Стоимость AS total_cost
        FROM отчет_о_реализации
        WHERE MONTH(Дата_сделки) = ? AND YEAR(Дата_сделки) = ?
        ORDER BY Фирма, Наименование_автомобиля
    ";

    $stmt = mysqli_prepare($conn, $sql);
    if (!$stmt) {
        sendJson(['error' => 'Ошибка подготовки запроса: ' . mysqli_error($conn)], 500);
    }
    mysqli_stmt_bind_param($stmt, 'ii', $month, $year);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    $rows = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $rows[] = $row;
    }
    mysqli_stmt_close($stmt);

    sendJson($rows);
}
else {
    sendJson(['error' => 'Method not allowed'], 405);
}
?>