/*****************************************
* Module interact with users database,
* check user valid, send e-mail messages
*
*
*
* Модуль взаимодействия с БД пользователей,
* методы проверки данных на валидность,
* отправка почтовых сообщений.
* В mailOptions необходимо заполнить учетные
* данные почтового сервиса 
*****************************************/



const nodemailer = require('nodemailer')
const dbInteractor = require('./dbInteractor.js')
const domain = '127.0.0.1:30000';
const mailOptions = {
	host:'smtp.gmail.com', 
	port:465, 
	secure: true,
	username: '***@gmail.com',
	password: '***',
}
const REGISTRY_ACTION = 0
const REMIND_PASSWORD_ACTION = 1

let dbInteract = new dbInteractor.DbInteract

async function checkNewUser(userParams){
	console.log('new userParams=',userParams)
	if(!userParams) return {OK: true, Result:{Status:'error', errorText:'Request error'}}
	if((!userParams.loginReg) || (userParams.loginReg === '')) return {OK: true, Result:{Status:'error', errorText:'Login incorrect'}}
	if((!userParams.passReg) || (userParams.passReg === '')) return {OK: true, Result:{Status:'error', errorText:'Password incorrect'}}
	if(userParams.passReg !== userParams.repPassReg) return {OK: true, Result:{Status:'error', errorText:'Passwords not equal'}}
	let user = await getUserByLogin(userParams.loginReg) 
	if(user) return {OK: true, Result:{Status:'error', errorText:'User with this login already exist'}}
	user = await getUserByEMail(userParams.emailReg)
	if(user) return {OK: true, Result:{Status:'error', errorText:'User with this e-mail already exist'}}
	let activateCode = await dbInteract.addNewUser(userParams)
	sendConfirm(userParams.emailReg, activateCode)
	.catch((e)=>{console.log('error while send e-mail')})
	return {OK: true, Result:{Status:'ok'}}
}

async function checkFogetPassUser(userParams){
	if(!userParams) return {OK: true, Result:{Status:'error', errorText:'Request error'}}
	if(!userParams.emailReg) return {OK: true, Result:{Status:'error', errorText:'Invalid e-mail'}}
	let fogetUser = await getUserByEMail(userParams.emailReg)
	console.log('fogetUser=',fogetUser)
	if(!fogetUser) return {OK: true, Result:{Status:'error', errorText:'No such e-mail in database'}}
	let changePassCode = await dbInteract.changePassCode(fogetUser)
	console.log('changePassCode=',changePassCode)
	sendConfirm(userParams.emailReg, changePassCode, REMIND_PASSWORD_ACTION)
	.catch((e)=>{console.log('error while send e-mail')})
	return {OK: true, Result:{Status:'ok'}}
}

async function changePassword(userParams, cookie){
	if(!userParams) return {OK: true, Result:{Status:'error', errorText:'Request error'}}
	if((!userParams.passReg) || (userParams.passReg === '')) return {OK: true, Result:{Status:'error', errorText:'Password incorrect'}}
	if(userParams.passReg !== userParams.repPassReg) return {OK: true, Result:{Status:'error', errorText:'Passwords not equal'}}
	let res = await dbInteract.changePassword(userParams, cookie)
	return res
}

async function getUserByLogin(login){
	return await dbInteract.getUserByField('login',login)
}

async function getUserByEMail(email){
	return await dbInteract.getUserByField('email',email)
}

async function getUserBySession(sessionId){
	return await dbInteract.getUserByField('sessionid',sessionId)
}

async function getUserByActivateCode(activateCode){
	return await dbInteract.getUserByField('activatecode',activateCode)
}

async function checkUserLogin(userParams){
	console.log('login userParams=',userParams)
	if(!userParams) return {OK: true, Result:{Status:'error', errorText:'Request error'}}
	if((!userParams.login) || (userParams.login === '')) return {OK: true, Result:{Status:'error', errorText:'Login incorrect'}}
	if((!userParams.password) || (userParams.password === '')) return {OK: true, Result:{Status:'error', errorText:'Password incorrect'}}
	
	let res = await dbInteract.checkUserLogin(userParams)
	return res
}

async function checkUserLogout(userParams, cookie){
	if(!cookie) return {OK: true, Result:{Status:'error', errorText:'No session info'}}
	if(!userParams) return {OK: true, Result:{Status:'error', errorText:'Request error'}}
	if((!userParams.login) || (userParams.login === '')) return {OK: true, Result:{Status:'error', errorText:'Wrong user'}}

	let res = await dbInteract.checkUserLogout(userParams, cookie)
	return res
}


async function checkUserActivation(activateCode){
	activateCode = activateCode.slice(1);
	console.log('activateCode=',activateCode);
	let user = await getUserByActivateCode(activateCode)
	if(!user) return false
	await dbInteract.setUserActive(user)
	return true
}

async function checkRemindPassword(changePassCode){
	changePassCode = changePassCode.slice(1);
	console.log('changePassCode=',changePassCode);
	return dbInteract.checkRemindPassword(changePassCode)
}

async function sendConfirm(email,activateCode,action = REGISTRY_ACTION){
	
	let link = `<a href="http://${domain}/${activateCode}">ссылке</a>`;
	
	
	const confirmHtml=`
	<b>Подтверждение регистрации в сервисе 17bit</b>
	<p>Здравствуйте! Вы получили это письмо, потому что заполнили форму регистрации на сервисе подбора вентизделий 17bit.</p>
	<p>Для подтверждения регистрации, пожалуйста перейдите по ${link}</p>
	<p>Если это письмо пришло к Вам по ошибке, пожалуйста проигнорируйте его.</p>
	<hr>
	<p>С уважением,</p>
	<p>Команда сервиса 17bit</p>
    `;
	
	const remindPassHtml=`
	<b>Смена пароля в сервисе 17bit</b>
	<p>Здравствуйте! Вы получили это письмо, потому что заполнили форму замены пароля на сервисе подбора вентизделий 17bit.</p>
	<p>Для изменения пароля, пожалуйста перейдите по ${link}</p>
	<p>Если это письмо пришло к Вам по ошибке, пожалуйста проигнорируйте его.</p>
	<hr>
	<p>С уважением,</p>
	<p>Команда сервиса 17bit</p>
    `;
	
	let htmlText = (action === REGISTRY_ACTION)?confirmHtml:remindPassHtml
	let subjectText = (action === REGISTRY_ACTION)?'17bit Registration Confirm':'17bit Change Password Confirm'
	
	transporter = nodemailer.createTransport({
        /*host: mailOptions.host,
        port: mailOptions.port,
        secure: mailOptions.secure, // true for 465, false for other ports*/
		service: 'gmail',
        auth: {
            user: mailOptions.username, // generated ethereal user
            pass: mailOptions.password // generated ethereal password
        }
    });
	
    let info = await transporter.sendMail({
        from: '"17bit Company" <info@17bit.com>', // sender address
        to: email, // list of receivers
        subject: subjectText, // Subject line
        html: htmlText, // html body
    });
	
}

module.exports.checkNewUser = checkNewUser;
module.exports.checkUserLogin = checkUserLogin;
module.exports.checkUserActivation = checkUserActivation;
module.exports.getUserBySession = getUserBySession;
module.exports.checkUserLogout = checkUserLogout;
module.exports.checkFogetPassUser = checkFogetPassUser;
module.exports.checkRemindPassword = checkRemindPassword;
module.exports.changePassword = changePassword;