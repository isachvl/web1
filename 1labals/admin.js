document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const login = urlParams.get("login");
    const encodedPass = urlParams.get("pass");
    const password = atob(encodedPass);

    const peopleContainer = document.getElementById("people");
    const chatHeader = document.querySelector(".chat-header");
    const messagesContainer = document.querySelector(".messages-container");

    let messagesList = document.createElement("div");
    messagesList.className = "messages-list";
    messagesContainer.insertBefore(messagesList, document.querySelector(".message-input-container"));

    let selectedUsers = [];
    async function userqstion(){ 
            const response = await fetch('http://localhost:3001/users');
            const users = await response.json();
            const userExists = users.some(user => 
                user.login === login && user.password === password
            );
            
            if (userExists) {
                return
                 
            }
            else{
                 window.location.href = `hi.html`;
            }

    }
    userqstion()
    // 1. Загружаем всех пользователей
    async function loadUsers() {
        
        const response = await fetch("http://localhost:3001/users");
        const allUsers = await response.json();

        // очищаем контейнер
        peopleContainer.innerHTML = "";

        allUsers.forEach(user => {
            if (user.login === login) return; // исключаем себя

            const userRow = document.createElement("div");
            userRow.className = "user-row";
            userRow.innerHTML = `
                <label>
                    <input type="checkbox" class="user-checkbox" value="${user.login}">
                    ${user.login}
                </label>
            `;
            peopleContainer.appendChild(userRow);
        });

        // Навешиваем обработчики на чекбоксы
        document.querySelectorAll(".user-checkbox").forEach(checkbox => {
            checkbox.addEventListener("change", handleCheckboxChange);
        });
         
    }

    //Ограничение на выбор максимум 2-х
    function handleCheckboxChange(e) {
        const checkedBoxes = Array.from(document.querySelectorAll(".user-checkbox:checked")); //array
        console.log(checkedBoxes) ;
        if (checkedBoxes.length > 2) {
            e.target.checked = false; // снимаем лишний выбор
            return;
        }

        selectedUsers = checkedBoxes.map(cb => cb.value);// сприменяем функцию для всех чекс боксовчерез мапо
        updateChat();
    }

    //Обновление чата
    async function updateChat() {
        messagesList.innerHTML = "";

        if (selectedUsers.length === 0) {
            chatHeader.textContent = "Выберите пользователей";
            return;
        }

        if (selectedUsers.length === 1) {
            chatHeader.textContent = `Выберите еще  одного пользователя`;
        } else {
            chatHeader.textContent = `Переписка: ${selectedUsers.join(" и ")}`;
        }

         
    const response = await fetch("http://localhost:3001/messages");
    const allMessages = await response.json();
        
    
    const chatMessages = allMessages.filter(msg => {
            if (selectedUsers.length === 2) {
            return (
                    
                (selectedUsers.includes(msg.from) && selectedUsers.includes(msg.to))
            );
        }
        return false;
    });

    chatMessages.forEach(msg => {
        const messageDiv = document.createElement("div");
        messageDiv.className = msg.from === login ? "message sent" : "message received";
        messageDiv.textContent = `${msg.from}: ${msg.text}`;
        messagesList.appendChild(messageDiv);
    });
        
    }

    // Запускаем
    loadUsers();
        // КНОПКА "ЛОГИ" 
    const logsButton = document.querySelector(".friend-button");

    logsButton.addEventListener("click", loadLogs);

    async function loadLogs() {
        messagesList.innerHTML = ""; // очищаем чат
        chatHeader.textContent = "Журнал действий";

        
        const response = await fetch("http://localhost:3001/logAction");
        const logs = await response.json();

        if (logs.length === 0) {
            const empty = document.createElement("div");
            empty.textContent = "Логи пусты";
            messagesList.appendChild(empty);
            return;
        }

        // создаём таблицу
        const table = document.createElement("table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";

        // заголовки
        const thead = document.createElement("thead");
        thead.innerHTML = `
            <tr style="background:#0aca8d;color:white">
                <th style="padding:5px;border:1px solid #ccc;">Действие</th>
            </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement("tbody");

        logs.forEach(log => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="padding:5px;border:1px solid #ccc;">${log.action || JSON.stringify(log)}</td>
            `;
            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        messagesList.appendChild(table);

        
    }
});

