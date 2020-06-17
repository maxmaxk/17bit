/**********************************************************
* Class responsibles for information panels render.
* It handles user choose of detail steel type, 
* manages data flow between panels and also
* loads necessary dictionaries into cache
*
*
*
* Класс отвечающий за общий рендер панелей ввода и вывода
* информации о изделии. Здесь реализованы функции обработки
* выбора пользователем типа стали, обмен данными между панелями,
* загрузка справочников материалов в кэш
***********************************************************/


import React, {Component} from 'react';
import './Body.css';
import CommonPanel from './CommonPanel.js'
import DetailPanel from './DetailPanel.js'
import {dataRequest,dataPost} from './DataRequest.js'
import waitIcon from './images/wait.gif'
import errorIcon from './images/errorIcon.png'
import ProductsList from './ProductsList.js'
import PicturePanel from './PicturePanel.js'
import ResultPanel from './ResultPanel.js'

import {productListUrl,steelTypesUrl,calcUrl,unitsUrl,materialTypesUrl} from './Urls.js';


const STEEL_TYPE_CHANGE = 1;
const STEEL_THICKNESS_CHANGE = 2;

class Body extends Component {
	
	constructor(props){
		super(props);
		this.state={
			askFields:'',
			errorState: null,
			productsData: null,
			productFilter: '',
			productSort: 'alfaSort',
			productFilterMatch: true,
			currentProductId: null,
			steelTypes: null,
			currentSteelType: '',
			steelThickness: null,
			currentSteelThickness: '',
			steels: null,
			currentSteel: '',
			calcResult: {view: 'none', text: 'testResult'},
		}
		this.allSteelTypes = {};
		this.allSteels = [];
		this.allUnits = {};
		this.allMaterialTypes = {};
		this.askValues = {};
		this.currentItemProperties = {};
		this.productValueRef = React.createRef();
		this.productInputOnChangeHandler = this.productInputOnChangeHandler.bind(this);
		this.steelTypeOnChangeHandler = this.steelTypeOnChangeHandler.bind(this);
		this.steelThicknessOnChangeHandler = this.steelThicknessOnChangeHandler.bind(this);
		this.steelOnChangeHandler = this.steelOnChangeHandler.bind(this);
		this.productSortOnChangeHandler = this.productSortOnChangeHandler.bind(this);
		this.transferFilteredCount = this.transferFilteredCount.bind(this);
		this.getProductSteels = this.getProductSteels.bind(this);
		this.getAskingValues = this.getAskingValues.bind(this);
		this.getRequest = this.getRequest.bind(this);
		this.calcButtonClick = this.calcButtonClick.bind(this);
		this.setCurrentItemProps = this.setCurrentItemProps.bind(this);
		let dataRequestFunc={dataRequest}.dataRequest;
		dataRequestFunc({productListUrl}.productListUrl)
		.then((data)=>{
			this.setState({productsData:data});
			return dataRequestFunc({steelTypesUrl}.steelTypesUrl);
		})
		.then((data)=>{
			this.allSteelTypes=data;
			return dataRequestFunc({unitsUrl}.unitsUrl);
		})
		.then((data)=>{
			this.allUnits=data;
			return dataRequestFunc({materialTypesUrl}.materialTypesUrl);
		})
		.then((data)=>{
			this.allMaterialTypes=data;
		})
		.catch((err)=>{this.setState({errorState:err.message})})
	}
	
	changeProductItemId(value){
		this.productValueRef.current.changeProductItemValue(this.state.productsData[value].title);
		this.setState({productFilter: '', currentProductId: value, calcResult: {view: 'none'}});
	}
	
	productInputOnChangeHandler(value){
		this.setState({productFilter: value});
		this.props.setProductListVisible();
	}
	
	steelTypeOnChangeHandler(value){
		let res=this.checkSteelParams(STEEL_TYPE_CHANGE,value);
		this.setState({currentSteelType: value, steelThickness:res.steelThickness, steels:res.steels});
	}
	
	steelThicknessOnChangeHandler(value){
		let res=this.checkSteelParams(STEEL_THICKNESS_CHANGE,value);
		this.setState({currentSteelThickness: value, steelTypes:res.steelTypes,  steels:res.steels});
	}
	
	steelOnChangeHandler(value){
		this.setState({currentSteel: value});
	}
	
	productSortOnChangeHandler(value){
		this.setState({productSort: value});
	}
	
	transferFilteredCount(filteredCount){
		let filterMatch=(filteredCount>0);
		if(filterMatch!==this.state.productFilterMatch)
			this.setState({productFilterMatch:filterMatch})
	}
	
