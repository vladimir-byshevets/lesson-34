<?php

//$url = 'https://api.blockcypher.com/v1/bcy/test3/addrs';
$url = 'https://api.blockcypher.com/v1/btc/test3/addrs';

$options = [
    'http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/json\r\n",
        'ignore_errors' => true // Для обработки ошибок HTTP
    ]
];

$context = stream_context_create($options);
$response = file_get_contents($url, false, $context);

if ($response === false) {
    // Обработка ошибок при запросе
    $error = error_get_last();
    echo "Ошибка при запросе: " . $error['message'];
} else {
    // Обработка успешного ответа
    $data = json_decode($response, true);
    echo '<pre>';
    print_r($data);
    echo '</pre>';
}
