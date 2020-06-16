/**********************************************************
* Class responsible for left panel render (image of product)
*
* Класс отвечающий за рендер левой панели изображения изделия
***********************************************************/

import React, {Component} from 'react';
import './PicturePanel.css';

class PicturePanel extends Component{
	
	constructor(props){
		super(props);
		this.state={
			image: null,
		}
		this.currentProductId = null;
	}
	
	checkImage(src,onload,onerror){
		let image = new Image();
		image.onload = onload.bind(this,image);
		image.onerror = onerror.bind(this);
		image.src = src;
	}
	
	imageOnload(image){
		this.setState({image:image});
		this.currentProductId = this.props.currentProductId;
	}

	imageOnerror(){
		this.setState({image:undefined});
		this.currentProductId = this.props.currentProductId;
	}
	
	render(){
		if(this.currentProductId!==this.props.currentProductId)
			this.checkImage(process.env.PUBLIC_URL+'/imagesTypes/0'+this.props.currentProductId+'.gif',this.imageOnload,this.imageOnerror);
		this.filterCount = 0;
		if(this.state.image===null){
			return(
				<div className='NoPicture'>
					Изделие не выбрано
				</div>
			)
		}
		
		if(this.state.image===undefined){
			return(
				<div className='NoPicture'>
					Изображение изделия отсутствует
				</div>
			)
		}

		
		return(
			<div className='PicturePanel'>
				<img src={this.state.image.src} alt='productImage'></img>
			</div>
		)
		
	}
}

export default PicturePanel;
