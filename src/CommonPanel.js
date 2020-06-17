/**********************************************************
* Class responsibles for common panel render 
* (steel type choose and product choose)
*
*
* Класс отвечающий за рендер средней панели (выбор типа стали
* и изделия)
***********************************************************/


import React, {Component} from 'react';
import './CommonPanel.css';


class CommonPanel extends Component{
	
	constructor(props){
		super(props);
		this.state={
			productItemValue: '',
		};
		this.onChangeHandle=this.onChangeHandle.bind(this);
		this.sortChange=this.sortChange.bind(this);
	}
	
	changeProductItemValue(value){
		this.setState({productItemValue:value});
	}
	
	onChangeHandle(e){
		if(e.target.className.indexOf('blackInput')>=0){
			this.setState({productItemValue:e.target.value});
			this.props.productInputOnChangeHandler(e.target.value);
		}
	}
	
	steelTypeChange(e){
		this.props.steelTypeOnChangeHandler(e.target.value);
	}
	
	steelThicknessChange(e){
		this.props.steelThicknessOnChangeHandler(e.target.value);
	}
	
	steelChange(e){
		this.props.steelOnChangeHandler(e.target.value);
	}
	
	sortChange(e){
		this.props.productSortOnChangeHandler(e.target.value);
	}
	
	render(){
		let inputClass='blackInput';
		if(this.props.productFilterMatch){
			inputClass+=' matchInput';
		}else{
			inputClass+=' dismatchInput';
		}
		this.steelTypes = this.props.steelTypes || {};
		this.steelThickness = this.props.steelThickness || [];
		this.steels = this.props.steels || [];
		return(
			<div className='CommonPanel'>
				<div>
					<input 
						type='radio' 
						id='alfaSort' 
						name='sortType' 
						value='alfaSort' 
						defaultChecked
						onChange={this.sortChange}
					/>
					<label htmlFor='alfaSort'>по алфавиту</label>
					<input 
						type='radio' 
						id='sectionSort' 
						name='sortType' 
						value='sectionSort' 
						onChange={this.sortChange}
					/>
					<label htmlFor='sectionSort'>по сечению</label>
				</div>
				<div>
					<div>Тип изделия:</div>
					<input type='text' 
						   id='productItemInput'
						   className={inputClass} 
						   value={this.state.productItemValue} 
						   onChange={this.onChangeHandle}
						   autoComplete='off'
						   placeholder='(Выбор типа изделия)'>
					</input>
				</div>
				<div>
					<div>Тип стали:</div>
					<select className='blackSelect' onChange={this.steelTypeChange.bind(this)} required value={this.props.currentSteelType}>
						{(()=>{
							if(Object.keys(this.steelTypes).length) return(<option value="">(Не выбрано)</option>)
							return(<option value="" hidden>(Выберите тип изделия)</option>)
						})()}
						{
							Object.keys(this.steelTypes).map((item,index)=>{
								return (<option value={item} key={index}>{this.steelTypes[item].Description}</option>)
							})
						}
					</select>
				</div>
				<div>
					<div>Толщина стали:</div>
					<select className='blackSelect' onChange={this.steelThicknessChange.bind(this)} required value={this.props.currentSteelThickness}>
						{(()=>{
							if(this.steelThickness.length) return(<option value="">(Не выбрано)</option>)
							return(<option value="" hidden>(Выберите тип изделия)</option>)
						})()}
						{
							this.steelThickness.map((item,index)=>{
								return (<option value={item} key={index}>{item}</option>)
							})
						}
					</select>
				</div>
				<div>
					<div>Сталь:</div>
					<select className='blackSelect' required onChange={this.steelChange.bind(this)} value={this.props.currentSteel}>
						{(()=>{
							if(this.steels.length) return(<option value="">(Не выбрано)</option>)
							return(<option value="" hidden>(Выберите тип изделия)</option>)
						})()}
						{
							this.steels.map((item,index)=>{
								return (<option value={item.steelName} key={index}>{item.Title}</option>)
							})
						}						
					</select>
				</div>
			
			</div>
		)
    }
}

export default CommonPanel;
