console.log('Starting map initialization...');

let currentLang = 'uk';

// --- ИЗМЕНЕНИЕ 1: ---
let isAddPointMode = false; // Флаг, включен ли режим добавления точек
let tempPoints = []; // Массив для временного хранения точек
let pointLayer; // <-- ОШИБКА БЫЛА ЗДЕСЬ. Теперь мы просто объявляем.
// --- КОНЕЦ ---

function changeLanguage() {
    currentLang = document.getElementById('language').value;
    document.title = translations[currentLang].title;
    updateTexts();
    updateLayerOptions();
    updateLanguageOptions();
    showMenuSection(document.querySelector('.menu-nav-item.active').getAttribute('data-section'));
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

    // --- ИЗМЕНЕНИЕ 2: Инициализируем слой ЗДЕСЬ, ПОСЛЕ создания карты ---
    pointLayer = L.layerGroup().addTo(map);
    // --- КОНЕЦ ---

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
    // --- ИЗМЕНЕНИЕ 3: Добавил проверку на существование pointLayer ---
    if (pointLayer) pointLayer.clearLayers(); // Очищаем маркеры
    tempPoints = []; // Очищаем массив
    if (isAddPointMode) toggleAddPointMode(); // Выключаем режим
    // --- КОНЕЦ ---

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
    } else if (layer === 'sergeevka') {
        mapHeight = 10240;
        mapWidth = 10240;
        currentLayer = sergeevkaLayer;
        map.setView([mapHeight / 2, mapWidth / 2], -1);
        map.options.crs = L.CRS.Simple;
        map.setMaxBounds(sergeevkaBounds);
        showNotification(translations[currentLang].layerOptions.sergeevka + ' загружена');
    } else if (layer === 'satellite') {
        mapHeight = 4352;
        mapWidth = 4352;
        currentLayer = donAirLayer;
        map.setView([mapHeight / 2, mapWidth / 2], -1);
        map.options.crs = L.CRS.Simple;
        map.setMaxBounds(donairBounds);
        showNotification(translations[currentLang].layerOptions.satellite + ' загружена');
    }

    try {
        map.addLayer(currentLayer);
        console.log('Layer changed to:', layer);
    } catch (error) {
        console.error('Error adding layer:', error);
    }
    drawGrid();

    document.getElementById('result-panel').classList.remove('active');
    loadHistoryItems(); 
    updateTexts();
}

// Вся логика истории - Удалена
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
    // Очистил функцию, чтобы она ничего не делала, но не вызывала ошибок
    document.getElementById('history-list').innerHTML = "";
}
loadHistoryItems();

function loadPointsFrom(i) {}


function clearMap() {
    // Очистил функцию
    document.getElementById('result').innerText = '';
    document.getElementById('result-panel').classList.remove('active');
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
let activeMode = null;

// --- ОБНОВЛЕННАЯ ФУНКЦИЯ ---
function setDevice(mode) {
    deviceMode = mode;
    toggleMainMenu();

    if (mode === 'mobile') {
        document.getElementById('mobile-buttons').classList.add('active');
        map.off('contextmenu');
        map.off('click');
        
        map.on('click', (e) => {
            if (isAddPointMode) {
                // РЕЖИМ АДМИНА (МОБ)
                const pointName = prompt(translations[currentLang].promptPointName || 'Введите имя точки:');
                if (pointName) {
                    const newPoint = {
                        id: tempPoints.length + 1,
                        name: pointName,
                        coords: [e.latlng.lat, e.latlng.lng],
                        status: 'neutral'
                    };
                    tempPoints.push(newPoint);
                    createPointMarker(newPoint.name, e.latlng);
                }
            } else {
                // Обычный клик (мобильный)
                console.log('Mobile map click');
            }
        });

        showNotification(translations[currentLang].deviceBtnTitle + ': ' + translations[currentLang].mobileBtn);
    
    } else { // 'pc' mode
        document.getElementById('mobile-buttons').classList.remove('active');
        map.off('click');
        
        map.on('contextmenu', (e) => {
            console.log('PC right-click detected at', e.latlng);
            // Сюда будем добавлять логику для КШМ
        });
        
        map.on('click', (e) => {
            if (isAddPointMode) {
                // РЕЖИМ АДМИНА (ПК)
                const pointName = prompt(translations[currentLang].promptPointName || 'Введите имя точки:');
                if (pointName) {
                    const newPoint = {
                        id: tempPoints.length + 1, // Простой ID
                        name: pointName,
                        coords: [e.latlng.lat, e.latlng.lng],
                        status: 'neutral' // Статус по умолчанию
                    };
                    tempPoints.push(newPoint);
                    createPointMarker(newPoint.name, e.latlng);
                }
            } else {
                // Обычный клик (ПК)
                console.log('PC left-click detected at', e.latlng);
                // Сюда будем добавлять логику для выбора точек
            }
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

// --- НОВЫЕ ФУНКЦИИ В КОНЦЕ ФАЙЛА ---

function toggleAddPointMode() {
    isAddPointMode = !isAddPointMode; // Переключаем true/false
    const btn = document.getElementById('add-point-mode-btn');
    
    if (isAddPointMode) {
        btn.classList.add('active'); // Делаем кнопку "активной" (загорится)
        showNotification('Режим добавления точек АКТИВИРОВАН');
        map.getContainer().style.cursor = 'crosshair'; // Меняем курсор
    } else {
        btn.classList.remove('active');
        showNotification('Режим добавления точек ВЫКЛЮЧЕН');
        map.getContainer().style.cursor = ''; // Возвращаем курсор
    }
}

// Эта функция создает сам маркер (желтый круг + надпись)
function createPointMarker(name, latlng) {
    // 1. Желтый круг
    const marker = L.circleMarker(latlng, {
        radius: 8,
        color: '#FFFF00', // Желтый
        weight: 3,
        fillColor: '#FFFF00',
        fillOpacity: 0.5
    }).addTo(pointLayer); // Добавляем на наш слой

    // 2. Надпись
    marker.bindTooltip(name, {
        permanent: true,       // Показать навсегда
        direction: 'top',      // Показать сверху
        offset: [0, -10],      // Сдвиг от маркера
        className: 'strategic-point-label' // Наш CSS-стиль
    });
}

// Эта функция "экспортирует" данные
function exportPoints() {
    if (tempPoints.length === 0) {
        showNotification('Вы не добавили ни одной точки');
        return;
    }

    // Форматируем в красивый JSON
    const jsonOutput = JSON.stringify(tempPoints, null, 2); 
    
    console.log('--- ВАШИ ТОЧКИ (скопируйте этот код) ---');
    console.log(jsonOutput);
    
    // Показываем в консоли (F12) и в окне "результата" на сайте
    showNotification('Точки выведены в консоль (F12) и в панель результата.');
    document.getElementById('result').innerHTML = `<pre style="color: white; max-height: 200px; overflow-y: auto;">${jsonOutput}</pre>`;
    document.getElementById('result-panel').classList.add('active');
}
