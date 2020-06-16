/**********************************************************
* Main class responsible for page render, link routing.
* Also it shows|hides popup windows MessageDlg & LoginForm.
* It checks Esc key and outside popup windows click.
* On start it checks is current user already logged in.
*
*
* Заглавный класс, отвечающий за рендер страницы в целом,
* роутинг в зависимости от ссылки. Вызов всплывающих окон
* MessageDlg и LoginForm. Подключена обработка кликов и 
* нажатия Esc для закрытия всплывающих окон.
* Проверка при старте на наличие залогиненого пользователя
***********************************************************/

import React, {Component} from 'react';
import { Switch, Route } from 'react-router'
import './App.css';
import Header from './Header.js'
import Body from './Body.js'
import Footer from './Footer.js'
import {getStatesOnClick,getStatesOnEsc} from './EventManager.js'
import {getCurrentUserUrl, logoutUserUrl} from './Urls.js'
import LoginForm from './LoginForm.js'
import RegistryForm from './RegistryForm.js'
import RemindPassForm from './RemindPassForm.js'
import MessageDlg from './MessageDlg.js'
import {dataPost} from './DataRequest.js'

class App extends Component{
	
	constructor(props){
		super(props);
		this.state={
			productListStyle: 'hidden',
			loginFormStyle: 'hidden',
			productClickId: null,
			currentUser: null,
			msg: null,
		}
		this.doNotCloseLoginForm = false;
		this.productItemRef = React.createRef();
		this.appClick=this.appClick.bind(this);
		this.escFunction=this.escFunction.bind(this);
		this.setProductListVisible=this.setProductListVisible.bind(this);
		this.logoutHandler=this.logoutHandler.bind(this);
		this.messageSend=this.messageSend.bind(this);
		this.messageHasSend=this.messageHasSend.bind(this);
		this.setCurrentUser=this.setCurrentUser.bind(this);
		this.setDoNotCloseLoginFormFlag=this.setDoNotCloseLoginFormFlag.bind(this);
	}
	
	appClick(e){
		this.setState(getStatesOnClick(e,this.state,this.doNotCloseLoginForm));
		this.doNotCloseLoginForm = false;
		this.checkClickId();
	}
	
	setDoNotCloseLoginFormFlag(){
		this.doNotCloseLoginForm = true;
	}
	
	escFunction(event){
		if(event.keyCode === 27) {
			this.setState(getStatesOnEsc());
		}
	}
	
	setProductListVisible(){
		this.setState({productListStyle:'ProductsList'});
	}
	  
	setCurrentUser(user){
		this.setState({currentUser: user});
	}
	
    componentDidMount(){
		document.addEventListener("click", this.appClick);
		document.addEventListener("keydown", this.escFunction);
		fetch({getCurrentUserUrl}.getCurrentUserUrl,{method: 'GET',credentials: 'include',})
		.then((response)=>response.json())
		.then((data)=>{
			if(data.login){
				this.setState({currentUser: data.name.login})
			}else{
				this.setState({currentUser: null})
			}	
		})
		if(document.cookie.includes('activate=ok')){
			this.messageSend('Аккаунт успешно активирован')
			document.cookie = 'activate= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
		}
    }
	
	logoutHandler(){

		let dataPostFunc={dataPost}.dataPost;
		dataPostFunc({logoutUserUrl}.logoutUserUrl,null,JSON.stringify({login:this.state.currentUser}),'application/json')
		.then((data)=>{
			document.cookie = 'session= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
		})
		.catch((e)=>{console.log('Error logout:',e.message)})
		
		this.setState({currentUser:null});
		document.getElementById('login').value = '';
		document.getElementById('password').value = '';
	}
	
	componentWillUnmount(){
		document.removeEventListener("click", this.appClick);
		document.removeEventListener("keydown", this.escFunction);
	}
	
	checkClickId(){
		if(this.state.productClickId){
			this.productItemRef.current.changeProductItemId(this.state.productClickId);
		}
	}
	
	messageSend(msg){
		this.setState({msg: msg});
	}
	
	messageHasSend(){
		this.setState({msg: null});
	}
 
	render(){

		let mainPage=(<Body productListStyle={this.state.productListStyle} 
					loginFormStyle={this.state.loginFormStyle}
					ref={this.productItemRef}
					setProductListVisible={this.setProductListVisible}/>);		
		return (
			<div className="App">
				<Header currentUser={this.state.currentUser} 
						logoutHandler={this.logoutHandler}
				/>
				<LoginForm loginFormStyle={this.state.loginFormStyle} 
						   messageSend={this.messageSend}
						   setCurrentUser={this.setCurrentUser}
						   setDoNotCloseLoginFormFlag={this.setDoNotCloseLoginFormFlag}
				/>
				<MessageDlg msg={this.state.msg} messageHasSend={this.messageHasSend}/>
				<Route path='/message/:state' component={MessageDlg}/>
				<Switch>
					<Route exact path="/" render={()=>mainPage}/>
					<Route path='/registry' render={()=><RegistryForm view = 'full'/>}/>
					<Route path='/changePass' render={()=><RegistryForm view = 'passOnly'/>}/>
					<Route path='/remindPass' render={()=><RemindPassForm/>}/>
					<Route path="*" render={()=>mainPage}/>
				</Switch>
				<Footer/>
			</div>
		);
	}
}

export default App;
