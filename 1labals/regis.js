// Ждем полной загрузки DOM перед выполнением скрипта
document.addEventListener('DOMContentLoaded', function() {
    // Находим кнопку регистрации и добавляем обработчик события
    const registerButton = document.getElementById('registerButton');
    registerButton.addEventListener('click', gonewAcc);
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            window.location.href = `hi.html`;
        }
    });
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
        
        const response = await fetch('http://localhost:3001/users');
        const users = await response.json();
        
        const userExists = users.some(user => 
            user.login === login || user.email === email
        );
        
        if (userExists) {
                const loguserdoingbad = {
                action: `${new Date().toISOString()} Неудачная попытка регистрации ПОЛЬЗОВАТЕЛЯ ${login}, ПАРОЛЬ ${password}, ПОЧТОЙ ${email}`
            };
            logAction(loguserdoingbad)
            showError('Error', 'Пользователь с таким логином или email уже существует!');
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
        const loguserdoing = {
            action: `${new Date().toISOString()} ЗАРЕГЕСТОВАЛСЯ НОВЫЙ ПОЛЬЗОВАТЕЛЯ ${login}, ПАРОЛЬ ${password}, ПОЧТОЙ ${email}`
        };
        
        
            logAction(loguserdoing)
            const result = await saveToDatabase(userData);
            
            
            // Очищаем форму
            document.getElementById('login').value = '';
            document.getElementById('mail').value = '';
            document.getElementById('password').value = '';
            document.getElementById('repitpassword').value = '';
            window.location.href = 'hi.html';
            
       
    }
}
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