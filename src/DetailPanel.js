/**********************************************************
* Class responsibles for right panel render (for choose params of product). 
* It gets scheme of product and sends it to AskingBoard instance.
*
*
* Класс отвечающий за рендер правой панели (выбор параметров
* изделия). Подгружает схему изделия и передает ее в AskingBoard
***********************************************************/

import React, {Component} from 'react';
import './DetailPanel.css';
import {dataRequest} from './DataRequest.js'
import waitIcon from './images/wait.gif';
import errorIcon from './images/errorIcon.png'
import AskingBoard from './AskingBoard.js';
import {fieldsUrl,dictionaryUrl} from './Urls.js';
class DetailPanel extends Component{
	
	constructor(props){
		super(props);
		this.currentProductId = null;
		this.state={
			data:undefined,
			errorState: null,
			dictionary: {},
		}
		this.waiting = false;
		this.getProductSteels=this.getProductSteels.bind(this);
		this.getAskingValues=this.getAskingValues.bind(this);
	}
	
	
	getProductSteels(steels){
		this.props.getProductSteels(steels);
	}
	
	getAskingValues(values){
		this.props.getAskingValues(values);
	}
	
	sortEnums(data){
		let dataProps=data[Object.keys(data)[0]].input_schema.properties;
		Object.keys(dataProps).forEach((item)=>{
			if(dataProps[item].enum){
				let sortedEnum=dataProps[item].enum;
				sortedEnum.sort();
			}
		});
		
		return data;
	}
	
	render(){
		
		if (this.currentProductId  !== this.props.currentProductId){
			this.waiting = true;
			
			let data={};
			let dict=this.state.dictionary;
			let dataRequestFunc={dataRequest}.dataRequest;
			let chain=dataRequestFunc({fieldsUrl}.fieldsUrl,this.props.currentProductId);
			let itemProperties;
			chain = chain.then((dataReq)=>{
				data = this.sortEnums(dataReq);
				itemProperties=data[this.props.currentProductId].input_schema.properties;
				this.props.setCurrentItemProps(itemProperties);
			})
			chain = chain.then(()=>{
				Object.keys(itemProperties).forEach((item)=>{
					chain = chain.then(()=>{
						if (data[this.props.currentProductId].input_schema.ignored && 
							data[this.props.currentProductId].input_schema.ignored.includes(item)) return true;
						if (itemProperties[item].dictionary && !dict[itemProperties[item].dictionary]){
							return dataRequestFunc({dictionaryUrl}.dictionaryUrl+itemProperties[item].dictionary);
						}
					})
					.then((dicData)=>{
						if(dicData){
							dict[itemProperties[item].dictionary] = dicData;
						}
					})
				})
				chain = chain.then(()=>{
					this.waiting = false;
					this.setState({data:data,errorState:null,dictionary:dict});
				})
				chain = chain.catch((err)=>{				
					this.waiting = false;
					this.setState({errorState:err.message});
				})
			})
			chain = chain.catch((err)=>{				
				this.waiting = false;
				this.setState({errorState:err.message});
			})
			
			this.currentProductId  = this.props.currentProductId;
		}
		
		if (this.state.errorState){
			return(
				<div className='OnError'>
					<img src={errorIcon} alt="errorIcon"></img>
					<div>{this.state.errorState}</div>
				</div>			
			)
		}
		
		if(this.waiting){
			return(
				<img className='WaitDetailPanelIcon' src={waitIcon} alt="waitIcon"></img>
			);
		}
		
		if (this.props.currentProductId===null){
			return(
				<div className='DetailPanel NotChoose'>
					Изделие не выбрано
				</div>
			);
		}
		
		return(
			<div className='DetailPanel'>
			    <div className='captionDetails'>Детальная информация</div>
				<AskingBoard data={this.state.data[this.props.currentProductId]} 
							 dictionary={this.state.dictionary}
							 getProductSteels={this.getProductSteels}
							 getAskingValues={this.getAskingValues}/>
			</div>
		)
		
	}
}

export default DetailPanel;
