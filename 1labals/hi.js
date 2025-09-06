// Ждем полной загрузки DOM перед выполнением скрипта
document.addEventListener('DOMContentLoaded', function() {
    // Находим кнопку регистрации и добавляем обработчик события
    const registerButton = document.getElementById('gobutton');
    registerButton.addEventListener('click', gonewAcc);
});

async function gonewAcc(){
    const login = document.getElementById('login').value.trim();//trim удаляет пробелы
   
    const password = document.getElementById('password').value;
    
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
     
    if (password == ''){
        showError('pass1Error','Заполните пароль');
        isVal =false;
    }
     
    if (password!= '' && password.length < 8) {
        showError('pass1Error','Пароль мининмум из 8 символов!');
        isVal =false;
    }
    if (isVal) {
        try {
            const response = await fetch('http://localhost:3001/users');
            const users = await response.json();
            
            const userExists = users.some(user => 
                user.login === login || user.password === password
            );
            
            if (userExists) {
                 
                window.location.href = 'message.html';
                isVal = true;
                 
            }
            else{
                showError('pass1Error', 'Неверный логин или пароль!');
                isVal = false;
            }
            
        } catch (error) {
            console.error('Ошибка при проверке:', error);
            showError('Error', 'Ошибка проверки данных');
            isVal = false;
        }
    } 
    
    
     
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