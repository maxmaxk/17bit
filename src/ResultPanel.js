/**********************************************************
* Class responsible for product calculation results form render
*
* Класс отвечающий за рендер панели с результатами расчета изделия
***********************************************************/

import React, {Component} from 'react';
import './ResultPanel.css';
import waitIcon from './images/wait.gif'
import errorIcon from './images/errorIcon.png'

class ResultPanel extends Component{
	

	render(){
		
		if(this.props.calcResult.view==='none'){
			return null;
		}
		
		if(this.props.calcResult.view==='wait'){
			return(
				<img className='WaitDetailPanelIcon' src={waitIcon} alt="waitIcon"></img>
			);
		}
		
		let errorIconImg=null;
		let result;
		
		if(this.props.calcResult.view==='error'){
			errorIconImg=(<img src={errorIcon} alt="errorIcon"></img>);
			result='Ошибка ввода параметров: ';
			let errorItems=this.props.calcResult.text.split('.');
			let currentItem=JSON.parse(this.props.calcResult.currentItemProperties);
			let errorTxt=null;
			for (let errorItem of errorItems){
				let nameProp=errorItem.split(' ')[0];
				if(nameProp && currentItem[nameProp]){
					errorTxt=errorItem.slice(errorItem.indexOf(' ')+1);
					if(errorTxt.includes('enum')) errorTxt='Должно быть одним из значений списка';
					result+=currentItem[nameProp].title+'('+errorTxt+'), ';
				}
			}
			if(!errorTxt){
				errorTxt=this.props.calcResult.text;
				if(errorTxt.includes('invalid source name')) errorTxt=' Не выбрано изделие';
				result+=errorTxt;
			}else{
				result=result.slice(0,-2);
			}
			
		}else{
			try{
				let jsonData=JSON.parse(this.props.calcResult.text);
				let materialsArr=[];

				jsonData.Materials.forEach((item)=>{
					let unit='-';
					if(item.ID){
						let idArr=item.ID.split('.');
						let matType=null;
						if(idArr.length>1) matType=idArr[1].slice(0,-1);
						if(matType && this.props.materialTypes[matType]){
							let unitItem=this.props.materialTypes[matType].Unit;
							if(unitItem && this.props.units[unitItem]){
								unit=this.props.units[unitItem].Symbol;
							}
						}
					}
					materialsArr.push({title:item.Title, price:item.Price, consume:item.Consumed, cost:item.Cost, weight:item.Weight, unit:unit});
				});
				
				let productName=jsonData.Name || '';
				
				let productWeigth=0;
				if(jsonData.Metrics && jsonData.Metrics.Weight) productWeigth=jsonData.Metrics.Weight.Value || 0;
				
				let productSurfaceArea='-';
				if(jsonData.Units && jsonData.Units.SurfaceArea) productSurfaceArea=jsonData.Units.SurfaceArea.Value || '-';
				
				let productLinearLength='-';
				if(jsonData.Units && jsonData.Units.LinearLength) productLinearLength=jsonData.Units.LinearLength.Value || '-';
				
				let productPrice='-';
				if(jsonData.Price) productPrice=jsonData.Price.GrossPrice || '-';
				
				
				result=(<div>
							<table>
								<caption>Изделие</caption>
								<tbody>
									<tr>
										<th>Наименование</th>
										<th>Вес</th>
										<th>Площадь</th>
										<th>Длина</th>
										<th>Цена</th>
									</tr>
									<tr>
										<td>{productName}</td>
										<td>{productWeigth}</td>
										<td>{productSurfaceArea}</td>
										<td>{productLinearLength}</td>
										<td>{productPrice}</td>
									</tr>
								</tbody>
							</table>
							<hr/>
							<table>
								<caption>Материалы</caption>
								<tbody>
									<tr>
										<th>Наименование</th>
										<th>Ед.изм.</th>
										<th>Количество</th>
										<th>Цена</th>
										<th>Стоимость</th>
										<th>Вес</th>
									</tr>
									{materialsArr.map((item,index)=>{
										return(
											<tr key={index}>
												<td>{item.title}</td>
												<td>{item.unit}</td>
												<td>{item.consume}</td>
												<td>{item.price}</td>
												<td>{item.cost}</td>
												<td>{item.weight}</td>
											</tr>
										)
									})}
								</tbody>
							</table>
    					</div>)
			}catch(e){
				result='Ошибка ответа сервера: '+e.message;
			}
		}
		
		return(
			<div className='ResultPanel'>
			    {errorIconImg}
				{result}
			</div>
		)
		
	}
}

export default ResultPanel;
