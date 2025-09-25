 
document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
     
    const encodedPass = urlParams.get('token');
    const token = encodedPass;
    const response33 = await fetch('http://localhost:3001/token');
    const tokenjson = await response33.json();
    const response = await fetch('http://localhost:3001/users');
    const users = await response.json();
    const response1 = await fetch('http://localhost:3001/addfriends');
    const allUsers = await response1.json();
    const response12 = await fetch('http://localhost:3001/messages');
    const messagepep = await response12.json();
 
    const userToken = tokenjson.find(t => t.token === token);
    if (!userToken) {
        window.location.href = '../start/hi.html';
        return;
    }
    // Теперь находим пользователя по логину из токена
    const user = users.find(u => u.login === userToken.login);
    if (!user) {
        window.location.href = '../start/hi.html';
        return;
    }
    
    const login = user.login;  
    
    

     
   
    const userElement = document.querySelector('.user');
    
 
    if (userElement) {
        
        userElement.textContent = login;
    }
    const searchInput = document.getElementById('screan');
    const peopleContainer = document.getElementById('people');
    const chatHeader = document.querySelector('.chat-header');  
    const messagesContainer = document.querySelector('.messages-container');  
    const pleasechat= document.querySelector('.pleasechat'); 
    // получаем пользователей и филтруем их что бы не наш
    async function searchUsers(query) {
                try {
                   
                    
                    
                    const filteredUsers = users.filter(user => 
                        user.login.toLowerCase().includes(query.toLowerCase()) && 
                        user.login !== login
                    );
                    
                    return filteredUsers;
                    
                } catch (error) {
                    console.error('Ошибка при поиске пользователей:', error);
                    return [];
                }
            }
    // отображаем пользователя  и добовляем ему кнопку 
    function displayUsers(users) {
        if (users.length === 0) {
            peopleContainer.innerHTML = '<div class="empty-state">Пользователи не найдены</div>';
            return;
        }
        peopleContainer.innerHTML = '';
        
        users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.className = 'user-item';
            userElement.innerHTML = `
                <span class="user-name">${user.login}</span>
                <button class="add-friend-btn" data-userid="${user.id}">+</button>
            `;
            peopleContainer.appendChild(userElement);
            userElement.querySelector('.user-name').addEventListener('click', function() {
                openChat(user.login);
            });
            userElement.querySelector('.add-friend-btn').addEventListener('click', function() {
                addfriend(user.login);
            });
        });      
    }
    async function addfriend(username) {
        const nameznach = 1;
        // Проверяем, не добавлен ли уже этот друг
        const userExists = allUsers.some(user => 
            user.login === login && user.tousernam === username
        );

        if (!userExists) {
            const date = new Date();
            const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
            };
            // Если ещё нет — добавляем
            const user123 = {
                action: `${(new Intl.DateTimeFormat('ru-RU', options).format(date))} Отпралена заявка в друзья от ${login}, к ${username} `}
            logAction(user123)
            const newMessage = {
                login: login,
                tousernam: username,
                add: nameznach
            };

            await fetch("http://localhost:3001/addfriends", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newMessage)
            });

                
        }  
        
    }
    // открываем чат и удаляем сообщение выбери чат...
    function openChat(username) {
         
        chatHeader.textContent = username;

         
         
        currentChatUser = username;
         
        
        if (pleasechat) {
            pleasechat.remove();
        }

        loadmessaged(currentChatUser)
    }
    // Обработчик события для поля поиска , слушатель закидывает нашего пользователя все начинает 
    searchInput.addEventListener('input', async function(event) {
            const query = document.getElementById('screan').value.trim();
            const users = await searchUsers(query);
            displayUsers(users);
        
    });
    // задаем с кем общаеся,  и отправляем сообщение на сервер
    const sendButton = document.querySelector('.send-button');
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            sendmessage();
        }
    });
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            window.location.href = `../start/hi.html`;
        }
    });
    sendButton.addEventListener("click", function(e) {
        sendmessage();
         
    });


    let currentChatUser = null;  
    async function sendmessage() {
        if (currentChatUser==null){
            return;
        }
        const text = document.getElementById('message-input').value.trim();
        if (text === "") return;
            const user12 = {
                    action: `${new Date().toISOString()} Отпралено сообщение от ${login}, к ${currentChatUser} сообщение ${text}`}
            logAction(user12)
                 
            const newMessage = {
            from: login,
            to: currentChatUser,
            text: text
        };
        await fetch("http://localhost:3001/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newMessage)
        });

        const messageDiv = document.createElement("div");
        messageDiv.className = "message sent";
        messageDiv.textContent = newMessage.text;
        messagesList.appendChild(messageDiv);
        messageInput.value = "";
    }
    // отображаем переписку с джос
    async function loadmessaged(user) {
       
        const chatMessages = messagepep.filter(msg=>(msg.from === login && msg.to === user)||(msg.from === user && msg.to === login));
        messagesList.innerHTML = ""
        chatMessages.forEach(msg => {
            const messageDiv = document.createElement("div");
            messageDiv.className = msg.from === login ? "message sent" : "message received";
            messageDiv.textContent = msg.text;
            messagesList.appendChild(messageDiv);
        });
        
        
        
    }
    //поля ввода
    const messageInput = document.getElementById('message-input');
//     //Даём ему класс messages-list.

// Вставляем его внутрь messagesContainer, но перед блоком ввода сообщения (.message-input-container).
    let messagesList = document.createElement('div');
    messagesList.className = 'messages-list';
    messagesContainer.insertBefore(messagesList, document.querySelector('.message-input-container'));
    messageInput.value = "";
        // обработчик кнопки "Друзья"
    const friendsButton = document.querySelector('.friend-button');
    friendsButton.addEventListener("click", async function() {
        // ищем взаимные дружбы (у обоих add === 1)
        const myFriends = allUsers.filter(f1 =>
            f1.login === login && f1.add === 1 &&
            allUsers.some(f2 =>
                f2.login === f1.tousernam &&
                f2.tousernam === login &&
                f2.add === 1
            )
        );

        if (myFriends.length === 0) {
            peopleContainer.innerHTML = '<div class="empty-state">У вас пока нет друзей ;(</div>';
            return;
        }

        // показываем друзей
        peopleContainer.innerHTML = '';
        myFriends.forEach(f => {
            const friendElement = document.createElement('div');
            friendElement.className = 'user-item';
            friendElement.innerHTML = `
                <span class="user-name">${f.tousernam}</span>
            `;
            peopleContainer.appendChild(friendElement);

            // открытие чата по клику
            friendElement.querySelector('.user-name').addEventListener('click', function() {
                openChat(f.tousernam);
            });
        });

        
    });
    async function logAction(userData) {
        const response = await fetch('http://localhost:3001/logAction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            throw new Error('Ошибка сервера');
        }
        
        return await response.json();
    }

});
