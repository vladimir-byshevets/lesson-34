<?php

$data = [
    'address' => 'CGPnx3VyMPNQSwjg4ZW5qQtTfN4YvgihCT',
    'amount' => 100000000
];

$apiToken = '0e1a7d195d3845f7ac551d4acc101c7b';
$url = 'https://api.blockcypher.com/v1/bcy/test/faucet?token=' . $apiToken;

$dataJson = json_encode($data);

$ch = curl_init($url);
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $dataJson,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Content-Length: ' . strlen($dataJson)
    ],
    CURLOPT_RETURNTRANSFER => true
]);

$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);

if ($result !== null) {
    echo 'Тестовые монеты отправлены: ' . print_r($result, true);
} else {
    echo 'Ошибка при запросе монет через кран.';
}
