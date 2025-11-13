console.log('Starting map initialization...');

let currentLang = 'uk';
let pointLayer; // Слой для маркеров точек
let signalLinesLayer; // Слой для линий связи
let kshmMarker = null; // Маркер КШМ
let kshmIcon; // Иконка КШМ

let currentMapPoints = []; // Тут будет храниться состояние точек (захвачено/нет)
let currentMode = 'none'; // 'none', 'points', 'kshm'

// --- ОБНОВЛЕННЫЕ КОНСТАНТЫ ---
const KSHM_RANGE = 2000; // 2км (КШМ -> Точка)
const POINT_RANGE = 2000; // 1км (Точка -> Точка)
const POINT_TO_KSHM_RANGE = 2000; // 2км (Точка -> КШМ)

// --- ОБЪЕКТ СО ВСЕМИ ДАННЫМИ ТОЧЕК ---
const mapPointsData = {
    udachne: [
        { "id": 1, "name": "Торгова Площа", "coords": [2685, 7983.25], "status": "neutral" },
        { "id": 2, "name": "Заправка", "coords": [1172, 7524.25], "status": "neutral" },
        { "id": 3, "name": "Карго", "coords": [2172.25, 6159], "status": "neutral" },
        { "id": 4, "name": "Рейвей стейшн", "coords": [2073.5, 5069.25], "status": "neutral" },
        { "id": 5, "name": "Резервний двір", "coords": [1215.75, 2538], "status": "neutral" },
        { "id": 6, "name": "Ферма", "coords": [2214, 1453.25], "status": "neutral" },
        { "id": 7, "name": "Школа", "coords": [3225.75, 2134], "status": "neutral" },
        { "id": 8, "name": "Завод", "coords": [3496.5, 5047.5], "status": "neutral" },
        { "id": 9, "name": "Мілітари", "coords": [2061.75, 3661], "status": "neutral" },
        { "id": 10, "name": "Стройка", "coords": [1111.5, 5316.75], "status": "neutral" },
        { "id": 11, "name": "Складский комплекс", "coords": [1888, 9002.5], "status": "neutral" }
    ],
    sergeevka: [
        { "id": 1, "name": "Окопи", "coords": [7259, 4150.75], "status": "neutral" },
        { "id": 2, "name": "Західний граничний аванпост", "coords": [7875.5, 1369.75], "status": "neutral" },
        { "id": 3, "name": "Східний граничний аванпост", "coords": [6582.75, 8715.5], "status": "neutral" },
        { "id": 4, "name": "Завод", "coords": [5421.75, 8143], "status": "neutral" },
        { "id": 5, "name": "Колгосп", "coords": [7712.25, 7660.25], "status": "neutral" },
        { "id": 6, "name": "Заправка", "coords": [8253.75, 5065.25], "status": "neutral" },
        { "id": 7, "name": "Опорний пункт", "coords": [8753, 2979.5], "status": "neutral" },
        { "id": 8, "name": "Ферма", "coords": [5252.75, 2995.25], "status": "neutral" },
        { "id": 9, "name": "Залізнична станція", "coords": [6647, 2241.5], "status": "neutral" },
        { "id": 10, "name": "Школа", "coords": [5121, 4668.25], "status": "neutral" },
        { "id": 11, "name": "Буд. Майданчик", "coords": [4771.25, 6264.5], "status": "neutral" },
        { "id": 12, "name": "Склади", "coords": [6969, 6132.5], "status": "neutral" }
    ],
    satellite: [] // Для Аэропорта точек нет
};
// --- КОНЕЦ ДАННЫХ ---


function changeLanguage() {
    currentLang = document.getElementById('language').value;
    document.title = translations[currentLang].title;
    updateTexts();
    updateLayerOptions();
    updateLanguageOptions();
    showMenuSection(document.querySelector('.menu-nav-item.active').getAttribute('data-section'));
    updateStatusPanel(); // Обновить текст в панели
}

