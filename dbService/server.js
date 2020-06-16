/*****************************************
* Web service module: request routing, 
* handle request s of auth and recovery password
*
*
* Модуль веб-сервера, роутинг запросов,
* обработка запросов подтверждения регистрации 
* и восстановления пароля
*****************************************/


const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const accountManager = require('./accountManager.js')
const app = express()
const PORT = 30000
const DIR='../build/'

app.use(cookieParser());
app.use(bodyParser.json());

app.use(function (request, response, next) {
	let host = request.get('origin') || '*'
    response.setHeader('Access-Control-Allow-Origin', host)
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
    response.setHeader('Access-Control-Allow-Credentials', true)
    next()
});

app.use('/',express.static(DIR))
app.use('/changePass',express.static(DIR))
app.use(express.json())

app.get('/get-current-user', (request, response) => {
  let cookie = request.cookies ? request.cookies.session : undefined
  accountManager.getUserBySession(cookie)
  .then(currentUser => {
	  if (currentUser){
		response.send(JSON.stringify({login: true, name: currentUser}))
		console.log('user ok')
	  }else{
		response.send(JSON.stringify({login:false}))
		console.log('cookie not exists')
	  }
  })
})

app.post('/registry-user', (request, response) => {
	accountManager.checkNewUser(request.body)
	.then(checkUser => {
		response.send(JSON.stringify(checkUser))
	})
})

app.post('/remind-pass', (request, response) => {
	accountManager.checkFogetPassUser(request.body)
	.then(checkUser => {
		response.send(JSON.stringify(checkUser))
	})
})

app.post('/change-password', (request, response) => {
    let cookie = request.cookies ? request.cookies.session : undefined
	accountManager.changePassword(request.body, cookie)
	.then(checkUser => {
		response.send(JSON.stringify(checkUser))
	})
})

app.post('/login-user', (request, response) => {
	console.log('login.body=',request.body)
	accountManager.checkUserLogin(request.body)
	.then(checkUser => {
		console.log('checkUser=',checkUser)
		response.send(JSON.stringify(checkUser))
	})
})

app.post('/logout-user', (request, response) => {
	let cookie = request.cookies ? request.cookies.session : undefined
	console.log('logout.body=',request.body, cookie)
	accountManager.checkUserLogout(request.body, cookie)
	.then(checkUser => {
		response.send(JSON.stringify(checkUser))
	})
})

app.get('*', (request, response) => {
	console.log(request.url)
	if(request.url.length<2){
		response.redirect('/')
		return;
	}
	if(request.url[1] === 'r'){
		accountManager.checkRemindPassword(request.url)
		.then(sessionId => {
			if(sessionId){
				response.cookie('session',sessionId)
				response.redirect('/changePass')
			}
		})
		return
	}else{
		accountManager.checkUserActivation(request.url)
		.then(res => {
			if(res){
				response.cookie('activate','ok')
				response.redirect('/')
			}else{
				response.redirect('/')
			}
		})
		return
	}
	response.redirect('/')
})

app.listen(PORT, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${PORT}`)
})