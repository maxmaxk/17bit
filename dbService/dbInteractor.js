/*****************************************
* Postgres DB interactor. Inital create of databases,
* handle of requests
*
*
* Модуль работы с Postgres. Первичное создание 
* таблиц при их отсутствии, выполнение запросов
*****************************************/

const {Client} = require('pg')
const dbScheme = require('./dbScheme.js')
const pgConnectParams = {
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'root',
    port: 5432,
}

class DbInteract {
	constructor(){
			this.client = new Client(pgConnectParams)
			this.client.connect()
			.catch((err)=>console.log(err))
			let chain = Promise.resolve()
			for (let item in dbScheme.dbScheme){
				let fieldsStr = ' ('
				let tableInfo = dbScheme.dbScheme[item]
				for (let field in tableInfo){
					fieldsStr += field + ' ' + tableInfo[field].type
					if(tableInfo[field].default !== undefined) fieldsStr += ' DEFAULT ' + tableInfo[field].default
					if(tableInfo[field].primKey) fieldsStr += ' PRIMARY KEY'
					if(tableInfo[field].unique) fieldsStr += ' UNIQUE'
					let references = tableInfo[field].references
					if(references){
						fieldsStr += ' REFERENCES ' + references.table + '(' + references.field + ') ON DELETE CASCADE'
					}
					fieldsStr += ', '
				}
				fieldsStr = fieldsStr.slice(0,-2)
				fieldsStr += ')'
				
				chain = chain.then( _ =>this.client.query('CREATE TABLE IF NOT EXISTS ' + item + fieldsStr))
				chain = chain.catch(err => console.log(err));
			}
		
	}

	getRandomNumber(){
		let randomNumber=Math.random().toString();
		return randomNumber.substring(2,randomNumber.length);
	}
	
	async getSessionId(){
		let sessionId = this.getRandomNumber()
		let query = await this.client.query("SELECT userId FROM users WHERE sessionId='" + sessionId + "'")	
		if(query.rows.length>0) return this.getSessionId()
		return sessionId
	}
	
	async getUserByField(fieldName, fieldValue){
		if(!fieldValue || !fieldName) return null;
		let query = await this.client.query("SELECT userId,login FROM users WHERE " + fieldName + "='" + fieldValue + "'")	
		if(query.rows.length === 1){
			return query.rows[0]
		}else{
			return null;
		}
	}

	async changePassCode(user){
		let changePassCodeStr = 'r' + this.getRandomNumber();
		await this.client.query("UPDATE users SET changepasscode = '" + changePassCodeStr + "' WHERE userid = " + user.userid)
		return changePassCodeStr
	}
	
	async checkUserLogin(userParams){
		try{
			let query = await this.client.query("SELECT userid, password, activate FROM users WHERE login='" + userParams.login + "'")
			if(query.rows.length !== 1) return {OK: true, Result:{Status:'error', errorText:'Wrong user/password'}}
			let row = query.rows[0]
			if(!row.activate) return {OK: true, Result:{Status:'error', errorText:'User not activated'}}
			// TODO add md5 hash for passwords
			if(row.password !== userParams.password) return {OK: true, Result:{Status:'error', errorText:'Wrong user/password'}}
			let sessionId = await this.getSessionId()
			await this.client.query("UPDATE users SET sessionId = '" + sessionId + "' WHERE userid = " + row.userid)
			return {OK: true, Result:{Status: 'ok', sessionId: sessionId}}
		}catch(err){
			console.log(err)
		}
	}
	
	async checkUserLogout(userParams, cookie){
		try{
			let query = await this.client.query("SELECT userid, sessionid FROM users WHERE login='" + userParams.login + "'")
			if(query.rows.length !== 1) return {OK: true, Result:{Status:'error', errorText:'Wrong user'}}
			let row = query.rows[0]
			if(row.sessionid !== cookie) return {OK: true, Result:{Status:'error', errorText:'Session id wrong'}}
			await this.client.query("UPDATE users SET sessionId = 0 WHERE userid = " + row.userid)
			return {OK: true, Result:{Status: 'ok'}}
		}catch(err){
			console.log(err)
		}
	}
	
	async changePassword(userParams, cookie){
		let user = await this.getUserByField('sessionid', cookie)
		if(!user) return {OK: true, Result:{Status:'error', errorText:'Cannot get session id'}}
		//TODO add md5 hash for password
		await this.client.query("UPDATE users SET password = '" + userParams.passReg + "' WHERE userid = " + user.userid)
		return {OK: true, Result:{Status:'ok'}}
	}
	
	async checkRemindPassword(changePassCode){
		console.log('changePassCode=',changePassCode)
		let users = await this.client.query("SELECT userId,login FROM users WHERE changepasscode='" + changePassCode + "'")	
		if(users.rows.length !== 1) return null
		let user = users.rows[0]
		let sessionId = await this.getSessionId()
		await this.client.query("UPDATE users SET changepasscode = '0', sessionid = '" + sessionId + "' WHERE userid = " + user.userid)
		return sessionId
	}
	
	async addNewUser(userParams){
		let activateCode = this.getRandomNumber()
		await this.client.query(`INSERT INTO users (login,password,email,activate,activatecode) 
								 VALUES ('${userParams.loginReg}','${userParams.passReg}','${userParams.emailReg}',false,'${activateCode}')`)
		return activateCode
	}
	async setUserActive(user){
		await this.client.query("UPDATE users SET activatecode = '0', activate = true WHERE userid = " + user.userid)
	}
}

module.exports.DbInteract = DbInteract
