/**********************************************************
* Class responsibles for right panel render, which allow user 
* to enter params of current detail. All necessary dictionaries 
* get from DetailPanel instance
*
*
* Класс отвечающий за рендер правой панели для ввода
* пользователем параметров текущего изделия. Все словари,
* необходимые для отображения передаются из класса DetailPanel
***********************************************************/

import React, {Component} from 'react';
import './AskingBoard.css';

const DICSTEELS='materials.steels';
const STEELTITLE='Сталь';

class AskingBoard extends Component{
	
	constructor(props){
		super(props);
		let data=this.props.data.input_schema.properties;
		let ignore=this.props.data.input_schema.ignored;
		let values={};
		Object.keys(data).forEach((item)=>{
			if (!(ignore && ignore.includes(item))){
				if(data[item].default){
					values[item] = data[item].default;
				}else if(data[item].enum && data[item].enum.length){
					values[item] = data[item].enum[0];
				}else if(data[item].type==='boolean'){
					values[item] = false;
				}else{
					values[item] = '';
				}
			}
		})
		this.state={values: values};
		this.props.getAskingValues(values);
		this.inputOnChangeHandler = this.inputOnChangeHandler.bind(this);
		this.steels=[];
	}
	
	inputOnChangeHandler(e){
		if(e.target.dataset.name){
			let values = this.state.values;
			let value=(e.target.type==='checkbox')?e.target.checked:e.target.value;
			if(e.target.dataset.type==='integer'){
				value = parseInt(value);
				if(!value) value='';
			}
			values[e.target.dataset.name] = value;
			this.setState({values: values});
			this.props.getAskingValues(values);
		}
	}
	
	checkValid(val,min,max,type){
		if(!val) return 'dismatchInput';
		if(type==='integer'){
			try{
				let xVal=parseInt(val);
				if(!min || !max) return 'matchInput';
				if ((xVal>=min) && (xVal<=max)) return 'matchInput'
				else return 'dismatchInput';
			}
			catch{
				return 'dismatchInput';
			}
		}
		return 'matchInput';
	}
	
	componentDidMount(){
		this.props.getProductSteels(this.steels);
	}
	
	render(){ 
		this.steels=[];
		let data=this.props.data;
		if(!data) return null;
		return(
			<div className='AskingBoard'>
				{Object.keys(data.input_schema.properties).map(
					(item,index)=>{
						if (data.input_schema.ignored && data.input_schema.ignored.includes(item)) return null;
						let itemNode=data.input_schema.properties[item];
						return(
							<div key={index} className='AskingItem'>
								{(()=>{
									if(itemNode.title!==STEELTITLE){
										let intervalStr='';
										if(itemNode.minimum && itemNode.maximum){
											intervalStr=' ('+itemNode.minimum+' - '+itemNode.maximum+')';
										}
										return (<div>{itemNode.title+intervalStr+':'}</div>)
									}
								})()}
								{(()=>{
									if(itemNode.title===STEELTITLE){
										if(itemNode.enum){
											itemNode.enum.forEach((itemNodeName)=>{
												let dictName=data.input_schema.properties[item].dictionary;
												if(this.props.dictionary && this.props.dictionary[dictName] && this.props.dictionary[dictName][itemNodeName]){
													let dictRec=this.props.dictionary[dictName][itemNodeName];
													if(dictName===DICSTEELS){
														dictRec.steelName=itemNodeName;
														this.steels.push(dictRec);
													}
												}
											})
										}
										return null;
									}	
									if(itemNode.enum){
										return (
											<select className="blackSelect" onChange={this.inputOnChangeHandler} data-name={item}>
												{itemNode.enum.map((itemNodeName,index)=>{
													let dictName=data.input_schema.properties[item].dictionary;
													if(this.props.dictionary && this.props.dictionary[dictName] && this.props.dictionary[dictName][itemNodeName]){
														let dictRec=this.props.dictionary[dictName][itemNodeName];
														return (<option value={itemNodeName} key={index}>{dictRec.Title}</option>)
													}
													return (<option value={itemNodeName} key={index}>{itemNodeName}</option>)
												})}
											</select>
										)
									}
									if(itemNode.type==='boolean'){
										return(
											<div className='checkboxContainer'>
												<input type='checkbox' onChange={this.inputOnChangeHandler} data-name={item}/>
												<label>{itemNode.description}</label>
											</div>
										)
									}
									let inputClass='AskBlackInput '+this.checkValid(this.state.values[item],itemNode.minimum,itemNode.maximum,itemNode.type);
									return (<input type="text" className={inputClass}
											data-name={item} 
											data-max={itemNode.maximum}
											data-min={itemNode.minimum}
											data-type={itemNode.type}
											value={this.state.values[item]}
											placeholder={itemNode.description}
											onChange={this.inputOnChangeHandler}></input>)
								})()}
								
							</div>	
						)
					}
				)}
			</div>
		)
    }
}

export default AskingBoard;
