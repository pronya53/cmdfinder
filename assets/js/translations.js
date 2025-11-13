const translations = {
    ru: {
        title: 'Тактическая карта',
        layerLabel: 'Выбор карты:',
        layerOptions: {
            udachne: 'Удачное',
            sergeevka: 'Сергеевка',
            satellite: 'Донецкий Аэропорт',
            DonAirConflict: 'Донецкий Аэропорт'
        },
        gridToggleLabel: 'Показать сетку',
        languageLabel: 'Язык:',
        languageOptions: {
            ru: 'Русский',
            uk: 'Українська',
            en: 'English'
        },
        deviceBtnTitle: 'Введение',
        pcBtn: 'Мышь и клавиатура',
        mobileBtn: 'Сенсорное',
        infoTitle: 'Информация',
        // --- ОБНОВЛЕННЫЙ ТЕКСТ ---
        infoText: `<h3 id="info-how-to">Как это работает:</h3>
                   <p>Этот инструмент симулирует логику захвата точек и связи для Arma Reforger.</p>
                   <ul>
                        <li id="info-item1"><b>Точки (Желтые):</b> Нейтральные.</li>
                        <li id="info-item2"><b>Режим Точек (<i class="fa fa-network-wired"></i>):</b> Нажмите на нейтральную (желтую) или доступную (красную) точку, чтобы "захватить" ее (станет синей). Нажмите на синюю, чтобы сделать ее нейтральной.</li>
                        <li id="info-item3"><b>Сигнал от Точки:</b> Синяя точка автоматически активирует (делает красными) все нейтральные точки в радиусе <b>1км</b>.</li>
                        <li id="info-item4"><b>Режим КШМ (<i class="fa fa-truck"></i>):</b> Нажмите ПКМ (на ПК) или тапните (на моб.) по карте, чтобы поставить КШМ (синий квадрат).</li>
                        <li id="info-item5"><b>Питание КШМ:</b> КШМ "запитывается", если находится в радиусе <b>2км</b> от любой синей точки.</li>
                        <li id="info-item6"><b>Сигнал от КШМ:</b> Запитанная КШМ активирует (делает красными) все нейтральные точки в радиусе <b>2км</b>.</li>
                   </ul>
                   <p id="info-author"><strong>Автор:</strong> PRONEDROG</p>
                   <p id="info-mapdata"><strong>Данные карт предоставлены:</strong> Conflict In Europe</p>`,
        closeBtn: 'Закрыть',
        clearMapTitle: 'Очистить карту',
        settingsTitle: 'Открыть настройки',
        navLanguage: 'Язык',
        navDevice: 'Введение',
        navMap: 'Выбор карты',
        navInfo: 'Информация',
        credits: 'Powered by PRONEDROG | За поддержкой Conflict In Europe',
        navSetup: 'Предустановки',
        setupTitle: 'Меню предустановок',
        toggleMenuLabel: 'нажмите за границей меню чтобы его закрыть',
        historyTitle: 'Сохраненные',
        themeLabel: "Тема",
        themes: {
            darkgreen: 'Темная + Зелёный',
            lightgreen: 'Светлая + Зелёный',
            darkred: 'Темная + Красный',
            lightred: 'Светлая + Красный'
        },
        onMapHistory: "на карте: ",
        // --- НОВЫЕ СТРОКИ ---
        togglePointsModeTitle: 'Режим управления точками',
        toggleKshmModeTitle: 'Режим установки КШМ',
        kshmPopup: 'Командный пункт (КШМ)',
        notificationPointsMode: 'Режим захвата точек АКТИВИРОВАН',
        notificationKshmMode: 'Режим установки КШМ АКТИВИРОВАН',
        kshmPowerSource: 'Питание КШМ (2км):',
        kshmActivePoints: 'Сигнал на:',
        kshmNoPower: 'КШМ не запитана',
        kshmNoPoints: 'Нет новых точек в радиусе'
    },
    uk: {
        title: 'Тактична карта',
        layerLabel: 'Вибір карти:',
        layerOptions: {
            udachne: 'Удачне',
            sergeevka: 'Сергеївка',
            satellite: 'Донецький Аеропорт',
            DonAirConflict: 'Донецький Аэропорт'
        },
        gridToggleLabel: 'Показати сітку',
        languageLabel: 'Мова:',
        languageOptions: {
            ru: 'російська',
            uk: 'Українська',
            en: 'English'
        },
        deviceBtnTitle: 'Введення',
        pcBtn: 'Миша та клавіатура',
        mobileBtn: 'Сенсорне',
        infoTitle: 'Інформація',
        // --- ОБНОВЛЕННЫЙ ТЕКСТ ---
        infoText: `<h3 id="info-how-to">Як це працює:</h3>
                   <p>Цей інструмент симулює логіку захоплення точок та зв'язку для Arma Reforger.</p>
                   <ul>
                        <li id="info-item1"><b>Точки (Жовті):</b> Нейтральні.</li>
                        <li id="info-item2"><b>Режим Точок (<i class="fa fa-network-wired"></i>):</b> Натисніть на нейтральну (жовту) або доступну (червону) точку, щоб "захопити" її (стане синьою). Натисніть на синю, щоб зробити її нейтральною.</li>
                        <li id="info-item3"><b>Сигнал від Точки:</b> Синя точка автоматично активує (робить червоними) усі нейтральні точки в радіусі <b>1км</b>.</li>
                        <li id="info-item4"><b>Режим КШМ (<i class="fa fa-truck"></i>):</b> Натисніть ПКМ (на ПК) або тапніть (на моб.) по карті, щоб поставити КШМ (синій квадрат).</li>
                        <li id="info-item5"><b>Живлення КШМ:</b> КШМ "отримує живлення", якщо знаходиться в радіусі <b>2км</b> від будь-якої синьої точки.</li>
                        <li id="info-item6"><b>Сигнал від КШМ:</b> КШМ, що має живлення, активує (робить червоними) усі нейтральні точки в радіусі <b>2км</b>.</li>
                   </ul>
                   <p id="info-author"><strong>Автор:</strong> PRONEDROG</p>
                   <p id="info-mapdata"><strong>Дані карт надано:</strong> Conflict In Europe</p>`,
        closeBtn: 'Закрити',
        clearMapTitle: 'Очистити карту',
        settingsTitle: 'Відкрити налаштування',
        navLanguage: 'Мова',
        navDevice: 'Введення',
        navMap: 'Вибір карти',
        navInfo: 'Інформація',
        credits: 'Powered by PRONEDROG | За підтримки Conflict InEurope',
        navSetup: 'Передустановка',
        setupTitle: 'Меню передустановок',
        toggleMenuLabel: 'натисніть за кордоном меню, щоб його закрити',
        historyTitle: 'Збережені',
        themes: {
            darkgreen: 'Темна + Зелений',
            lightgreen: 'Світла + Зелений',
            darkred: 'Темна + Червоний',
            lightred: 'Світла + Червоний'
        },
        themeLabel: "Тема",
        onMapHistory: "на мапі: ",
        // --- НОВЫЕ СТРОКИ ---
        togglePointsModeTitle: 'Режим керування точками',
        toggleKshmModeTitle: 'Режим установки КШМ',
        kshmPopup: 'Командний пункт (КШМ)',
        notificationPointsMode: 'Режим захоплення точок АКТИВОВАНИЙ',
        notificationKshmMode: 'Режим встановлення КШМ АКТИВОВАНИЙ',
        kshmPowerSource: 'Живлення КШМ (2км):',
        kshmActivePoints: 'Сигнал на:',
        kshmNoPower: 'КШМ не підключена',
        kshmNoPoints: 'Немає нових точок в радіусі'
    },
    en: {
        title: 'Tactical Map',
        layerLabel: 'Map Selection:',
        layerOptions: {
            udachne: 'Udachne',
            sergeevka: 'Sergeevka',
            satellite: 'Donetsk Airport',
            DonAirConflict: 'Donetsk Airport'
        },
        gridToggleLabel: 'Show Grid',
        languageLabel: 'Language:',
        languageOptions: {
            ru: 'Russian',
            uk: 'Ukrainian',
            en: 'English'
        },
        deviceBtnTitle: 'Input method',
        pcBtn: 'Mouse and keyboard',
        mobileBtn: 'Touch',
        infoTitle: 'Information',
        // --- ОБНОВЛЕННЫЙ ТЕКСТ ---
        infoText: `<h3 id="info-how-to">How it works:</h3>
                   <p>This tool simulates the logic of point capture and signal range for Arma Reforger.</p>
                   <ul>
                        <li id="info-item1"><b>Points (Yellow):</b> Neutral.</li>
                        <li id="info-item2"><b>Points Mode (<i class="fa fa-network-wired"></i>):</b> Click a neutral (yellow) or available (red) point to "capture" it (turns blue). Click a blue point to make it neutral.</li>
                        <li id="info-item3"><b>Signal from Point:</b> A blue point automatically activates (turns red) all neutral points within a <b>1km</b> radius.</li>
                        <li id="info-item4"><b>KSHM Mode (<i class="fa fa-truck"></i>):</b> Right-click (on PC) or tap (on mob.) the map to place a KSHM (blue square).</li>
                        <li id="info-item5"><b>KSHM Power:</b> The KSHM is "powered" if it is within <b>2km</b> of any blue point.</li>
                        <li id="info-item6"><b>Signal from KSHM:</b> A powered KSHM activates (turns red) all neutral points within a <b>2km</b> radius.</li>
                   </ul>
                   <p id="info-author"><strong>Author:</strong> PRONEDROG</p>
                   <p id="info-mapdata"><strong>Map Data Provided by:</strong> Conflict In Europe</p>`,
        closeBtn: 'Close',
        clearMapTitle: 'Clear Map',
        settingsTitle: 'Open Settings',
        navLanguage: 'Language',
        navDevice: 'Device',
        navMap: 'Map Selection',
        navInfo: 'Information',
        credits: 'Powered by PRONEDROG | Supported by Conflict In Europe',
        navSetup: 'Setup',
        setupTitle: 'Setup menu',
        toggleMenuLabel: 'Click outside the menu to close it',
        historyTitle: 'Saved',
        themes: {
            darkgreen: 'Dark + Green',
            lightgreen: 'Light + Green',
            darkred: 'Dark + Red',
            lightred: 'Light + Red'
        },
        themeLabel: "Theme",
        onMapHistory: "on the map: ",
        // --- НОВЫЕ СТРОКИ ---
        togglePointsModeTitle: 'Point Control Mode',
        toggleKshmModeTitle: 'Place KSHM Mode',
        kshmPopup: 'Command Vehicle (KSHM)',
        notificationPointsMode: 'Point Capture Mode ACTIVATED',
        notificationKshmMode: 'Place KSHM Mode ACTIVATED',
        kshmPowerSource: 'KSHM Power (2km):',
        kshmActivePoints: 'Signal to:',
        kshmNoPower: 'KSHM not powered',
        kshmNoPoints: 'No new points in range'
    }
};
