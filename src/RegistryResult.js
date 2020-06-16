/**********************************************************
*Class responsible for register results form render
*
* Класс отвечающий за рендер панели результата регистрации пользователя
***********************************************************/

import React, {Component} from 'react';
import './RegistryResult.css';
import waitIcon from './images/wait.gif'
import errorIcon from './images/errorIcon.png'

class RegistryResult extends Component{
	

	render(){
		
		if(this.props.regResult.resultView==='none'){
			return null;
		}
		
		if(this.props.regResult.resultView==='wait'){
			return(
				<img className='WaitDetailPanelIcon' src={waitIcon} alt="waitIcon"></img>
			);
		}
		
		let errorIconImg=null;
		let result;
		
		if(this.props.regResult.resultView==='error'){
			errorIconImg=(<img src={errorIcon} alt="errorIcon"></img>);
			result='Ошибка ввода параметров: '+this.props.regResult.resultText;		
		}else{
			result = this.props.regResult.resultText;
		}
		
		return(
			<div className='RegistryResult'>
			    {errorIconImg}
				{result}
			</div>
		)
		
	}
}

export default RegistryResult;
