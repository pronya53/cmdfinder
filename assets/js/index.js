console.log('Starting map initialization...');

let currentLang = 'uk';
let pointLayer; // Слой для маркеров точек
let signalLinesLayer; // Слой для линий связи
let kshmMarker = null; // Маркер КШМ
let kshmIcon; // Иконка КШМ
// --- НОВЫЕ СЛОИ ДЛЯ ПОИСКА ---
let searchCirclesLayer;
let searchResultLayer;

let currentMapPoints = []; // Тут будет храниться состояние точек (захвачено/нет)
let currentMode = 'none'; // 'none', 'points', 'kshm', 'search'
// --- НОВЫЕ ПЕРЕМЕННЫЕ ДЛЯ ПОИСКА ---
let searchTargetPoints = []; // Цели (атакуемые точки)
const searchEnemyIds = new Set(); // id точек, которые держит враг (используется только в режиме поиска)
let searchTool = 'enemy'; // Что делает клик по точке в режиме поиска: 'enemy' | 'mine' | 'target'
const SEARCH_SCAN_STEP = 10; // Шаг построчного расчёта зоны КШМ (в метрах)

// --- ОБНОВЛЕННЫЕ КОНСТАНТЫ ---
const KSHM_RANGE = 1500; // 1.5км (КШМ -> Точка И Поиск)
const POINT_RANGE = 2000; // 2км (Точка -> Точка) --- ИЗМЕНЕНО
const POINT_TO_KSHM_RANGE = 2000; // 2км (Точка -> КШМ)

// --- ОБЪЕКТ СО ВСЕМИ ДАННЫМИ ТОЧЕК (БЕЗ ИМЕН) ---
const mapPointsData = {
    udachne: [
        { "id": 1, "coords": [2685, 7983.25], "status": "neutral" },
        { "id": 2, "coords": [1172, 7524.25], "status": "neutral" },
        { "id": 3, "coords": [2172.25, 6159], "status": "neutral" },
        { "id": 4, "coords": [2073.5, 5069.25], "status": "neutral" },
        { "id": 5, "coords": [1215.75, 2538], "status": "neutral" },
        { "id": 6, "coords": [2214, 1453.25], "status": "neutral" },
        { "id": 7, "coords": [3225.75, 2134], "status": "neutral" },
        { "id": 8, "coords": [3496.5, 5047.5], "status": "neutral" },
        { "id": 9, "coords": [2061.75, 3661], "status": "neutral" },
        { "id": 10, "coords": [1111.5, 5316.75], "status": "neutral" },
        { "id": 11, "coords": [1888, 9002.5], "status": "neutral" }
    ],
    sergeevka: [
        { "id": 1, "coords": [7259, 4150.75], "status": "neutral" },
        { "id": 2, "coords": [7875.5, 1369.75], "status": "neutral" },
        { "id": 3, "coords": [6582.75, 8715.5], "status": "neutral" },
        { "id": 4, "coords": [5421.75, 8143], "status": "neutral" },
        { "id": 5, "coords": [7712.25, 7660.25], "status": "neutral" },
        { "id": 6, "coords": [8253.75, 5065.25], "status": "neutral" },
        { "id": 7, "coords": [8753, 2979.5], "status": "neutral" },
        { "id": 8, "coords": [5252.75, 2995.25], "status": "neutral" },
        { "id": 9, "coords": [6647, 2241.5], "status": "neutral" },
        { "id": 10, "coords": [5121, 4668.25], "status": "neutral" },
        { "id": 11, "coords": [4771.25, 6264.5], "status": "neutral" },
        { "id": 12, "coords": [6969, 6132.5], "status": "neutral" }
    ],
    satellite: []
};
// --- КОНЕЦ ДАННЫХ ---


function changeLanguage() {
    currentLang = document.getElementById('language').value;
    document.title = translations[currentLang].title;
    updateTexts(); // Обновляет весь текст, кроме названий точек
    updateLayerOptions();
    updateLanguageOptions();
    showMenuSection(document.querySelector('.menu-nav-item.active').getAttribute('data-section'));

    // --- ОБНОВЛЕНИЕ НАЗВАНИЙ ТОЧЕК НА КАРТЕ ---
    const mapName = document.getElementById('layer').value;
    if (currentMapPoints.length > 0) {
        // Обновляем имена в текущем состоянии
        currentMapPoints.forEach(p => {
            const pointTranslations = translations[currentLang].pointNames[mapName];
            p.name = pointTranslations ? (pointTranslations[p.id] || `Point ${p.id}`) : `Point ${p.id}`;
        });
        redrawPoints(); // Перерисовываем маркеры с новыми именами
        updateSignalRange(); // Обновляем инфо-панель (где тоже есть имена)
    }
}

// Функции Истории УДАЛЕНЫ