function toggleHistory() {
    document.getElementById('history-panel').classList.toggle('active')
    document.getElementById('toggleHistoryBtn').classList.toggle('active')
}

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
    document.getElementById('info-title').textContent = t.navInfo;
    document.getElementById('history-title').textContent = t.historyTitle;
    document.getElementById('info-content').innerHTML = t.infoText;
    document.getElementById('theme-label').innerHTML = t.themeLabel;
    document.getElementById('onmap-history').textContent = t.onMapHistory + t.layerOptions[currentLayer._url.split(".")[1].replace("/assets/images/", "")]
    document.getElementById('toggleMenuLabel').textContent = t.toggleMenuLabel.toUpperCase();

    // Обновляем title у новых кнопок
    document.getElementById('toggle-points-mode-btn').title = t.togglePointsModeTitle;
    document.getElementById('toggle-kshm-mode-btn').title = t.toggleKshmModeTitle;
    // Обновляем popup у КШМ, если он есть
    if (kshmMarker) kshmMarker.bindPopup(translations[currentLang].kshmPopup);
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

    loadHistoryItems(); 
    updateTexts();
}

// Логика истории (пока пустая)
let guidances = {
    udachne: [],
    sergeevka: [],
    DonAirConflict: []
}
function saveToHistory() {
    showNotification('Функция истории пока неактивна');
}
function deleteHistoryItem(i) {}
function renameHistoryItem(i) {}
function runRenameHistoryItem(event) {}
function runRenameHistoryItemFocus(i) {}

function loadHistoryItems() {
    document.getElementById('history-list').innerHTML = "";
}
loadHistoryItems();

function loadPointsFrom(i) {}


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
        }, 100)
    } else {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.setAttribute("style", "display: none;")
        }, 100)
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
    toggleMainMenu();

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

        showNotification(translations[currentLang].deviceBtnTitle + ': ' + translations[currentLang].mobileBtn);
    
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

        showNotification(translations[currentLang].deviceBtnTitle + ': ' + translations[currentLang].pcBtn);
    }
}
// --- КОНЕЦ ОБНОВЛЕННОЙ ФУНКЦИИ ---