	getProductSteels(steels){
		this.allSteels = steels;
		let steelTypes={};
		let steelThickness=[];
		steels.forEach((item)=>{
			if(item.SteelType && this.allSteelTypes[item.SteelType]){
				if(!steelTypes[item.SteelType]) steelTypes[item.SteelType]=this.allSteelTypes[item.SteelType]
			}
			if(!steelThickness.includes(item.SteelThickness)) steelThickness.push(item.SteelThickness);
		})
		steelThickness.sort((a,b)=>{return a-b})
		this.setState({steels:steels,steelTypes:steelTypes,steelThickness:steelThickness,
					   currentSteel:'',currentSteelType:'',currentSteelThickness:''});
	}
	
	checkSteelParams(mode, value){
		if(mode===STEEL_TYPE_CHANGE){
			let steelThickness=[];
			let steels=[];
			this.allSteels.forEach((item)=>{
				if((item.SteelType===value) || (value==='')){
					if(!steelThickness.includes(item.SteelThickness)) steelThickness.push(item.SteelThickness);
					if((item.SteelThickness===parseFloat(this.state.currentSteelThickness)) || (this.state.currentSteelThickness==='')) steels.push(item);
				}
			})
			if(!steels.length){
				this.allSteels.forEach((item)=>{
					if(item.SteelType===value) steels.push(item);
				})
			}
			steelThickness.sort((a,b)=>{return a-b});
			return {steelThickness:steelThickness, steels:steels}
		}
		if(mode===STEEL_THICKNESS_CHANGE){
			let steelTypes={};
			let steels=[];
			this.allSteels.forEach((item)=>{
				if((item.SteelThickness===parseFloat(value)) || (value==='')){
					steelTypes[item.SteelType]=this.allSteelTypes[item.SteelType];
					if((item.SteelType===this.state.currentSteelType) || (this.state.currentSteelType==='')) steels.push(item);
				}
			})
			if(!steels.length){
				this.allSteels.forEach((item)=>{
					if(item.SteelThickness===value) steels.push(item);
				})
			}
			return {steelTypes:steelTypes, steels:steels}
		}
	}
	
	getAskingValues(values){
		this.askValues = values;
	}
	
	getRequest(){
		this.askValues.Steel = this.state.currentSteel;
		return JSON.stringify(this.askValues);
	}
	
	setCurrentItemProps(itemProperties){
		this.currentItemProperties=itemProperties;
	}
	
	calcButtonClick(){
		this.setState({calcResult: {view:'wait'}});
		let request=this.getRequest();
		let dataPostFunc={dataPost}.dataPost;
		dataPostFunc({calcUrl}.calcUrl,this.state.currentProductId,request)
		.then((data)=>{this.setState({calcResult: {view:'ok', text:JSON.stringify(data,null,'\n')}})})
		.catch((err)=>{this.setState({calcResult: {view:'error', 
												    text:err.message, 
												    currentItemProperties:JSON.stringify(this.currentItemProperties)
												  }})});
	}
	
	
	render(){
		
		if (this.state.errorState){
			return(
				<div className='OnError'>
					<img src={errorIcon} alt="errorIcon"></img>
					<div>{this.state.errorState}</div>
				</div>			
			)
		}
		
		if (this.state.productsData===null){
			return(
				<div className='Body'>
					<img className='WaitIcon' src={waitIcon} alt="waitIcon"></img>
				</div>
			);
		}
		
		return (
			<div className='Body'>
				<div className='TopPanel'>
					<PicturePanel currentProductId={this.state.currentProductId}/>
					<CommonPanel ref={this.productValueRef}
							     productInputOnChangeHandler={this.productInputOnChangeHandler}
								 productFilterMatch={this.state.productFilterMatch}
								 steelTypes={this.state.steelTypes}
								 steelTypeOnChangeHandler={this.steelTypeOnChangeHandler}
								 productSortOnChangeHandler={this.productSortOnChangeHandler}
								 currentSteelType={this.state.currentSteelType}
								 steelThickness={this.state.steelThickness}
								 steelThicknessOnChangeHandler={this.steelThicknessOnChangeHandler}
								 currentSteelThickness={this.state.currentSteelThickness}
								 steels={this.state.steels}
								 steelOnChangeHandler={this.steelOnChangeHandler}
								 currentSteel={this.state.currentSteel}/>
					<DetailPanel currentProductId={this.state.currentProductId}
								 getProductSteels={this.getProductSteels}
								 getAskingValues={this.getAskingValues}
								 setCurrentItemProps={this.setCurrentItemProps}/>
					<ProductsList productsData={this.state.productsData} 
								  productListStyle={this.props.productListStyle}
								  productFilter={this.state.productFilter}
								  productSort={this.state.productSort}
								  transferFilteredCount={this.transferFilteredCount}/>
				</div>
				<div className='ButtonContainer'>
					<button className='CalcButton' onClick={this.calcButtonClick}>
						Расчет
					</button>
				</div>
				<ResultPanel calcResult={this.state.calcResult}
							 units={this.allUnits}
							 materialTypes={this.allMaterialTypes}/>
			</div>
		);
		
	}
}

export default Body;