function updateTexts() {
    const t = translations[currentLang];
    document.getElementById('nav-setup').textContent = t.navSetup;
    document.getElementById('setup-title').textContent = t.setupTitle;
    document.getElementById('layer-label').textContent = t.layerLabel;
    document.getElementById('grid-toggle-label').textContent = t.gridToggleLabel;
    document.getElementById('language-label').textContent = t.languageLabel;
    document.getElementById('pc-btn').textContent = t.pcBtn;
    document.getElementById('mobile-btn').textContent = t.mobileBtn;
    document.getElementById('main-menu-btn').title = t.settingsTitle;
    document.getElementById('credits').textContent = t.credits;
    document.getElementById('nav-device').textContent = t.navDevice;
    document.getElementById('nav-info').textContent = t.navInfo;
    document.getElementById('device-title').textContent = t.navDevice;
    document.getElementById('info-title').textContent = t.infoTitle;
    document.getElementById('info-content').innerHTML = t.infoText;
    document.getElementById('theme-label').innerHTML = t.themeLabel;
    document.getElementById('toggleMenuLabel').textContent = t.toggleMenuLabel;
    document.getElementById('toggle-points-mode-btn').title = t.togglePointsModeTitle;
    document.getElementById('toggle-kshm-mode-btn').title = t.toggleKshmModeTitle;
    if (kshmMarker) kshmMarker.bindPopup(translations[currentLang].kshmPopup);
    // Обновляем title для кнопки админа
    const adminBtn = document.getElementById('toggle-search-mode-btn');
    if (adminBtn) adminBtn.title = t.toggleSearchModeTitle;
}

function updateLayerOptions() {
    const t = translations[currentLang];
    const select = document.getElementById('layer');
    select.options[0].text = t.layerOptions.udachne;
    select.options[1].text = t.layerOptions.sergeevka;
    select.options[2].text = t.layerOptions.satellite;
}

function updateThemeOptions() {
    const t = translations[currentLang];
    const select = document.getElementById('theme');
    select.options[0].text = t.themes.darkgreen;
    select.options[1].text = t.themes.lightgreen;
    select.options[2].text = t.themes.darkred;
    select.options[3].text = t.themes.lightred;
}

function updateLanguageOptions() {
    const t = translations[currentLang];
    const select = document.getElementById('language');
    select.options[0].text = t.languageOptions.ru;
    select.options[1].text = t.languageOptions.uk;
    select.options[2].text = t.languageOptions.en;
}

function closeResult() {
    document.getElementById('result-panel').classList.remove('active');
}

if (localStorage.getItem("mortar-calc-theme") != null) {
    document.body.setAttribute('theme', localStorage.getItem("mortar-calc-theme"));
}

document.querySelector("select#theme").addEventListener("change", e => {
    const selectedTheme = e.target.value;
    document.body.setAttribute('theme', selectedTheme);
    localStorage.setItem("mortar-calc-theme", selectedTheme)
})

// Инициализация карты с простой системой координат
let mapWidth = 10240;
let mapHeight = 5120;
let map;
try {
    map = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: -2,
        maxZoom: 2,
        zoom: -1,
        center: [mapHeight / 2, mapWidth / 2],
        maxBounds: [[0, 0], [mapHeight, mapWidth]],
        maxBoundsViscosity: 1.0
    });
    console.log('Map initialized successfully');
    
    // Инициализируем слои
    pointLayer = L.layerGroup().addTo(map);
    signalLinesLayer = L.layerGroup().addTo(map);
    searchCirclesLayer = L.layerGroup().addTo(map);
    searchResultLayer = L.layerGroup().addTo(map);

    // Создаем иконку КШМ
    kshmIcon = L.divIcon({
        className: 'kshm-icon',
        iconSize: [15, 15]
    });

} catch (error) {
    console.error('Error initializing map:', error);
}

// Наложение карты Удачное
const udachneBounds = [[0, 0], [5120, 10240]];
let udachneLayer;
try {
    udachneLayer = L.imageOverlay('./assets/images/udachne.png', udachneBounds).addTo(map);
    console.log('Udachne layer added');
} catch (error) {
    console.error('Error loading udachne layer:', error);
}

// Размеры для остальных карт
const donairBounds = [[0, 0], [4352, 4352]];
const sergeevkaBounds = [[0, 0], [10240, 10240]];

// Карты
let sergeevkaLayer, donAirLayer;
try {
    sergeevkaLayer = L.imageOverlay('./assets/images/sergeevka.png', sergeevkaBounds);
    donAirLayer = L.imageOverlay('./assets/images/DonAirConflict.png', donairBounds);
    console.log('Other layers initialized');
} catch (error) {
    console.error('Error initializing other layers:', error);
}

let currentLayer = udachneLayer;
let gridLayer = L.layerGroup().addTo(map);
let minorGridLayer = L.layerGroup();
let isGridEnabled = true;

// Функция для управления отображением сетки
function toggleGrid() {
    isGridEnabled = document.getElementById('grid-toggle').checked;
    if (isGridEnabled) {
        gridLayer.addTo(map);
        if (map.getZoom() >= 0) minorGridLayer.addTo(map);
    } else {
        map.removeLayer(gridLayer);
        map.removeLayer(minorGridLayer);
    }
    console.log('Grid toggled:', isGridEnabled);
}

// Функция для отрисовки сетки
function drawGrid() {
    gridLayer.clearLayers();
    minorGridLayer.clearLayers();

    if (!isGridEnabled) return;

    const majorStep = 1000; // 1 км
    const minorStep = 100;  // 100 м
    const zoom = map.getZoom();

    // Определяем размеры карты
    let width = mapWidth;
    let height = mapHeight;

    // Основная сетка (1 км)
    for (let x = 0; x <= width; x += majorStep) {
        gridLayer.addLayer(L.polyline([[0, x], [height, x]], { className: 'grid-line' }));
    }
    for (let y = 0; y <= height; y += majorStep) {
        gridLayer.addLayer(L.polyline([[y, 0], [y, width]], { className: 'grid-line' }));
    }

    // Мелкая сетка (100 м), отображается при zoom >= 0
    if (zoom >= 0) {
        minorGridLayer.addTo(map);
        for (let x = 0; x <= width; x += minorStep) {
            if (x % majorStep !== 0) {
                minorGridLayer.addLayer(L.polyline([[0, x], [height, x]], { className: 'grid-line-minor' }));
            }
        }
        for (let y = 0; y <= height; y += minorStep) {
            if (y % majorStep !== 0) {
                minorGridLayer.addLayer(L.polyline([[y, 0], [y, width]], { className: 'grid-line-minor' }));
            }
        }
    } else {
        map.removeLayer(minorGridLayer);
    }
}