// Функция уведомлений
function showNotification(text) {
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 50%;
                    transform: translateX(50%);
                    background: linear-gradient(135deg, #2f855a, #38a169);
                    color: #e2e8f0;
                    padding: 15px 25px;
                    border-radius: 8px;
                    box-shadow: 0 4px 15px rgba(47, 133, 90, 0.4);
                    z-index: 3000;
                    font-weight: bold;
                    opacity: 0;
                    transition: all 0.3s ease;
                    pointer-events: none;
                `;
        document.body.appendChild(notification);
    }

    notification.textContent = text;
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(50%) translateY(0)';

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(50%) translateY(-20px)';
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
    currentMode = (currentMode === 'points') ? 'none' : 'points';
    const btn = document.getElementById('toggle-points-mode-btn');
    if (currentMode === 'points') {
        btn.classList.add('active');
        document.getElementById('toggle-kshm-mode-btn').classList.remove('active');
        showNotification(translations[currentLang].notificationPointsMode);
        map.getContainer().style.cursor = 'pointer';
    } else {
        deactivateModes();
    }
}

function toggleKshmMode() {
    currentMode = (currentMode === 'kshm') ? 'none' : 'kshm';
    const btn = document.getElementById('toggle-kshm-mode-btn');
    if (currentMode === 'kshm') {
        btn.classList.add('active');
        document.getElementById('toggle-points-mode-btn').classList.remove('active');
        showNotification(translations[currentLang].notificationKshmMode);
        map.getContainer().style.cursor = 'crosshair';
    } else {
        deactivateModes();
    }
}

function deactivateModes() {
    currentMode = 'none';
    document.getElementById('toggle-points-mode-btn').classList.remove('active');
    document.getElementById('toggle-kshm-mode-btn').classList.remove('active');
    map.getContainer().style.cursor = '';
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

    const marker = L.circleMarker(latlng, {
        radius: 8,
        color: color,
        weight: 3,
        fillColor: color,
        fillOpacity: 0.5
    }).addTo(pointLayer);

    marker.bindTooltip(point.name, {
        permanent: true,
        direction: 'top',
        offset: [0, -10],
        className: 'strategic-point-label'
    });

    // --- ДОБАВЛЯЕМ КЛИК НА МАРКЕР ---
    marker.on('click', () => {
        handlePointClick(point.id);
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
    if (!pointLayer) return; 
    
    // Глубокое копирование, чтобы сбросить состояние
    currentMapPoints = JSON.parse(JSON.stringify(pointsArray));
    
    redrawPoints(); // Отрисовываем
}

// --- ЛОГИКА ---

// Клик по маркеру
function handlePointClick(clickedPointId) {
    if (currentMode !== 'points') return; // Работаем только в режиме точек

    const point = currentMapPoints.find(p => p.id === clickedPointId);
    if (!point) return;

    // Захватываем (синий) или отменяем захват (желтый)
    if (point.status === 'neutral' || point.status === 'available') {
        point.status = 'captured';
    } else if (point.status === 'captured') {
        point.status = 'neutral';
    }

    updateSignalRange(); // Пересчитываем все сигналы
}

// Установка КШМ
function placeKshm(latlng) {
    if (kshmMarker) {
        map.removeLayer(kshmMarker); // Удаляем старый
    }
    kshmMarker = L.marker(latlng, { icon: kshmIcon, draggable: true })
        .addTo(map)
        .bindPopup(translations[currentLang].kshmPopup)
        .openPopup();

    kshmMarker.on('dragend', updateSignalRange); // Обновлять при перетаскивании
    
    updateSignalRange(); // Пересчитываем сигналы
}

// --- НОВАЯ ФУНКЦИЯ ДЛЯ ИНФО-ПАНЕЛИ ---
function updateStatusPanel(powerDist, activeCount) {
    const t = translations[currentLang];
    const panel = document.getElementById('result-panel');
    const resultDiv = document.getElementById('result');

    if (!kshmMarker) {
        panel.classList.remove('active');
        resultDiv.innerHTML = '';
        return;
    }

    let powerText = '';
    if (powerDist > 0) {
        powerText = `${t.kshmPowerSource} ${powerDist.toFixed(0)}м`;
    } else {
        powerText = t.kshmNoPower;
    }

    let countText = `${t.kshmActivePoints} ${activeCount}`;
    
    resultDiv.innerHTML = `${powerText}<br>${countText}`;
    panel.classList.add('active');
}

// --- ГЛАВНАЯ ФУНКЦИЯ ОБНОВЛЕНИЯ ---
function updateSignalRange() {
    signalLinesLayer.clearLayers(); // Очищаем все старые линии

    // Сбрасываем все "доступные" точки в "нейтральные"
    currentMapPoints.forEach(p => {
        if (p.status === 'available') {
            p.status = 'neutral';
        }
    });

    const capturedPoints = currentMapPoints.filter(p => p.status === 'captured');
    const neutralPoints = currentMapPoints.filter(p => p.status === 'neutral');

    // 1. Логика Точка-Точка (1км)
    capturedPoints.forEach(cPoint => {
        let nearestPoint = null;
        let minDistance = Infinity;

        neutralPoints.forEach(nPoint => {
            const dist = calculateDistance(cPoint.coords, nPoint.coords);
            if (dist < minDistance) {
                minDistance = dist;
                nearestPoint = nPoint;
            }
        });

        if (nearestPoint && minDistance <= POINT_RANGE) {
            nearestPoint.status = 'available'; // Делаем красной
            L.polyline([cPoint.coords, nearestPoint.coords], { className: 'signal-line-red' }).addTo(signalLinesLayer);
        }
    });

    // 2. Логика КШМ
    let kshmPowerDist = 0;
    let kshmActiveCount = 0;
    
    if (kshmMarker) {
        const kshmPos = kshmMarker.getLatLng();
        let isKshmPowered = false;
        let minPowerDist = Infinity;

        // 2a. Проверяем, "запитана" ли КШМ (2км от синей точки)
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
                // Ищем точки, которые *все еще* нейтральные
                if (p.status === 'neutral') {
                    const distFromKshm = calculateDistance(kshmPos, p.coords);
                    if (distFromKshm <= KSHM_RANGE) {
                        p.status = 'available'; // Делаем красной
                        L.polyline([kshmPos, p.coords], { className: 'signal-line-red' }).addTo(signalLinesLayer);
                        kshmActiveCount++; // Считаем
                    }
                }
            });
        }
    }

    redrawPoints(); // Перерисовываем все точки с новыми цветами
    updateStatusPanel(kshmPowerDist, kshmActiveCount); // Обновляем инфо-панель
}

