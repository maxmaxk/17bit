/**********************************************************
* Class responsibles for header render and showing of current user
*
* Класс отвечающий за рендер шапки и отображения текущего юзера
***********************************************************/

import React, {Component}  from 'react';
import {Link} from 'react-router-dom';
import './Header.css';

class Header extends Component {
	
	constructor(props){
		super(props);
		this.logoutHandler=this.logoutHandler.bind(this);
	}
	
	logoutHandler(){
		this.props.logoutHandler();
	}
	
	render(){
	  let authBlock;
	  if(!this.props || (this.props.currentUser===null)){
		  authBlock=(<div className='loginButton'>Авторизация</div>)
	  }else{
		  authBlock=(<div className='userInfo'>
						<div className='userName'><Link to='/changePass'>Пользователь: {this.props.currentUser}</Link></div>
						<div className='logoutButton' onClick={this.logoutHandler}>Выход</div>
					 </div>)
	  }
	  return (
		<div className='Header'>
			<Link to='/'>
				<div className='logo'>
					<div>ЗАКАЗ</div>
					<div>ИВИ</div>
				</div>
				<div className='slogan'>
					<h2>Воздуховоды, фасонные части, сетевые элементы</h2>
					<h3>Выбор вентиляционных изделий для Заказа</h3>
				</div>
			</Link>
			{authBlock}
		</div>
	  );
	}
}

export default Header;
