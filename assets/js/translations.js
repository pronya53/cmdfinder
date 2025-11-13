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
                        <li id="info-item3"><b>Сигнал от Точки (1км):</b> Синяя точка автоматически активирует (делает красными) все нейтральные точки в радиусе <b>1км</b>.</li>
                        <li id="info-item4"><b>Режим КШМ (<i class="fa fa-truck"></i>):</b> Нажмите ПКМ (на ПК) или тапните (на моб.) по карте, чтобы поставить КШМ (синий квадрат).</li>
                        <li id="info-item5"><b>Питание КШМ (2км):</b> КШМ "запитывается", если находится в радиусе <b>2км</b> от любой <b>синей</b> (захваченной) точки.</li>
                        <li id="info-item6"><b>Сигнал от КШМ (2км):</b> Запитанная КШМ активирует (делает красными) все нейтральные точки в радиусе <b>2км</b>.</li>
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
        themeLabel: "Тема",
        themes: {
            darkgreen: 'Темная + Зелёный',
            lightgreen: 'Светлая + Зелёный',
            darkred: 'Темная + Красный',
            lightred: 'Светлая + Красный'
        },
        togglePointsModeTitle: 'Режим управления точками',
        toggleKshmModeTitle: 'Режим установки КШМ',
        kshmPopup: 'Командный пункт (КШМ)',
        notificationPointsMode: 'Режим захвата точек АКТИВИРОВАН',
        notificationKshmMode: 'Режим установки КШМ АКТИВИРОВАН',
        kshmPowerSource: 'Питание КШМ (2км):',
        kshmActivePoints: 'Сигнал на:',
        kshmNoPower: 'КШМ не запитана',
        kshmNoPoints: 'Нет новых точек в радиусе',
        
        // --- ПЕРЕВОДЫ НАЗВАНИЙ ТОЧЕК ---
        pointNames: {
            udachne: {
                1: "Торговая Площадь",
                2: "Заправка",
                3: "Карго",
                4: "Ж/Д Станция",
                5: "Резервный Двор",
                6: "Ферма",
                7: "Школа",
                8: "Завод",
                9: "Военная База",
                10: "Стройка",
                11: "Складской Комплекс"
            },
            sergeevka: {
                1: "Окопы",
                2: "Западный Аванпост",
                3: "Восточный Аванпост",
                4: "Завод",
                5: "Колхоз",
                6: "Заправка",
                7: "Опорный Пункт",
                8: "Ферма",
                9: "Ж/Д Станция",
                10: "Школа",
                11: "Стройплощадка",
                12: "Склады"
            }
        }
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
                        <li id="info-item3"><b>Сигнал від Точки (1км):</b> Синя точка автоматично активує (робить червоними) усі нейтральні точки в радіусі <b>1км</b>.</li>
                        <li id="info-item4"><b>Режим КШМ (<i class="fa fa-truck"></i>):</b> Натисніть ПКМ (на ПК) або тапніть (на моб.) по карті, щоб поставити КШМ (синій квадрат).</li>
                        <li id="info-item5"><b>Живлення КШМ (2км):</b> КШМ "отримує живлення", якщо знаходиться в радіусі <b>2км</b> від будь-якої <b>синьої</b> (захопленої) точки.</li>
                        <li id="info-item6"><b>Сигнал від КШМ (2км):</b> КШМ, що має живлення, активує (робить червоними) усі нейтральні точки в радіусі <b>2км</b>.</li>
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
        themeLabel: "Тема",
        themes: {
            darkgreen: 'Темна + Зелений',
            lightgreen: 'Світла + Зелений',
            darkred: 'Темна + Червоний',
            lightred: 'Світла + Червоний'
        },
        togglePointsModeTitle: 'Режим керування точками',
        toggleKshmModeTitle: 'Режим установки КШМ',
        kshmPopup: 'Командний пункт (КШМ)',
        notificationPointsMode: 'Режим захоплення точок АКТИВОВАНИЙ',
        notificationKshmMode: 'Режим встановлення КШМ АКТИВОВАНИЙ',
        kshmPowerSource: 'Живлення КШМ (2км):',
        kshmActivePoints: 'Сигнал на:',
        kshmNoPower: 'КШМ не підключена',
        kshmNoPoints: 'Немає нових точок в радіусі',
        
        // --- ПЕРЕВОДЫ НАЗВАНИЙ ТОЧЕК ---
        pointNames: {
            udachne: {
                1: "Торгова Площа",
                2: "Заправка",
                3: "Карго",
                4: "Рейвей стейшн",
                5: "Резервний двір",
                6: "Ферма",
                7: "Школа",
                8: "Завод",
                9: "Мілітари",
                10: "Стройка",
                11: "Складский комплекс"
            },
            sergeevka: {
                1: "Окопи",
                2: "Західний граничний аванпост",
                3: "Східний граничний аванпост",
                4: "Завод",
                5: "Колгосп",
                6: "Заправка",
                7: "Опорний пункт",
                8: "Ферма",
                9: "Залізнична станція",
                10: "Школа",
                11: "Буд. Майданчик",
                12: "Склади"
            }
        }
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
                        <li id="info-item3"><b>Signal from Point (1km):</b> A blue point automatically activates (turns red) all neutral points within a <b>1km</b> radius.</li>
                        <li id="info-item4"><b>KSHM Mode (<i class="fa fa-truck"></i>):</b> Right-click (on PC) or tap (on mob.) the map to place a KSHM (blue square).</li>
                        <li id="info-item5"><b>KSHM Power (2km):</b> The KSHM is "powered" if it is within <b>2km</b> of any <b>blue</b> (captured) point.</li>
                        <li id="info-item6"><b>Signal from KSHM (2km):</b> A powered KSHM activates (turns red) all neutral points within a <b>2km</b> radius.</li>
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
        themeLabel: "Theme",
        themes: {
            darkgreen: 'Dark + Green',
            lightgreen: 'Light + Green',
            darkred: 'Dark + Red',
            lightred: 'Light + Red'
        },
        togglePointsModeTitle: 'Point Control Mode',
        toggleKshmModeTitle: 'Place KSHM Mode',
        kshmPopup: 'Command Vehicle (KSHM)',
        notificationPointsMode: 'Point Capture Mode ACTIVATED',
        notificationKshmMode: 'Place KSHM Mode ACTIVATED',
        kshmPowerSource: 'KSHM Power (2km):',
        kshmActivePoints: 'Signal to:',
        kshmNoPower: 'KSHM not powered',
        kshmNoPoints: 'No new points in range',

        // --- ПЕРЕВОДЫ НАЗВАНИЙ ТОЧЕК ---
        pointNames: {
            udachne: {
                1: "Trade Square",
                2: "Gas Station",
                3: "Cargo",
                4: "Railway Station",
                5: "Reserve Yard",
                6: "Farm",
                7: "School",
                8: "Factory",
                9: "Military Base",
                10: "Construction Site",
                11: "Warehouse Complex"
            },
            sergeevka: {
                1: "Trenches",
                2: "Western Outpost",
                3: "Eastern Outpost",
                4: "Factory",
                5: "Kolkhoz",
                6: "Gas Station",
                7: "Strongpoint",
                8: "Farm",
                9: "Railway Station",
                10: "School",
                11: "Construction Site",
                12: "Warehouses"
            }
        }
    }
};
