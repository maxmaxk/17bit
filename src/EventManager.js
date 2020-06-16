/**********************************************************
* Module which check necessary of login form and products list 
* form hiding on Esc key event or on click outside these forms event
*
*
* Модуль, определяющий необходимость скрыть панели логина
* и списка изделий при нажатии Esc или клике мимо этих окон
***********************************************************/

export function getStatesOnClick(e,state, doNotCloseLoginForm = false){
	let productListStyle=state.productListStyle;
	let loginFormStyle=state.loginFormStyle;
	if (e.target){
		if(e.target.className==='Caption'){
			return {productListStyle:'hidden', productClickId:e.target.id}
		}
		if(e.target.className.indexOf('blackInput')>=0){
			productListStyle=(productListStyle==='hidden')?'ProductsList':'hidden';
			return {productListStyle: productListStyle, loginFormStyle: 'hidden', productClickId: null};
		}
		if(e.target.className==='loginButton'){
			loginFormStyle=(loginFormStyle==='hidden')?'LoginForm':'hidden';
			return {productListStyle: 'hidden', loginFormStyle: loginFormStyle, productClickId: null};
		}
		if((e.target.id==='login') || (e.target.id==='password') || (e.target.id==='loginButtonsContainer')){
			return {productListStyle: 'hidden', loginFormStyle: 'LoginForm', productClickId: null};
		}
		let result = {productListStyle: 'hidden', productClickId: null};
		if(!doNotCloseLoginForm) result.loginFormStyle = 'hidden';
		return result;
	}
}

export function getStatesOnEsc(){
	return({productListStyle: 'hidden', loginFormStyle: 'hidden'});
}