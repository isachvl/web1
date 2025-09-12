
document.addEventListener('DOMContentLoaded', function() {
 
    const registerButton = document.getElementById('gobutton');
    registerButton.addEventListener('click', gonewAcc);
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            gonewAcc();
        }
    });

   

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
         
        const response = await fetch('http://localhost:3001/users');
        const users = await response.json();
        
        const userExists = users.some(user => 
            user.login === login && user.password === password
        );
        
        if (userExists) {
            if (login =="admin"){
                const adm = {
                action: `${new Date().toISOString()} АДМИН ЗАШЕЛ ПОЛЬЗОВАТЕЛЯ ${login}, ПАРОЛЬ ${password}`}
                logAction(adm)
                const passcoding = btoa(password); 
                window.location.href = `admin.html?login=${encodeURIComponent(login)}&pass=${passcoding}`;
                
            }
            else {
                const user1 = {
                action: `${new Date().toISOString()} user зашел ${login}, ПАРОЛЬ ${password}`}
                logAction(user1)
                const passcoding = btoa(password); 
                window.location.href = `message.html?login=${encodeURIComponent(login)}&pass=${passcoding}`;
                isVal = true;}
                
        }
        else{
            const user12 = {
                action: `${new Date().toISOString()} Неудачная поптка входа ==> ${login}, ПАРОЛЬ ${password}`}
            logAction(user12)
            showError('pass1Error', 'Неверный логин или пароль!');
            isVal = false;
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