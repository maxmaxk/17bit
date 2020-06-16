/**********************************************************
* Module implements get/post requests to services
*
* Модуль выполняющий get/post запросы к сервисам
***********************************************************/


import {dbServiceUrl} from './Urls.js'
export function dataRequest(url,item){
	return new Promise((resolve,reject)=>{
		
		let getHeaders = new Headers();
		getHeaders.append("Content-Type", "text/plain; charset=utf-8");
		
		let reqUrl=url;
		if(item) reqUrl+='&byname='+item;
		
		let options={
			method: "GET",
			headers: getHeaders,
		}

		
		fetch(reqUrl,options)
		.then((response)=>{
			return response.json();
		},(e)=>{
			throw(new Error('Not connect to server'));
		})
		.then((data)=>{
			if(data===undefined){
				throw(new Error('Server not return data'));
			}
			if(!data.OK){
				throw(new Error('Server return error:'+data.Error))
			}
			resolve(data.Result);
		})
		.catch((e)=>{
			reject(e);
		})
		
	})
}

export function dataPost(url,item,data,contentType = 'text/plain'){
	return new Promise((resolve,reject)=>{
		
		let getHeaders = new Headers();
		getHeaders.append("Content-Type", contentType + "; charset=utf-8");
		
		let reqUrl=url;
		if(item) reqUrl+=item;
		
		let options={
			method: "POST",
			headers: getHeaders,
			body: data,
		}
		if(url.includes(dbServiceUrl)) options.credentials = 'include'
		
		fetch(reqUrl,options)
		.then((response)=>{
			return response.json();
		},(e)=>{
			throw(new Error('Not connect to server'));
		})
		.then((data)=>{
			if(data===undefined){
				throw(new Error('Server not return data'));
			}
			if(!data.OK){
				throw(new Error(data.Error))
			}
			resolve(data.Result);
		})
		.catch((e)=>{
			reject(e);
		})
		
	})
}