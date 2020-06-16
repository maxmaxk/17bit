/**********************************************************
* Class responsible for popup products list form.
* It implements methods of sorting and filering
*
* Класс отвечающий за рендер вспывающего окна списка изделий.
* Реализованы методы сортировки и фильтрации
***********************************************************/

import React, {Component} from 'react';
import './ProductsList.css';
import ProductsItemList from './ProductsItemList.js'

class ProductsList extends Component{
	
	constructor(){
		super();
		this.filterCount = 0;
		this.sortProducts=this.sortProducts.bind(this);
	}
	
	componentDidUpdate(){
		this.props.transferFilteredCount(this.filterCount);
	}

	compare(item,filter){
		if(filter==='') return true;
		if(item && filter){
			return (item.toUpperCase().indexOf(filter.toUpperCase())>=0)
		}
		return false;
	}
	
	getTitleName(title){
		let lastSpace=title.lastIndexOf(' ');
		return (lastSpace<0)?'':title.slice(0,lastSpace);
	}
	
	getTitleSection(item){
		if(item.indexOf('Round') === 0) return -1;
		if(item.indexOf('Straight') === 0) return 1;
		return 0;
	}
	
	sortProducts(a,b){
		if(this.props.productSort === 'sectionSort'){
			if(this.getTitleSection(a)>this.getTitleSection(b)) return 1;
			if(this.getTitleSection(a)<this.getTitleSection(b)) return -1;
		}
		let titleA=this.props.productsData[a].title;
		let titleB=this.props.productsData[b].title;
		if(this.getTitleName(titleA)>this.getTitleName(titleB)) return 1;
		if(this.getTitleName(titleA)<this.getTitleName(titleB)) return -1;
		return 0;
	}

	render(){
		this.filterCount = 0;
		let leftPos = document.getElementById('productItemInput')?document.getElementById('productItemInput').offsetLeft:0;
		let widthVal = document.getElementById('productItemInput')?document.getElementById('productItemInput').offsetWidth:200;
		let productListKeysArr=Object.keys(this.props.productsData);
		productListKeysArr.sort(this.sortProducts);
		return(
			<div className={this.props.productListStyle} style={{left: leftPos, width: widthVal}}>
				{productListKeysArr.map((item,index)=>{
					if(this.compare(this.props.productsData[item].title,this.props.productFilter)){
						this.filterCount++;
						return (<ProductsItemList name={this.props.productsData[item].title} key={index} itemKey={item}/>)
					}
					return null;
				})}
			</div>
		)
		
	}
}

export default ProductsList;