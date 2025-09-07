// Ждем полной загрузки DOM перед выполнением скрипта
document.addEventListener('DOMContentLoaded', function() {
    // Находим кнопку регистрации и добавляем обработчик события
    const registerButton = document.getElementById('registerButton');
    registerButton.addEventListener('click', gonewAcc);
});

async function gonewAcc(){
    const login = document.getElementById('login').value.trim();//trim удаляет пробелы
    const email = document.getElementById('mail').value.trim();
    const password = document.getElementById('password').value;
    const repitPassword = document.getElementById('repitpassword').value;
    let isVal = true;
        
    resetErrors();
    if (login == ''){
        showError('loginError','заполните логин!');
        isVal =false;
    }
    if (login!='' && login.length<3){
        showError('loginError','логин должен быть больше 3 символов!');
        isVal=false;
    }
    if (email == ''){
        showError('emailError','Заполните маил!');
        isVal =false;
    }
    if (email != '' && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)){
        showError('emailError','Неверный формат, должен быть ***@.**!');
        isVal =false;
    }
    if (password == ''){
        showError('pass1Error','Заполните пароль');
        isVal =false;
    }
    if (repitPassword== ''){
        showError('pass2Error','Повторите пароль!');
        isVal =false;
    }
    if (password!= '' && password.length < 8) {
        showError('pass1Error','Пароль мининмум из 8 символов!');
        isVal =false;
    }
    if (repitPassword!= '' && repitPassword.length < 8) {
        showError('pass2Error','Пароль мининмум из 8 символов!');
        isVal =false;
    }
    if(password != '' && repitPassword != '' && password!=repitPassword && repitPassword.length > 8 && password.length > 8){
        showError('pass2Error','пароли не совпадают!');
        isVal =false;
    }
    
    if (isVal) {
        try {
            const response = await fetch('http://localhost:3001/users');
            const users = await response.json();
            
            const userExists = users.some(user => 
                user.login === login || user.email === email
            );
            
            if (userExists) {
                 
                showError('Error', 'Пользователь с таким логином или email уже существует!');
                isVal = false;
            }
            
        } catch (error) {
            console.error('Ошибка при проверке:', error);
            showError('Error', 'Ошибка проверки данных');
            isVal = false;
        }
    }
    if (isVal) {
        // 1. Подготавливаем данные
        const userData = {
            login: login,
            email: email,
            password: password,
            registeredAt: new Date().toISOString()
        };
        
        // 2. Отправляем на сервер
        try {

            const result = await saveToDatabase(userData);
            alert('✅ Успех! Пользователь добавлен в базу!');
            
            // Очищаем форму
            document.getElementById('login').value = '';
            document.getElementById('mail').value = '';
            document.getElementById('password').value = '';
            document.getElementById('repitpassword').value = '';
            window.location.href = 'hi.html';
            
        } catch (error) {
            alert('❌ Ошибка сохранения!');
        }
    }
}


// Функция отправки в БД
async function saveToDatabase(userData) {
    const response = await fetch('http://localhost:3001/users', {
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

function showError(elem,message){
    const errelem=document.getElementById(elem);
    errelem.textContent=message;
    errelem.style.display='block';
    
}
 
function resetErrors() {
    const errors = document.querySelectorAll('.error');
    errors.forEach(error => {
        error.textContent = '';
        error.style.display = 'none';
    });
}