/**********************************************************
* Class responsibles for messages form render. 
* Form disappear automatically
*
* Класс отвечающий за рендер вспывающего окна уведомлений.
* Окно автоматически исчезает
***********************************************************/

import React, {Component} from 'react';
import './MessageDlg.css';
const MESS_DIALOG_SHOW=2;
const MESS_DIALOG_HIDING=1;
const MESS_DIALOG_CLOSE=0;
const DELAY_START_FADING=2000;
const DELAY_FINISH_FADING=4000;

class MessageDlg extends Component{
	constructor(props){
		super(props);
		this.msg = this.props.msg;
		this.state={
			showingMess: MESS_DIALOG_SHOW,
		}
	}
	
	render(){
		let showingMess = this.state.showingMess;
		if(this.props.msg && this.props.msg !==this.msg){
			this.msg = this.props.msg;
			showingMess = MESS_DIALOG_SHOW;
		}
		if(!this.msg) return null;
		let messageStyle='MessageDlg';
		if(showingMess === MESS_DIALOG_HIDING) messageStyle='MessageDlg Hidden';
		if(showingMess === MESS_DIALOG_CLOSE){
			messageStyle='MessageDlg Closed';
			this.msg = null;
		}
		if(showingMess === MESS_DIALOG_SHOW){
			setTimeout(()=>{this.setState({showingMess: MESS_DIALOG_HIDING})},DELAY_START_FADING);
			setTimeout(()=>{
				this.setState({showingMess: MESS_DIALOG_CLOSE});
				if(this.props.messageHasSend) this.props.messageHasSend();
			},DELAY_FINISH_FADING);
		}
		return(
			<div className={messageStyle}>
				{this.msg}
			</div>
		)
		
	}
}

export default MessageDlg;
