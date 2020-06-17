/**********************************************************
* Class responsibles for products list form
*
* Класс отвечающий за рендер строки из списка изделий
***********************************************************/

import React, {Component} from 'react';
import './ProductsItemList.css';

class ProductsItemList extends Component{
  render(){
	return(
		<div className='ProductsItemList'>
			<div className='Caption' id={this.props.itemKey}>{this.props.name}</div>
		</div>
	);	
  }
}

export default ProductsItemList;
