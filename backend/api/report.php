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
    firm,
    Model_name,
    Price,
    prep_cost,
    transport_cost,
    total_cost
FROM (
    SELECT DISTINCT 
        s.Name AS firm,
        m.Model_name AS Model_name,
        pl.Price AS Price,
        ROUND(pl.Price * 0.03, 2) AS prep_cost,
        ROUND(pl.Price * 0.05, 2) AS transport_cost,
        ROUND(pl.Price * 1.08, 2) AS total_cost,
        d.OrderDate AS deal_date
    FROM suppliers s
    JOIN supplieroffer so ON s.Supplier_ID = so.Supplier_ID
    JOIN model m ON so.Model_ID = m.Model_ID
    JOIN pricelist pl ON m.PriceList_ID = pl.PriceList_ID
    JOIN modelsindeal mid ON so.Model_ID = mid.Model_ID
    JOIN deal d ON mid.Deal_ID = d.Deal_ID
    WHERE d.OrderStatus = 1
) AS report
WHERE MONTH(deal_date) = ? AND YEAR(deal_date) = ?
ORDER BY firm, Model_name;
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