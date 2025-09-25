
document.addEventListener('DOMContentLoaded',async function() {
    
    const registerButton = document.getElementById('gobutton');
    const reg = document.getElementById('regis');
    registerButton.addEventListener('click', gonewAcc);
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            gonewAcc();
        }
    });
    reg.addEventListener('click', goreg);
    const toktok1 = await fetch('http://localhost:3001/token');
    const tokenbd1 = await toktok1.json();
    token = tokenbd1.registeredAt;
    checkAndCleanTokens()
    


});
// Функция проверки токенов и удаления старых
async function checkAndCleanTokens() {
    try {
        const response = await fetch('http://localhost:3001/token');
        let tokenbd = await response.json();

        const now = new Date();

        for (const t of tokenbd) {
            const tokenDate = new Date(t.registeredAt);
            const diffMinutes = (now - tokenDate) / (1000 * 60); // разница в минутах
            if (diffMinutes > 30) {
                await deleteToken(t.id); // удаляем устаревший токен
                
            }
        }
    } catch (err) {
        console.error('Ошибка при проверке токенов:', err);
    }
}
async function deleteToken(tokenId) {
    await fetch(`http://localhost:3001/token/${tokenId}`, {
        method: 'DELETE'
    });
}

function goreg(){ 
    window.location.href = '../regis/reg.html';
}
async function gonewAcc(){
    const date = new Date();
    const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
    };
    let token;
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
            const toktok = await fetch('http://localhost:3001/token');
            const tokenbd = await toktok.json();
            const ustoken = tokenbd.some(user => 
            user.login === login && user.token != null
            );
            if (ustoken){
                const userToken = tokenbd.find(t => t.login === login && t.token != null);
                token = userToken.token;
            }
            if(!ustoken) {

            
                var rand = function() {
                        return Math.random().toString(36).substr(2);  
                    };
                token = rand()+rand()
                const tokenuser = {
                    login: login,
                    token: token,
                    registeredAt: new Date().toISOString()
                };
                savetoken(tokenuser)
                };
                


                
            }
            if (token!=null){
                if (login =="admin"){
                    const adm = {
                    action: `${(new Intl.DateTimeFormat('ru-RU', options).format(date))} АДМИН ЗАШЕЛ ПОЛЬЗОВАТЕЛЯ ${login}, ПАРОЛЬ ${password}`}
                    logAction(adm)
                     
                    
                    window.location.href = `../admin/admin.html?token=${encodeURIComponent(token)}`;
                    
                }

                else {
                    
                    const user1 = {
                    action: `${(new Intl.DateTimeFormat('ru-RU', options).format(date))} user зашел ${login}, ПАРОЛЬ ${password}`}
                    logAction(user1)
                     
                    window.location.href = `../message/message.html?token=${encodeURIComponent(token)}`;
                    isVal = true;}
            }
                
        }
        else{
            
            const user12 = {
                action: `${(new Intl.DateTimeFormat('ru-RU', options).format(date))} Неудачная поптка входа ==> ${login}, ПАРОЛЬ ${password}`}
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

async function savetoken(tokenuser) {
    const response = await fetch('http://localhost:3001/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tokenuser)
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