<?php
/**
 * Конфигурация аналитики для vetminsk.103vet.by
 * Измените ID здесь — они применятся ко всем страницам
 */

return [
    'analytics' => [
        'ga_id' => 'G-2GZ8SXWYNT',        // ← Google Analytics 4 ID
        'ym_id' => '112350676',             // ← Яндекс.Метрика ID
        'enable_debug' => false,           // Включить отладку (true на dev, false на prod)
        'site_name' => 'vetminsk.103vet.by'
    ],
    
    // Дополнительные настройки
    'tracking' => [
        'track_scroll' => true,
        'track_time' => true,
        'track_faq' => true,
        'track_cases' => true,
        'track_cta' => true,
        'track_navigation' => true
    ]
];