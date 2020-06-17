/**********************************************************
* Class responsibles for remind password form render
*
* Класс отвечающий за рендер формы напоминания пароля
***********************************************************/


import React, {Component} from 'react';
import './RemindPassForm.css';
import RegistryResult from './RegistryResult.js'
import {remindPassUrl} from './Urls.js'
import {dataPost} from './DataRequest.js'

class RemindPassForm extends Component {
	
	constructor(){
		super();
		this.state={
			resultView: 'none',
			resultText: '',
		}
		this.regFields={
			emailReg: '',
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
	
	regButtonClick(){
		let resultView = 'ok';
		let resultText = '';
		if(!this.isEmailValid(this.regFields.emailReg)){
			resultView = 'error';
			resultText = 'Некорректный адрес электронной почты. ';
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
		let dataPostFunc={dataPost}.dataPost;
		dataPostFunc({remindPassUrl}.remindPassUrl,null,JSON.stringify(this.regFields),'application/json')
		.then((data)=>{
			if(data.Status === 'ok'){
				this.setState({resultView:'ok', resultText:'На Ваш e-mail выслано письмо с инструкциями'})
			}else{
				this.setState({resultView:'error', resultText:data.errorText})
			}
		})	
		.catch((err)=>{this.setState({resultView:'error', resultText:err.message})});
	}
	
	render(){
		return (
			<div className='RemindPassForm'>
				<h2>Пожалуйста, укажите необходимые данные</h2>
				<div>
					<label htmlFor='emailReg'>E-mail регистрации аккаунта</label>
					<input className='blackInput' type='text' id='emailReg' onChange={this.inputOnChangeHandler}></input>
				</div>
				<button className='RemindPassButton' onClick={this.regButtonClick}>ОК</button>
				<RegistryResult regResult={this.state}/>
			</div>
		);
	}
}

export default RemindPassForm;
