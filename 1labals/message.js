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
    // Функция для получения имени из URL
     
     
    const userElement = document.querySelector('.user');
    
    // Если такой элемент существует
    if (userElement) {
        // Вставляем в него текст с именем пользователя
        userElement.textContent = login;
    }
});
