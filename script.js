
// Cookie
document.addEventListener('DOMContentLoaded', () => {
    // Элементы для приветствия пользователя и модальное окно для ввода имени
    const userGreeting = document.getElementById("user-greeting"); // ссылки на элемент с идентификатором
    const usernameModal = document.getElementById("username-modal");
    const saveUsernameButton = document.getElementById("save-username-button");

    // Функция для установки куки с именем, значением и сроком действия (в днях)
    const setCookie = (name, value, days) => { 
        const date = new Date(); 
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // установка даты истечения куки
        const expires = "expires=" + date.toUTCString(); // форматирование строки с датой истечения куки в формате UTC
        document.cookie = `${name}=${value};${expires};path=/`; // установка куки с именем, значением и датой истечения, а также с доступом ко всем страницам на домене (path=/)
    };

    // Функция для получения значения куки по имени
    const getCookie = (name) => {
        const nameEQ = name + "="; // создание строки, которая используется для поиска куки с указанным именем
        const ca = document.cookie.split(';'); // разделяет все куки, хранящиеся в document.cookie, по символу ;, создавая массив куки
        // Перебор всех куки, удаление пробелы и проверка, начинается ли куки с nameEQ. Если да, возвращение значения этой куки
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length); //удаление пробелов
            if (c.indexOf(nameEQ) === 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }
        return null;
    };

    // Проверка, есть ли куки с именем пользователя
    const checkUserNameCookie = () => {
        const username = getCookie("username"); // получение значение куки с именем "username".
        if (username) {  // если куки "username" существуют, то отображает приветствие с именем пользователя и скрывает модальное окно
            userGreeting.innerText = `Hello, ${username}!`;
            usernameModal.style.display = "none";
        } else {
            usernameModal.style.display = "block"; // если куки нет, то показывает модальное окно
        }
    };

    // Сохранение имени пользователя и установка куки при нажатии на кнопку
    saveUsernameButton.addEventListener("click", () => {
        const usernameInput = document.getElementById("username-input").value; // получение введенного пользователем имени
        if (usernameInput) {
            setCookie("username", usernameInput, 365); // если введено имя, установка куки с этим именем на 365 дней
            userGreeting.innerText = `Hello, ${usernameInput}!`; // приветствие
            usernameModal.style.display = "none"; // скрытие модального окна
        }
    });

    // Проверка куки при загрузке страницы
    checkUserNameCookie();


    // Calendar
    // Элементы для отображения дней, текущего месяца и года
    const daysTag = document.querySelector(".days"); // элемент, отображающий дни месяца
    const currentDate = document.getElementById("month-name"); // название месяца
    const currentYear = document.getElementById("year"); // текущий год
    const prevNextIcon = document.querySelectorAll("#month div"); // переключение между месяцами

    let date = new Date(); // текущая дата и время
    let currYear = date.getFullYear(); // текущий год
    let currMonth = date.getMonth(); // текущий месяц

    const months = ["January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"]; // Массив с названиями месяцев

    let events = {}; // объект для хранения событий для календаря.

    // Функция для отображения календаря
    const renderCalendar = () => {
        let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(); // определяет день недели, на который приходится первое число текущего месяца
        let lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(); // определяет последний день текущего месяца
        let lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(); // определяет день недели, на который приходится последний день текущего месяца
        let lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); // определяет последний день предыдущего месяца

        let liTag = ""; // переменная, в которой накапливаются HTML-теги для отображения дней месяца.

        // Отображение дней предыдущего месяца
        for (let i = firstDayofMonth; i > 0; i--) {
            liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
        }

        // Отображение дней текущего месяца
        for (let i = 1; i <= lastDateofMonth; i++) {
            let isToday = i === date.getDate() && currMonth === new Date().getMonth() &&
                currYear === new Date().getFullYear() ? "active" : "";
            liTag += `<li class="${isToday}" data-date="${currYear}-${currMonth + 1}-${i}">${i}</li>`;
        }

        // Отображение дней следующего месяца
        for (let i = lastDayofMonth; i < 6; i++) {
            liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
        }

        // Обновление названия месяца и года
        currentDate.innerText = months[currMonth]; // устанавливает текст месяца
        currentYear.innerText = currYear; // устанавливает текст года
        daysTag.innerHTML = liTag; // обновляет HTML внутри элемента с днями.

        // Добавление обработчика событий на каждый день
        //Каждый день, который не является "inactive", получает обработчик события на клик, 
        //который вызывает функцию openEventModal с датой этого дня.
        const days = document.querySelectorAll(".days li:not(.inactive)");
        days.forEach(day => {
            day.addEventListener("click", (e) => {
                openEventModal(e.target.dataset.date);
            });
        });
    };

    // Вызов функции отображения календаря
    renderCalendar();

    // Переключение между месяцами
    prevNextIcon.forEach(icon => {
        icon.addEventListener("click", () => { // при нажатии на элемент с ID "prev" или "next" изменяется текущий месяц (currMonth)
            currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

            if (currMonth < 0 || currMonth > 11) { // если новый месяц выходит за пределы диапазона [0, 11], также обновляется год (currYear)
                date = new Date(currYear, currMonth, new Date().getDate());
                currYear = date.getFullYear();
                currMonth = date.getMonth();
            } else {
                date = new Date();
            }
            renderCalendar();
        });
    });


    // Local Storage
    // Элементы модального окна для событий
    const modal = document.getElementById("event-modal");
    const closeModal = document.getElementsByClassName("close")[0]; //возвращает коллекцию всех элементов документа с классом close
    const saveEventButton = document.getElementById("save-event-button");
    const deleteEventsButton = document.getElementById("delete-events-button");
    let selectedDate = ""; //переменная для хранения текущей выбранной даты

    // Сохранение событий в локальное хранилище
    const saveEventsToLocalStorage = () => {
        localStorage.setItem('events', JSON.stringify(events)); // сохранение объекта events в локальное хранилище, преобразовывая его в строку JSON
    };

    // Загрузка событий из локального хранилища
    const loadEventsFromLocalStorage = () => {
        const eventsFromStorage = localStorage.getItem('events');
        if (eventsFromStorage) {
            events = JSON.parse(eventsFromStorage); // если данные есть, они парсятся в объект events, иначе events инициализируется пустым объектом
        } else {
            events = {};
        }
    };

    // Отображение событий
    const renderEvents = () => {
        const eventsContainer = document.getElementById("events-container");
        eventsContainer.innerHTML = "";

        if (events[selectedDate]) {
            events[selectedDate].forEach((event, index) => {
                const eventElem = document.createElement("li");  // если для выбранной даты существуют события, они добавляются в виде элементов списка с кнопками удаления
                eventElem.classList.add("event", event.category);
                eventElem.innerHTML = `${event.name} <button class="delete-event" data-index="${index}">&times;</button>`;
                eventsContainer.appendChild(eventElem);
            });
        }
    };

    // Сохранение события при нажатии на кнопку и сохранение в массив
    saveEventButton.addEventListener("click", () => {
        const eventName = document.getElementById("event-input").value;
        const eventCategory = document.getElementById("event-category").value;

        if (!events[selectedDate]) {
            events[selectedDate] = [];
        }

        events[selectedDate].push({ name: eventName, category: eventCategory });
        document.getElementById("event-input").value = "";
        renderEvents();
        saveEventsToLocalStorage();
    });

    // Удаление всех событий на выбранную дату. Удаляет все события и обновляет локальное хранилище
    deleteEventsButton.addEventListener("click", () => {
        if (events[selectedDate]) {
            delete events[selectedDate];
            renderEvents();
            saveEventsToLocalStorage();
        }
    });

    // Удаление отдельного события
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-event")) {
            const index = e.target.dataset.index;
            events[selectedDate].splice(index, 1);
            renderEvents();
            saveEventsToLocalStorage();
        }
    });

    // Открытие модального окна для выбранной даты
    const openEventModal = (date) => {
        selectedDate = date;
        modal.style.display = "block";
        renderEvents();
    };

    // Закрытие модального окна
    closeModal.onclick = function () {
        modal.style.display = "none";
    };

    // Закрытие модального окна при клике вне его области
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    // Сохранение событий при закрытии страницы
    window.addEventListener('beforeunload', () => {
        saveEventsToLocalStorage();
    });

    // Загрузка и отображение событий при загрузке страницы
    loadEventsFromLocalStorage();
    renderCalendar();
    renderEvents();

    // Time
    // Элемент для отображения времени
    const worldTimeElement = document.getElementById('world-time');

    // Функция для получения и отображения мирового времени
    const fetchWorldTime = () => {
        fetch('https://worldtimeapi.org/api/timezone/Europe/Kyiv') // API запрос
            .then(response => response.json()) // преобразование ответа в формат JSON
            .then(data => { // обработка полученных данных
                const datetime = new Date(data.datetime); // создание объекта Date из строки даты и времени полученной из API
                const hours = datetime.getHours().toString().padStart(2, '0'); // получение текущего часа
                const minutes = datetime.getMinutes().toString().padStart(2, '0'); // получение текущей минуты
                const seconds = datetime.getSeconds().toString().padStart(2, '0'); // получение текущей секунды
                worldTimeElement.innerText = `${hours}:${minutes}:${seconds}`; // обновление текстового содержимого элемента worldTimeElement
            })
            .catch(error => {
                worldTimeElement.innerText = 'Ошибка при получении времени';
                console.error('Ошибка при получении мирового времени:', error);
            });
    };

    // Обновление времени каждую секунду
    setInterval(fetchWorldTime, 1000); // установка интервала в 1 секунду 
    fetchWorldTime();
});
