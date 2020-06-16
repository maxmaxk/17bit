
/**********************************************************
* Class responsible for new user register form and change password form
*
*
* Класс отвечающий за рендер формы регистрации нового
* пользователя или смены пароля
***********************************************************/

import React, {Component} from 'react';
import './RegistryForm.css';
import RegistryResult from './RegistryResult.js'
import {registryUserUrl,changePasswordUrl} from './Urls.js'
import {dataPost} from './DataRequest.js'

class RegistryForm extends Component {
	
	constructor(){
		super();
		this.state={
			resultView: 'none',
			resultText: '',
		}
		this.regFields={
			emailReg: '',
			loginReg: '',
			passReg: '',
			repPassReg: ''
		}
		this.inputOnChangeHandler = this.inputOnChangeHandler.bind(this);
		this.regButtonClick = this.regButtonClick.bind(this);
	}
	
	inputOnChangeHandler(e){
		this.regFields[e.target.id] = e.target.value;
	}
	
	isEmailValid(email){
		return (email.includes('@'));
	}
	
	isLoginValid(login){
		return (login !== '');
	}
	
	isPassValid(pass){
		return (pass !== '');
	}
	
	regButtonClick(){
		let resultView = 'ok';
		let resultText = '';
		if(this.props.view !== 'passOnly'){
			if(!this.isEmailValid(this.regFields.emailReg)){
				resultView = 'error';
				resultText = 'Некорректный адрес электронной почты. ';
			}
			if(!this.isLoginValid(this.regFields.loginReg)){
				resultView = 'error';
				resultText += 'Некорректное имя пользователя. ';
			}
		}
		if(!this.isPassValid(this.regFields.passReg)){
			resultView = 'error';
			resultText += 'Пароль не соответствует требованиям безопасности. ';
		}
		if(this.regFields.passReg !== this.regFields.repPassReg){
			resultView = 'error';
			resultText += 'Пароли не совпадают.';
		}	
		if(resultView === 'error'){
			this.setState({
				resultView: resultView,
				resultText: resultText,
			});
			return;
		}
		this.setState({
			resultView: 'wait'
		});
		let dataPostFunc = {dataPost}.dataPost;
		let registryUrl = (this.props.view === 'passOnly')?{changePasswordUrl}.changePasswordUrl:{registryUserUrl}.registryUserUrl;
		resultText = (this.props.view === 'passOnly')?
							'Пароль успешно изменен':
							'На Ваш e-mail выслано письмо с подтверждением регистрации';
		dataPostFunc(registryUrl,null,JSON.stringify(this.regFields),'application/json')
		.then((data)=>{
			if(data.Status === 'ok'){
				this.setState({resultView:'ok', resultText: resultText})
			}else{
				this.setState({resultView:'error', resultText:data.errorText})
			}
		})	
		.catch((err)=>{this.setState({resultView:'error', resultText:err.message})});
	}
	
	render(){
		let inputClass=(this.props.view === 'passOnly')?'hidden':'blackInput';
		let labelClass=(this.props.view === 'passOnly')?'hidden':'';
		let buttonText=(this.props.view === 'passOnly')?'Сменить пароль':'Регистрация';
		return (
			<div className='RegistryForm'>
				<h2>Пожалуйста, заполните форму</h2>
				<div>
					<label className={labelClass} htmlFor='emailReg'>E-mail для подтверждения регистрации</label>
					<input className={inputClass} type='text' id='emailReg' onChange={this.inputOnChangeHandler}></input>
				</div>
				<div>
					<label className={labelClass} htmlFor='loginReg'>Имя для входа (логин)</label>
					<input className={inputClass} type='text' id='loginReg' onChange={this.inputOnChangeHandler}></input>
				</div>
				<div>
					<label htmlFor='passReg'>Пароль</label>
					<input className='blackInput' type='password' id='passReg' onChange={this.inputOnChangeHandler}></input>
				</div>
				<div>
					<label htmlFor='repPassReg'>Повторите пароль</label>
					<input className='blackInput' type='password' id='repPassReg' onChange={this.inputOnChangeHandler}></input>
				</div>
				<button className='RegButton' onClick={this.regButtonClick}>{buttonText}</button>
				<RegistryResult regResult={this.state}/>
			</div>
		);
	}
}

export default RegistryForm;
