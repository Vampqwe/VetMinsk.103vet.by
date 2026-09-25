/**
 * vetminsk.103vet.by — Система аналитики
 * Google Analytics 4 + Яндекс.Метрика
 * Отслеживание ключевых событий для ветеринарного сайта
 */

(function() {
  'use strict';

  // ============================================
  // КОНФИГУРАЦИЯ — ЗАМЕНИТЕ НА СВОИ ID
  // ============================================
  const CONFIG = {
    GA_ID: 'G-2GZ8SXWYNT',           // ← Замените на ваш ID Google Analytics
    YM_ID: '112350676',                // ← Замените на ваш ID Яндекс.Метрики
    SITE_NAME: 'vetminsk.103vet.by',
    ENABLE_DEBUG: false               // Включить для отладки (console.log событий)
  };

  // ============================================
  // ИНИЦИАЛИЗАЦИЯ GOOGLE ANALYTICS 4
  // ============================================
  function initGA4() {
    if (!CONFIG.GA_ID || CONFIG.GA_ID === 'G-2GZ8SXWYNT') {
      console.warn('⚠️ Google Analytics: ID не настроен. Замените G-2GZ8SXWYNT на ваш ID.');
      return;
    }

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', CONFIG.GA_ID, {
      page_title: document.title,
      page_location: window.location.href,
      custom_map: {
        'custom_parameter_1': 'page_type',
        'custom_parameter_2': 'animal_type'
      }
    });

    // Загрузка скрипта GA
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-2GZ8SXWYNT' + CONFIG.GA_ID;
    document.head.appendChild(script);

    log('✅ Google Analytics 4 инициализирован:', CONFIG.GA_ID);
  }

  // ============================================
  // ИНИЦИАЛИЗАЦИЯ ЯНДЕКС.МЕТРИКИ
  // ============================================
  function initYandexMetrika() {
    if (!CONFIG.YM_ID || CONFIG.YM_ID === '112350676') {
      console.warn('⚠️ Яндекс.Метрика: ID не настроен. Замените 00000000 на ваш ID.');
      return;
    }

    (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
    (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

    ym(CONFIG.YM_ID, "init", {
      clickmap:true,
      trackLinks:true,
      accurateTrackBounce:true,
      webvisor:true
    });

    log('✅ Яндекс.Метрика инициализирована:', CONFIG.YM_ID);
  }

  // ============================================
  // УТИЛИТЫ
  // ============================================
  function log() {
    if (CONFIG.ENABLE_DEBUG) {
      console.log.apply(console, ['📊 Analytics:'].concat(Array.from(arguments)));
    }
  }

  function getPageType() {
    var path = window.location.pathname;
    if (path === '/' || path === '/index.php' || path === '/index.html') return 'home';
    if (path.indexOf('кейс') > -1 || path.indexOf('case') > -1 || document.querySelector('.patient-card')) return 'case';
    if (path.indexOf('симптом') > -1 || path.indexOf('symptom') > -1) return 'symptom';
    if (path.indexOf('телемедицин') > -1) return 'telemedicine';
    if (path.indexOf('о-центре') > -1 || path.indexOf('about') > -1) return 'about';
    if (path.indexOf('faq') > -1 || path.indexOf('вопрос') > -1) return 'faq';
    if (path.indexOf('диагност') > -1) return 'diagnostics';
    if (path.indexOf('сахарный-диабет') > -1) return 'disease_hub';
    return 'other';
  }

  function getAnimalType() {
    var text = document.body.innerText.toLowerCase();
    var dogKeywords = ['собак', 'пес', 'пёс', 'щенок', 'сука', 'кобель', 'labrador', 'york', 'shepherd', 'doberman', 'bulldog', 'cavalier', 'sharpei'];
    var catKeywords = ['кош', 'кот', 'котов', 'котён', 'кошк', 'персидск', 'британск', 'мейн-кун', 'абиссинск', 'cat'];

    var hasDogs = dogKeywords.some(function(k) { return text.indexOf(k) > -1; });
    var hasCats = catKeywords.some(function(k) { return text.indexOf(k) > -1; });

    if (hasDogs && hasCats) return 'both';
    if (hasDogs) return 'dogs';
    if (hasCats) return 'cats';
    return 'unknown';
  }

  function sendEvent(eventName, params) {
    params = params || {};
    params.page_type = getPageType();
    params.animal_type = getAnimalType();
    params.timestamp = new Date().toISOString();

    // Google Analytics
    if (window.gtag) {
      gtag('event', eventName, params);
    }

    // Яндекс.Метрика
    if (window.ym && CONFIG.YM_ID !== '112350676') {
      ym(CONFIG.YM_ID, 'reachGoal', eventName, params);
    }

    log('📤 Событие:', eventName, params);
  }

  // ============================================
  // ОТСЛЕЖИВАНИЕ СОБЫТИЙ
  // ============================================

  /**
   * 1. Просмотр страницы
   */
  function trackPageView() {
    sendEvent('page_view', {
      page_title: document.title,
      page_url: window.location.href,
      referrer: document.referrer
    });
  }

  /**
   * 2. Клики по CTA-кнопкам (Записаться к терапевту)
   */
  function trackCTAClicks() {
    // Все кнопки с классом .btn и .btn-primary
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('.btn, .btn-primary, .btn-light');
      if (!btn) return;

      var btnText = btn.textContent.trim().substring(0, 50);
      var href = btn.getAttribute('href') || '';
      var section = btn.closest('section, .cta');
      var sectionLabel = section ? (section.querySelector('.section-label, h2') || {}).textContent : '';

      sendEvent('cta_click', {
        button_text: btnText,
        button_href: href,
        section_context: (sectionLabel || '').trim().substring(0, 50),
        cta_type: btnText.toLowerCase().indexOf('экстренн') > -1 ? 'emergency' : 'regular'
      });
    });
  }

  /**
   * 3. Клики по навигации
   */
  function trackNavigation() {
    document.addEventListener('click', function(e) {
      var link = e.target.closest('.nav-inner a, .home-link');
      if (!link) return;

      sendEvent('navigation_click', {
        link_text: link.textContent.trim().substring(0, 50),
        link_href: link.getAttribute('href') || '',
        is_home_link: link.classList.contains('home-link')
      });
    });
  }

  /**
   * 4. Открытие/закрытие FAQ
   */
  function trackFAQ() {
    document.addEventListener('click', function(e) {
      var question = e.target.closest('.faq-q, .faq-question');
      if (!question) return;

      var faqItem = question.closest('.faq-item');
      var isOpen = faqItem.classList.contains('open') || faqItem.classList.contains('active');
      var questionText = question.textContent.trim().substring(0, 100);

      sendEvent('faq_toggle', {
        question_text: questionText,
        action: isOpen ? 'close' : 'open'
      });
    });
  }

  /**
   * 5. Просмотр карточки кейса (пациента)
   */
  function trackCaseViews() {
    var patientCard = document.querySelector('.patient-card');
    if (!patientCard) return;

    var caseName = (patientCard.querySelector('h4') || {}).textContent || 'Неизвестный кейс';
    var breed = '';
    var age = '';
    var weight = '';

    patientCard.querySelectorAll('.patient-info-item').forEach(function(item) {
      var label = (item.querySelector('.patient-info-label') || {}).textContent || '';
      var value = (item.querySelector('.patient-info-value') || {}).textContent || '';
      if (label.toLowerCase().indexOf('пород') > -1) breed = value.trim();
      if (label.toLowerCase().indexOf('возраст') > -1) age = value.trim();
      if (label.toLowerCase().indexOf('вес') > -1) weight = value.trim();
    });

    // Отправляем при загрузке страницы кейса
    setTimeout(function() {
      sendEvent('case_view', {
        case_name: caseName.trim(),
        breed: breed,
        age: age,
        weight: weight,
        page_title: document.title
      });
    }, 1000);
  }

  /**
   * 6. Прокрутка страницы (глубина скролла)
   */
  function trackScrollDepth() {
    var maxScroll = 0;
    var sentMilestones = {};

    function checkScroll() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var scrollPercent = Math.round((scrollTop / docHeight) * 100);

      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;

        // Отправляем событие на milestone 25%, 50%, 75%, 100%
        [25, 50, 75, 100].forEach(function(milestone) {
          if (scrollPercent >= milestone && !sentMilestones[milestone]) {
            sentMilestones[milestone] = true;
            sendEvent('scroll_depth', {
              percent: milestone,
              page_url: window.location.href
            });
          }
        });
      }
    }

    window.addEventListener('scroll', checkScroll, { passive: true });
  }

  /**
   * 7. Время на странице
   */
  function trackTimeOnPage() {
    var startTime = Date.now();
    var sentTimeEvents = {};

    setInterval(function() {
      var secondsOnPage = Math.round((Date.now() - startTime) / 1000);

      [30, 60, 120, 300].forEach(function(seconds) {
        if (secondsOnPage >= seconds && !sentTimeEvents[seconds]) {
          sentTimeEvents[seconds] = true;
          sendEvent('time_on_page', {
            seconds: seconds,
            page_url: window.location.href
          });
        }
      });
    }, 5000);
  }

  /**
   * 8. Выбор города (для телемедицины)
   */
  function trackCitySelection() {
    document.addEventListener('click', function(e) {
      var city = e.target.closest('.city');
      if (!city) return;

      var cityName = (city.querySelector('h4') || {}).textContent || 'Неизвестный город';
      var isMain = city.classList.contains('city-main');

      sendEvent('city_select', {
        city_name: cityName.trim(),
        is_main_city: isMain,
        service_type: isMain ? 'offline+online' : 'online_only'
      });
    });
  }

  /**
   * 9. Клики по связанным заболеваниям
   */
  function trackRelatedDiseases() {
    document.addEventListener('click', function(e) {
      var card = e.target.closest('.related-card');
      if (!card) return;

      var diseaseName = (card.querySelector('h4') || {}).textContent || 'Неизвестное заболевание';
      var description = (card.querySelector('p') || {}).textContent || '';

      sendEvent('related_disease_click', {
        disease_name: diseaseName.trim(),
        description: description.trim().substring(0, 100)
      });
    });
  }

  /**
   * 10. Клики по симптомам (для страницы симптомов)
   */
  function trackSymptomNavigation() {
    document.addEventListener('click', function(e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;

      var href = link.getAttribute('href');
      if (href.indexOf('#polidipsiya') > -1 || href.indexOf('#poterya') > -1 ||
          href.indexOf('#zheltuha') > -1 || href.indexOf('#otyoki') > -1 ||
          href.indexOf('#rvota') > -1 || href.indexOf('#diareya') > -1) {

        sendEvent('symptom_navigate', {
          symptom_anchor: href,
          link_text: link.textContent.trim()
        });
      }
    });
  }

  /**
   * 11. Внешние ссылки (103vet.by и др.)
   */
  function trackExternalLinks() {
    document.addEventListener('click', function(e) {
      var link = e.target.closest('a[href]');
      if (!link) return;

      var href = link.getAttribute('href');
      if (!href) return;

      // Внешние ссылки (не на наш домен)
      if (href.indexOf('http') === 0 && href.indexOf('vetminsk') === -1 &&
          href.indexOf('103vet.by') === -1 && href.indexOf(window.location.hostname) === -1) {
        sendEvent('external_link_click', {
          link_url: href,
          link_text: link.textContent.trim().substring(0, 50)
        });
      }

      // Ссылки на 103vet.by (партнёрский сайт)
      if (href.indexOf('103vet.by') > -1) {
        sendEvent('partner_link_click', {
          link_url: href,
          link_text: link.textContent.trim().substring(0, 50)
        });
      }
    });
  }

  /**
   * 12. Поиск по странице (если есть)
   */
  function trackSearch() {
    var searchInputs = document.querySelectorAll('input[type="search"], input[name="search"]');
    searchInputs.forEach(function(input) {
      input.addEventListener('change', function() {
        sendEvent('search', {
          search_term: input.value.trim()
        });
      });
    });
  }

  // ============================================
  // ИНИЦИАЛИЗАЦИЯ
  // ============================================
  function init() {
    // Инициализация систем аналитики
    initGA4();
    initYandexMetrika();

    // Отправка page_view
    trackPageView();

    // Подключение отслеживания событий
    trackCTAClicks();
    trackNavigation();
    trackFAQ();
    trackCaseViews();
    trackScrollDepth();
    trackTimeOnPage();
    trackCitySelection();
    trackRelatedDiseases();
    trackSymptomNavigation();
    trackExternalLinks();
    trackSearch();

    log('🚀 Система аналитики полностью загружена');
    log('📄 Тип страницы:', getPageType());
    log('🐾 Тип животных:', getAnimalType());
  }

  // Запуск после загрузки DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();