/**********************************************************
* Class responsibles for authorise form render
*
* Класс отвечающий за рендер высплывающего окна авторизации
***********************************************************/


import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './LoginForm.css';
import {loginUserUrl} from './Urls.js'
import {dataPost} from './DataRequest.js'

class LoginForm extends Component{
	
	constructor(props){
		super(props);
		this.loginParams={
			login: '',
			password: '',
		}
		this.inputOnChangeHandler = this.inputOnChangeHandler.bind(this);
		this.tryLogin = this.tryLogin.bind(this);
		this.mouseDownEvent = this.mouseDownEvent.bind(this);
	}
	
	inputOnChangeHandler(e){
		this.loginParams[e.target.id] = e.target.value;
	}
	
	tryLogin(){	
		let dataPostFunc={dataPost}.dataPost;
		dataPostFunc({loginUserUrl}.loginUserUrl,null,JSON.stringify(this.loginParams),'application/json')
		.then((data)=>{
			if(data.Status==='error') this.props.messageSend(data.errorText);
			if(data.Status==='ok'){
				if(data.sessionId){
					document.cookie = 'session= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
					document.cookie = 'session='+data.sessionId;
					this.props.setCurrentUser(this.loginParams.login);
				}
			}
		})
		.catch((err)=>{console.log('error=',err.message)})
	}
	
	mouseDownEvent(e){
		this.props.setDoNotCloseLoginFormFlag();
	}
	
	render(){

		return(
			<div className={this.props.loginFormStyle}>
				<input type='text' 
					   id='login' 
					   placeholder='login' 
					   onChange={this.inputOnChangeHandler} 
					   onMouseDown={this.mouseDownEvent}
				/>
				<input type='password' 
					   id='password' 
					   name='password' 
					   placeholder='password' 
					   onChange={this.inputOnChangeHandler}
					   onMouseDown={this.mouseDownEvent}					   
				/>
				<p id='loginButtonsContainer'>
					<input type='button' onClick={this.tryLogin} value='Войти'/>
					<input type='button' value='Отмена'/>
				</p>
				<div>
					<div className='registryButton'><Link to='/registry'>Регистрация</Link></div>
					<div className='forgetPasswordButton'><Link to='/remindPass'>Забыли пароль?</Link></div>
				</div>
			</div>
		)
		
	}
}

export default LoginForm;