// Обновление сетки при зуме
map.on('zoomend', drawGrid);


function changeLayer() {
    // Сбрасываем все
    if (pointLayer) pointLayer.clearLayers();
    if (signalLinesLayer) signalLinesLayer.clearLayers();
    if (kshmMarker) {
        map.removeLayer(kshmMarker);
        kshmMarker = null;
    }
    // Сброс поиска
    if (searchCirclesLayer) searchCirclesLayer.clearLayers();
    if (searchResultLayer) searchResultLayer.clearLayers();
    searchTargetPoints = [];
    searchEnemyIds.clear();

    deactivateModes();
    currentMapPoints = []; // Очищаем массив состояния
    closeResult(); // Скрываем инфо-панель

    const layer = document.getElementById('layer').value;
    map.removeLayer(currentLayer);

    if (layer === 'udachne') {
        mapWidth = 10240;
        mapHeight = 5120;
        currentLayer = udachneLayer;
        map.setView([mapHeight / 2, mapWidth / 2], -1);
        map.options.crs = L.CRS.Simple;
        map.setMaxBounds(udachneBounds);
        showNotification(translations[currentLang].layerOptions.udachne + ' загружена');
        
        drawStrategicPoints(mapPointsData.udachne); 
        
    } else if (layer === 'sergeevka') {
        mapHeight = 10240;
        mapWidth = 10240;
        currentLayer = sergeevkaLayer;
        map.setView([mapHeight / 2, mapWidth / 2], -1);
        map.options.crs = L.CRS.Simple;
        map.setMaxBounds(sergeevkaBounds);
        showNotification(translations[currentLang].layerOptions.sergeevka + ' загружена');

        drawStrategicPoints(mapPointsData.sergeevka);
        
    } else if (layer === 'satellite') {
        mapHeight = 4352;
        mapWidth = 4352;
        currentLayer = donAirLayer;
        map.setView([mapHeight / 2, mapWidth / 2], -1);
        map.options.crs = L.CRS.Simple;
        map.setMaxBounds(donairBounds);
        showNotification(translations[currentLang].layerOptions.satellite + ' загружена');
        
        drawStrategicPoints(mapPointsData.satellite);
    }

    try {
        map.addLayer(currentLayer);
        console.log('Layer changed to:', layer);
    } catch (error) {
        console.error('Error adding layer:', error);
    }
    drawGrid();
    updateTexts();
}

// Логика истории УДАЛЕНА

function clearMap() {
    // Сбрасываем состояние точек
    const currentLayerName = document.getElementById('layer').value;
    drawStrategicPoints(mapPointsData[currentLayerName]);
    
    // Убираем КШМ и линии
    if (signalLinesLayer) signalLinesLayer.clearLayers();
    if (kshmMarker) {
        map.removeLayer(kshmMarker);
        kshmMarker = null;
    }

    // Сброс поиска
    if (searchCirclesLayer) searchCirclesLayer.clearLayers();
    if (searchResultLayer) searchResultLayer.clearLayers();
    searchTargetPoints = [];
    searchEnemyIds.clear();
    deactivateModes();

    // Скрываем инфо-панель
    closeResult();
}

// Функции главного меню
function toggleMainMenu() {
    console.log('Toggling main menu...');
    const modal = document.getElementById('main-modal');
    if (!modal.classList.contains('active')) {
        modal.setAttribute("style", "display: flex;")
        setTimeout(() => {
            modal.classList.add('active');
        }, 20)
    } else {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.setAttribute("style", "display: none;")
        }, 300)
    }

    console.log('Menu state:', modal.classList.contains('active') ? 'open' : 'closed');
}

