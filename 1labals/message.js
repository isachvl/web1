// Ждем когда вся страница загрузится
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const login = urlParams.get('login');
    const encodedPass = urlParams.get('pass');
    const password = atob(encodedPass);
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
    async function peoplelist(){
        const response = await fetch('http://localhost:3001/users');
        const users = await response.json();
        const listuser = [];
        users.forEach(user => {
            listuser.push(user.login);
        });
        console.log('Полученные пользователи:', listuser);
    }
    

     
     
    const userElement = document.querySelector('.user');
    
    // Если такой элемент существует
    if (userElement) {
        // Вставляем в него текст с именем пользователя
        userElement.textContent = login;
    }
    const searchInput = document.getElementById('screan');
    const peopleContainer = document.getElementById('people');
    async function searchUsers(query) {
                try {
                    const response = await fetch('http://localhost:3001/users');
                    const allUsers = await response.json();
                    
                    // Фильтруем пользователей по запросу (исключая текущего пользователя)
                    const filteredUsers = allUsers.filter(user => 
                        user.login.toLowerCase().includes(query.toLowerCase()) && 
                        user.login !== login
                    );
                    
                    return filteredUsers;
                    
                } catch (error) {
                    console.error('Ошибка при поиске пользователей:', error);
                    return [];
                }
            }
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
                        <button class="add-friend-btn" data-userid="${user.id}">Добавить</button>
                    `;
                    peopleContainer.appendChild(userElement);
                });
                
                // Добавляем обработчики для кнопок "Добавить"
                document.querySelectorAll('.add-friend-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const userId = this.getAttribute('data-userid');
                        addToFriends(userId, this);
                    });
                });
            }
            // Обработчик события для поля поиска
            searchInput.addEventListener('keyup', async function(event) {
                if (event.key === 'Enter') {
                    const query = this.value.trim();
                    
                    if (query === '') {
                        peopleContainer.innerHTML = '<div class="empty-state">Введите имя для поиска</div>';
                        return;
                    }
                    
                    // Показываем сообщение о загрузке
                    peopleContainer.innerHTML = '<div class="empty-state">Поиск пользователей...</div>';
                    
                    // Ищем пользователей
                    const users = await searchUsers(query);
                    
                    // Отображаем результаты
                    displayUsers(users);
                }
            });
});