function showMenuSection(sectionId) {
    console.log('Showing menu section:', sectionId);
    // Скрываем все разделы
    const sections = document.querySelectorAll('.menu-section');
    sections.forEach(section => section.classList.remove('active'));

    // Убираем активный класс со всех навигационных элементов
    const navItems = document.querySelectorAll('.menu-nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    // Показываем выбранный раздел
    document.getElementById(sectionId).classList.add('active');

    // Добавляем активный класс к соответствующему навигационному элементу
    const clickedNav = document.querySelector(`[data-section="${sectionId}"]`);
    if (clickedNav) clickedNav.classList.add('active');
}

// Закрытие модального окна при клике вне его
document.getElementById('main-modal').addEventListener('click', (e) => {
    if (e.target.id === 'main-modal') {
        toggleMainMenu();
    }
});

let deviceMode = 'pc';
let activeMode = null; // для мобильного

function setDevice(mode) {
    deviceMode = mode;
    
    // Не закрываем меню, если вызвано при загрузке (не 'mobile')
    if (mode === 'mobile') { 
        toggleMainMenu(); 
    }

    if (mode === 'mobile') {
        document.getElementById('mobile-buttons').classList.add('active');
        map.off('contextmenu');
        map.off('click');
        
        map.on('click', (e) => {
            // Клик по карте (мобильный)
            if (currentMode === 'kshm') {
                placeKshm(e.latlng);
            } else {
                console.log('Mobile map click at', e.latlng);
            }
        });

        // Показываем уведомление, только если кнопка была нажата
        if(document.getElementById('main-modal').classList.contains('active')) {
             showNotification(translations[currentLang].deviceBtnTitle + ': ' + translations[currentLang].mobileBtn);
        }
    
    } else { // 'pc' mode
        document.getElementById('mobile-buttons').classList.remove('active');
        map.off('click'); // Отключаем старый
        map.off('contextmenu'); // Отключаем старый
        
        map.on('contextmenu', (e) => {
            // Правый клик (ПК) - ставим КШМ
            if (currentMode === 'kshm') {
                e.originalEvent.preventDefault(); // Отменяем стандартное меню
                placeKshm(e.latlng);
            } else {
                console.log('PC right-click detected at', e.latlng);
            }
        });
        
        map.on('click', (e) => {
            // Левый клик (ПК) - ничего не делаем, т.к. клик на маркеры
            console.log('PC left-click detected at', e.latlng);
        });
        
        // Показываем уведомление, только если кнопка была нажата
        if(document.getElementById('main-modal').classList.contains('active')) {
             showNotification(translations[currentLang].deviceBtnTitle + ': ' + translations[currentLang].pcBtn);
        }
    }
}
// --- КОНЕЦ ОБНОВЛЕННОЙ ФУНКЦИИ ---

// Функция уведомлений
let notificationTimer = null;

function showNotification(text) {
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = 'toast'; // внешний вид задан в style.css
        document.body.appendChild(notification);
    }

    notification.textContent = text;
    // Дадим браузеру отрисовать начальное состояние, чтобы анимация сработала
    requestAnimationFrame(() => notification.classList.add('show'));

    // Новое уведомление продлевает показ, а не обрывается таймером предыдущего
    clearTimeout(notificationTimer);
    notificationTimer = setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function toggleMobileButtons() {
    const mobileButtons = document.getElementById('mobile-buttons');
    mobileButtons.classList.remove('active');
    activeMode = null;
}

try {
    map.fitBounds(udachneBounds);
    console.log('Map fit to bounds');
} catch (error) {
    console.error('Error fitting map bounds:', error);
}
updateTexts();
updateLayerOptions();
updateThemeOptions();
updateLanguageOptions();
drawGrid();

// Отрисовываем точки для "Удачного" (т.к. она по умолчанию)
drawStrategicPoints(mapPointsData.udachne);


// --- НОВЫЕ ФУНКЦИИ ЛОГИКИ ---

// Вспомогательная функция расчета дистанции
function calculateDistance(point1, point2) {
    const lat1 = Array.isArray(point1) ? point1[0] : point1.lat;
    const lng1 = Array.isArray(point1) ? point1[1] : point1.lng;
    const lat2 = Array.isArray(point2) ? point2[0] : point2.lat;
    const lng2 = Array.isArray(point2) ? point2[1] : point2.lng;

    const dx = lng1 - lng2;
    const dy = lat1 - lat2;
    return Math.sqrt(dx * dx + dy * dy);
}

// --- РЕЖИМЫ ---
function togglePointsMode() {
    const wasSearch = (currentMode === 'search');
    currentMode = (currentMode === 'points') ? 'none' : 'points';
    const btn = document.getElementById('toggle-points-mode-btn');
    if (currentMode === 'points') {
        btn.classList.add('active');
        document.getElementById('toggle-kshm-mode-btn').classList.remove('active');
        document.getElementById('toggle-search-mode-btn').classList.remove('active');
        showNotification(translations[currentLang].notificationPointsMode);
        map.getContainer().style.cursor = 'pointer';
    } else {
        deactivateModes();
    }
    if (wasSearch) leaveSearchMode();
}

function toggleKshmMode() {
    const wasSearch = (currentMode === 'search');
    currentMode = (currentMode === 'kshm') ? 'none' : 'kshm';
    const btn = document.getElementById('toggle-kshm-mode-btn');
    if (currentMode === 'kshm') {
        btn.classList.add('active');
        document.getElementById('toggle-points-mode-btn').classList.remove('active');
        document.getElementById('toggle-search-mode-btn').classList.remove('active');
        showNotification(translations[currentLang].notificationKshmMode);
        map.getContainer().style.cursor = 'crosshair';
    } else {
        deactivateModes();
    }
    if (wasSearch) leaveSearchMode();
}

// --- РЕЖИМ ПОИСКА КШМ ---
function toggleSearchMode() {
    currentMode = (currentMode === 'search') ? 'none' : 'search';
    const btn = document.getElementById('toggle-search-mode-btn');
    if (currentMode === 'search') {
        btn.classList.add('active');
        document.getElementById('toggle-points-mode-btn').classList.remove('active');
        document.getElementById('toggle-kshm-mode-btn').classList.remove('active');
        // Пока враг не отмечен, начинаем с расстановки его точек, иначе сразу с выбора цели
        searchTool = (searchEnemyIds.size === 0) ? 'enemy' : 'target';
        showNotification(translations[currentLang].notificationSearchMode);
        map.getContainer().style.cursor = 'help';
        redrawPoints();      // подсветить вражеские точки
        updateStatusPanel(); // в режиме поиска рисует панель поиска
    } else {
        deactivateModes();
        leaveSearchMode();
    }
}

// Вернуть обычный вид карты после выхода из режима поиска
function leaveSearchMode() {
    resetSearchView();
    updateSignalRange(); // вернуть линии связи, статусы точек и обычную инфо-панель
}

function deactivateModes() {
    currentMode = 'none';
    document.getElementById('toggle-points-mode-btn').classList.remove('active');
    document.getElementById('toggle-kshm-mode-btn').classList.remove('active');
    
    const adminBtn = document.getElementById('toggle-search-mode-btn');
    if (adminBtn) adminBtn.classList.remove('active');
    
    map.getContainer().style.cursor = '';
    
    // Сброс поиска
    searchCirclesLayer.clearLayers();
    searchResultLayer.clearLayers();
    searchTargetPoints = [];
    closeResult(); // Закрываем панель
}

// --- ОТРИСОВКА ---

// Эта функция создает 1 маркер (с нужным цветом)
function createPointMarker(point) {
    const latlng = { lat: point.coords[0], lng: point.coords[1] };
    
    let color;
    if (point.status === 'captured') {
        color = '#00BFFF'; // Синий (Захвачено)
    } else if (point.status === 'available') {
        color = '#FF0000'; // Красный (Доступно)
    } else {
        color = '#FFFF00'; // Желтый (Нейтрально)
    }
    
    // В режиме ПОИСКА все "наши" точки (синие) делаем полупрозрачными,
    // а точки, которые держит враг, выделяем оранжевым
    const isEnemy = (currentMode === 'search' && searchEnemyIds.has(point.id));
    if (isEnemy) color = '#FF8C00';
    let opacity = (currentMode === 'search' && point.status === 'captured') ? 0.3 : 0.5;
    if (isEnemy) opacity = 0.85;

    const marker = L.circleMarker(latlng, {
        radius: 8,
        color: color,
        weight: 3,
        fillColor: color,
        fillOpacity: opacity
    }).addTo(pointLayer);

    marker.bindTooltip(point.name, { // point.name теперь содержит перевод
        permanent: true,
        direction: 'top',
        offset: [0, -10],
        className: 'strategic-point-label'
    });

    // --- ОБНОВЛЕННЫЙ КЛИК НА МАРКЕР ---
    marker.on('click', () => {
        if (currentMode === 'points') {
            handlePointClick(point.id);
        } else if (currentMode === 'search') {
            handleSearchClick(point); // --- Новый обработчик
        }
    });
}

// Отрисовывает ВСЕ точки из массива
function redrawPoints() {
    if (!pointLayer) return;
    pointLayer.clearLayers();
    currentMapPoints.forEach(point => {
        createPointMarker(point);
    });
}

// Инициализирует и отрисовывает точки при смене карты
function drawStrategicPoints(pointsArray) {
    if (!pointLayer || !pointsArray || pointsArray.length === 0) {
        currentMapPoints = []; // Очищаем, если карта пустая
        return; 
    }
    const mapName = document.getElementById('layer').value || 'udachne';
    
    // Глубокое копирование
    currentMapPoints = JSON.parse(JSON.stringify(pointsArray));
    
    // Внедряем имена
    currentMapPoints.forEach(p => {
        const pointTranslations = translations[currentLang].pointNames[mapName];
        p.name = pointTranslations ? (pointTranslations[p.id] || `Point ${p.id}`) : `Point ${p.id}`;
    });
    
    redrawPoints(); // Отрисовываем
}

// --- ЛОГИКА ---

// Клик по маркеру в режиме Точек
function handlePointClick(clickedPointId) {
    const point = currentMapPoints.find(p => p.id === clickedPointId);
    if (!point) return;

    if (point.status === 'neutral' || point.status === 'available') {
        point.status = 'captured';
    } else if (point.status === 'captured') {
        point.status = 'neutral';
    }
    updateSignalRange();
}

// --- КЛИК В РЕЖИМЕ ПОИСКА (зависит от выбранного инструмента) ---
function handleSearchClick(point) {
    if (searchTool === 'target') {
        // Цель: любая точка, которую атакует враг
        const index = searchTargetPoints.findIndex(p => p.id === point.id);
        if (index > -1) {
            searchTargetPoints.splice(index, 1); // Убираем, если уже есть (toggle)
        } else {
            searchTargetPoints.push(point);
        }
        refreshSearch();
        return;
    }

    if (searchTool === 'enemy') {
        // Точка врага (toggle). Вражеская точка не может быть нашей
        if (searchEnemyIds.has(point.id)) {
            searchEnemyIds.delete(point.id);
        } else {
            searchEnemyIds.add(point.id);
            if (point.status === 'captured') point.status = 'neutral';
        }
    } else {
        // Наша точка (toggle), как в режиме точек
        if (point.status === 'captured') {
            point.status = 'neutral';
        } else {
            point.status = 'captured';
            searchEnemyIds.delete(point.id);
        }
    }
    // Пересчитает статусы, перерисует точки и обновит панель поиска
    updateSignalRange();
}

// Установка КШМ
function placeKshm(latlng) {
    if (kshmMarker) {
        map.removeLayer(kshmMarker);
    }
    kshmMarker = L.marker(latlng, { icon: kshmIcon, draggable: true })
        .addTo(map)
        .bindPopup(translations[currentLang].kshmPopup)
        .openPopup();

    kshmMarker.on('dragend', updateSignalRange);
    updateSignalRange();
}

// --- ОБНОВЛЕННАЯ ФУНКЦИЯ ДЛЯ ИНФО-ПАНЕЛИ ---
function updateStatusPanel(powerDist, availablePointNames) {
    const t = translations[currentLang];
    const panel = document.getElementById('result-panel');
    const resultDiv = document.getElementById('result');

    // В режиме поиска панель показывает результат поиска
    if (currentMode === 'search') {
        refreshSearch();
        return;
    }
    
    // Если не в режиме поиска, работает как раньше
    if (!kshmMarker) {
        panel.classList.remove('active');
        resultDiv.innerHTML = '';
        return;
    }

    let powerText = '';
    if (powerDist > 0) {
        powerText = `<b>${t.kshmPowerSource}</b> ${powerDist.toFixed(0)}м`;
    } else {
        powerText = `<b>${t.kshmNoPower}</b>`;
    }

    let countText = `<b>${t.kshmActivePoints}</b> `;
    if (availablePointNames.length > 0) {
        countText += availablePointNames.join(', ');
    } else {
        countText += t.kshmNoPoints;
    }
    
    resultDiv.innerHTML = `${powerText}<br>${countText}`;
    panel.classList.add('active');
}

// --- ГЛАВНАЯ ФУНКЦИЯ ОБНОВЛЕНИЯ (ДЛЯ СИНИХ/КРАСНЫХ ТОЧЕК) ---
function updateSignalRange() {
    signalLinesLayer.clearLayers();

    // Сбрасываем все "доступные" точки в "нейтральные"
    currentMapPoints.forEach(p => {
        if (p.status === 'available') {
            p.status = 'neutral';
        }
    });

    const capturedPoints = currentMapPoints.filter(p => p.status === 'captured');
    const neutralPoints = currentMapPoints.filter(p => p.status === 'neutral');

    // 1. Логика Точка-Точка (2км, красные линии)
    capturedPoints.forEach(cPoint => {
        neutralPoints.forEach(nPoint => {
            const dist = calculateDistance(cPoint.coords, nPoint.coords);
            if (dist <= POINT_RANGE) { // POINT_RANGE теперь 2000
                if (nPoint.status === 'neutral') { 
                     nPoint.status = 'available';
                }
                L.polyline([cPoint.coords, nPoint.coords], { className: 'signal-line-red' }).addTo(signalLinesLayer);
            }
        });
    });

    // 1b. Логика Точка-Точка (2км, синие линии, ДРУЖЕСТВЕННЫЕ)
    for (let i = 0; i < capturedPoints.length; i++) {
        for (let j = i + 1; j < capturedPoints.length; j++) {
            const p1 = capturedPoints[i];
            const p2 = capturedPoints[j];
            const dist = calculateDistance(p1.coords, p2.coords);
            if (dist <= POINT_TO_KSHM_RANGE) { // 2км
                L.polyline([p1.coords, p2.coords], { className: 'signal-line-blue' }).addTo(signalLinesLayer);
            }
        }
    }

    // 2. Логика КШМ
    let kshmPowerDist = 0;
    let kshmActivePointNames = []; // Массив имен
    
    if (kshmMarker) {
        const kshmPos = kshmMarker.getLatLng();
        let isKshmPowered = false;
        let minPowerDist = Infinity;

        // 2a. Проверяем, "запитана" ли КШМ (2км от СИНИХ точек)
        capturedPoints.forEach(cPoint => {
            const distToKshm = calculateDistance(cPoint.coords, kshmPos);
            if (distToKshm <= POINT_TO_KSHM_RANGE) { 
                isKshmPowered = true;
                L.polyline([cPoint.coords, kshmPos], { className: 'signal-line-blue' }).addTo(signalLinesLayer);
                
                if (distToKshm < minPowerDist) {
                    minPowerDist = distToKshm;
                }
            }
        });

        if (isKshmPowered) kshmPowerDist = minPowerDist;

        // 2b. Если запитана, раздаем сигнал (2км)
        if (isKshmPowered) {
            currentMapPoints.forEach(p => {
                if (p.status === 'neutral') { // Ищем только нейтральные
                    const distFromKshm = calculateDistance(kshmPos, p.coords);
                    if (distFromKshm <= KSHM_RANGE) {
                        p.status = 'available'; // Делаем красной
                        L.polyline([kshmPos, p.coords], { className: 'signal-line-red' }).addTo(signalLinesLayer);
                        kshmActivePointNames.push(p.name); // Добавляем имя
                    }
                }
            });
        }
    }

    redrawPoints(); // Перерисовываем все точки с новыми цветами
    updateStatusPanel(kshmPowerDist, kshmActivePointNames); // Обновляем инфо-панель
}

// --- ПОИСК ВРАЖЕСКОЙ КШМ ---
// Как это работает:
//  1. Игрок отмечает точки: свои (синие) и те, что держит враг (оранжевые).
//  2. Выбирает цель: точку, которую враг атакует, но без КШМ взять не может.
//  3. КШМ врага должна одновременно:
//       - стоять не дальше KSHM_RANGE от КАЖДОЙ цели;
//       - быть запитанной, то есть стоять не дальше POINT_TO_KSHM_RANGE от какой-либо точки врага.
//     Зона считается построчно и точно (пересечение кругов целей, объединённое с кругами питания).

// Считает зону возможного положения КШМ врага.
// Возвращает { reason, rows, area, anchor, powerPoints }:
//   reason: null (зона есть) | 'targets' (нет места, достающего до всех целей) | 'power' (место есть, но питания нет)
//   rows: [{ y0, y1, spans: [[x0, x1], ...] }]  - строки зоны (y = lat, x = lng)
//   area: площадь зоны, м²
//   anchor: [lat, lng] - точка внутри зоны, ближайшая к её центру тяжести
//   powerPoints: точки врага, от которых КШМ в этой зоне может получить питание
function computeKshmZone(targets, sources, mapW, mapH) {
    const reach = KSHM_RANGE;            // КШМ -> цель
    const power = POINT_TO_KSHM_RANGE;   // точка врага -> КШМ

    // Рамка пересечения кругов целей (в границах карты)
    let yMin = 0, yMax = mapH, xMin = 0, xMax = mapW;
    targets.forEach(t => {
        yMin = Math.max(yMin, t.coords[0] - reach);
        yMax = Math.min(yMax, t.coords[0] + reach);
        xMin = Math.max(xMin, t.coords[1] - reach);
        xMax = Math.min(xMax, t.coords[1] + reach);
    });
    const result = { reason: 'targets', rows: [], area: 0, anchor: null, powerPoints: [] };
    if (yMin >= yMax || xMin >= xMax) return result;

    let hasTargetOverlap = false;
    let area = 0, sumX = 0, sumY = 0;
    const powerSet = new Set();

    for (let y0 = yMin; y0 < yMax; y0 += SEARCH_SCAN_STEP) {
        const y1 = Math.min(y0 + SEARCH_SCAN_STEP, yMax);
        const y = (y0 + y1) / 2;

        // Отрезок по X, достающий до всех целей
        let left = xMin, right = xMax;
        for (const t of targets) {
            const dy = y - t.coords[0];
            const h2 = reach * reach - dy * dy;
            if (h2 < 0) { left = Infinity; break; }
            const h = Math.sqrt(h2);
            left = Math.max(left, t.coords[1] - h);
            right = Math.min(right, t.coords[1] + h);
        }
        if (!(left < right)) continue;
        hasTargetOverlap = true;

        // Отрезки по X, где есть питание от точек врага
        const powered = [];
        for (const s of sources) {
            const dy = y - s.coords[0];
            const h2 = power * power - dy * dy;
            if (h2 < 0) continue;
            const h = Math.sqrt(h2);
            const a = s.coords[1] - h, b = s.coords[1] + h;
            if (a < right && b > left) {
                powered.push([Math.max(a, left), Math.min(b, right)]);
                powerSet.add(s.id);
            }
        }
        if (powered.length === 0) continue;

        // Объединяем перекрывающиеся отрезки
        powered.sort((p, q) => p[0] - q[0]);
        const spans = [powered[0].slice()];
        for (let i = 1; i < powered.length; i++) {
            const last = spans[spans.length - 1];
            if (powered[i][0] <= last[1]) {
                last[1] = Math.max(last[1], powered[i][1]);
            } else {
                spans.push(powered[i].slice());
            }
        }

        result.rows.push({ y0, y1, spans });
        spans.forEach(([x0, x1]) => {
            const a = (x1 - x0) * (y1 - y0);
            area += a;
            sumX += a * (x0 + x1) / 2;
            sumY += a * y;
        });
    }

    if (result.rows.length === 0) {
        result.reason = hasTargetOverlap ? 'power' : 'targets';
        return result;
    }

    // Точка внутри зоны, ближайшая к центру тяжести (сам центр может оказаться вне зоны)
    const cx = sumX / area, cy = sumY / area;
    let best = null, bestDist = Infinity;
    result.rows.forEach(row => {
        const y = (row.y0 + row.y1) / 2;
        row.spans.forEach(([x0, x1]) => {
            const x = Math.min(Math.max(cx, x0), x1);
            const d = Math.hypot(x - cx, y - cy);
            if (d < bestDist) { bestDist = d; best = [y, x]; }
        });
    });

    result.reason = null;
    result.area = area;
    result.anchor = best;
    result.powerPoints = sources.filter(s => powerSet.has(s.id));
    return result;
}

// Выбор инструмента клика в панели поиска
function setSearchTool(tool) {
    searchTool = tool;
    refreshSearch();
}

// Убрать с карты всё, что относится к поиску (отметки врага остаются)
function resetSearchView() {
    if (searchCirclesLayer) searchCirclesLayer.clearLayers();
    if (searchResultLayer) searchResultLayer.clearLayers();
    searchTargetPoints = [];
}

// Кнопка "Сбросить" в панели поиска: убирает цели и отметки врага
function resetSearchAll() {
    searchEnemyIds.clear();
    searchTargetPoints = [];
    searchTool = 'enemy';
    updateSignalRange(); // перерисует точки и панель
}

// Круги целей (радиус достижения КШМ) и круги питания от точек врага
function redrawSearchCircles(powerPoints) {
    searchCirclesLayer.clearLayers();
    const t = translations[currentLang];

    searchTargetPoints.forEach(p => {
        L.circle(p.coords, {
            radius: KSHM_RANGE,
            className: 'search-circle-red'
        }).addTo(searchCirclesLayer)
          .bindPopup(`${t.searchPopupTarget} (${p.name})`);
    });

    (powerPoints || []).forEach(p => {
        L.circle(p.coords, {
            radius: POINT_TO_KSHM_RANGE,
            className: 'search-source-circle'
        }).addTo(searchCirclesLayer);
    });
}

// Рисует зону КШМ одним многоугольником и ставит маркер "вероятное место"
function drawKshmZone(zone) {
    const t = translations[currentLang];
    // Каждая строка зоны - отдельный прямоугольник; строки чуть перекрываются, чтобы не было просветов
    const polygons = [];
    zone.rows.forEach(row => {
        row.spans.forEach(([x0, x1]) => {
            polygons.push([[[row.y0, x0], [row.y0, x1], [row.y1 + 0.5, x1], [row.y1 + 0.5, x0]]]);
        });
    });
    L.polygon(polygons, {
        className: 'search-zone',
        stroke: false,
        fillColor: '#FF2D2D',
        fillOpacity: 0.35,
        fillRule: 'nonzero',
        interactive: false
    }).addTo(searchResultLayer);

    L.marker(zone.anchor, {
        icon: L.divIcon({ className: 'kshm-guess-icon', iconSize: [18, 18] }),
        keyboard: false
    }).addTo(searchResultLayer).bindTooltip(t.searchKshmGuess, { direction: 'top', offset: [0, -10] });
}

// Ориентир для описания зоны: ближайшая точка карты и сторона света, в которой от неё лежит зона
function describeZoneLocation(anchor) {
    const t = translations[currentLang];
    let nearest = null, nearestDist = Infinity;
    currentMapPoints.forEach(p => {
        const d = calculateDistance(anchor, p.coords);
        if (d < nearestDist) { nearestDist = d; nearest = p; }
    });
    if (!nearest) return '';

    const meters = Math.round(nearestDist / 10) * 10;
    if (meters < 150) return `${t.searchNearPoint} <b>${nearest.name}</b>`;

    // Угол от севера по часовой стрелке (lat растёт вверх = на север)
    const angle = Math.atan2(anchor[1] - nearest.coords[1], anchor[0] - nearest.coords[0]) * 180 / Math.PI;
    const dir = t.compass[Math.round(((angle + 360) % 360) / 45) % 8];
    return `${t.searchNearPoint} <b>${nearest.name}</b>: ${meters} ${t.searchUnitM}, ${dir}`;
}

// Главная функция поиска: пересчитывает зону и обновляет карту и панель
function refreshSearch() {
    if (currentMode !== 'search') return;

    searchResultLayer.clearLayers();
    // В режиме поиска показываем только слои поиска, линии связи мешают
    signalLinesLayer.clearLayers();

    const enemyPoints = currentMapPoints.filter(p => searchEnemyIds.has(p.id));
    let zone = null;
    if (enemyPoints.length > 0 && searchTargetPoints.length > 0) {
        zone = computeKshmZone(searchTargetPoints, enemyPoints, mapWidth, mapHeight);
    }

    redrawSearchCircles(zone && !zone.reason ? zone.powerPoints : []);
    if (zone && !zone.reason) drawKshmZone(zone);
    renderSearchPanel(enemyPoints, zone);
}

// Рисует панель: инструменты, подсказка и результат
function renderSearchPanel(enemyPoints, zone) {
    const t = translations[currentLang];
    const resultDiv = document.getElementById('result');
    const panel = document.getElementById('result-panel');

    const tools = [
        ['enemy', t.searchToolEnemy, '#FF8C00'],
        ['mine', t.searchToolMine, '#00BFFF'],
        ['target', t.searchToolTarget, '#FF0000']
    ];
    let html = `<b class="search-title">${t.searchResultTitle}</b>`;
    html += '<div class="search-tools">';
    tools.forEach(([id, label, color]) => {
        html += `<button class="search-tool-btn${searchTool === id ? ' active' : ''}" onclick="setSearchTool('${id}')">` +
                `<span class="search-tool-dot" style="background:${color}"></span>${label}</button>`;
    });
    html += `<button class="search-tool-btn search-tool-reset" onclick="resetSearchAll()" title="${t.searchReset}">` +
            `<i class="fas fa-rotate-left"></i></button>`;
    html += '</div>';
    html += `<div class="search-hint">${t.searchHints[searchTool]}</div>`;

    let msg;
    if (currentMapPoints.length === 0) {
        msg = t.searchNoPointsOnMap;
    } else if (enemyPoints.length === 0) {
        msg = t.searchNeedEnemy;
    } else if (searchTargetPoints.length === 0) {
        msg = t.searchResultWaiting;
    } else if (zone.reason === 'targets') {
        msg = t.searchNoZoneTargets;
    } else if (zone.reason === 'power') {
        msg = t.searchNoZonePower;
    } else {
        const km2 = (zone.area / 1e6).toFixed(2);
        msg = `<b>${t.searchZoneFound}</b><br>${t.searchZoneArea} ~${km2} ${t.searchUnitKm2}<br>` +
              `${t.searchPowerFrom} ${zone.powerPoints.map(p => p.name).join(', ')}<br>` +
              describeZoneLocation(zone.anchor);
    }

    // Цели, до которых враг достаёт и без КШМ (точка врага ближе POINT_RANGE)
    if (enemyPoints.length > 0 && searchTargetPoints.length > 0) {
        const easy = searchTargetPoints.filter(tp =>
            enemyPoints.some(ep => calculateDistance(tp.coords, ep.coords) <= POINT_RANGE));
        if (easy.length > 0) {
            msg += `<br><span class="search-note">${t.searchNoKshmNeeded} ${easy.map(p => p.name).join(', ')}</span>`;
        }
    }

    html += `<div class="search-msg">${msg}</div>`;
    resultDiv.innerHTML = html;
    panel.classList.add('active');
}


// --- ЗАПУСК РЕЖИМА ПК ПО УМОЛЧАНИЮ ---
setDevice('pc');
