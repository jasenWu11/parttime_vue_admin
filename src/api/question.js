import request from '@/utils/request.js'
var qs = require('qs')
export function getList (pageIndex, pageSize, name) {
	var _data = {
		"pageIndex": pageIndex,
		"pageSize": pageSize
	}
	if (name != null && name.length > 0) {
			_data.searchName = name;
	} 
  return request({
    url: 'question/list',
		method: 'post',
		data:qs.stringify(_data)
  })
}

export function getInfo (id) {
	var _data = {
		"id": id
	}
  return request({
    url: 'question/info',
		method: 'post',
		data:qs.stringify(_data)
  })
}

export function deleteById (id) {
	var _data = {
		"id": id
	}
	return request({
		url: 'question/delete',
		method: 'post',
		data:qs.stringify(_data)
	})
}

export function deleteList (ids) {
  return request({
    url: 'question/delete/list',
		method: 'post',
		data:ids,
		headers:{
			'Content-Type':'application/json;'
		}
  })
	
}

export function update (question) {
	var _data = {
		"Id":question.id,
		"ProfessionId": question.professionId,
		"Education": question.education,
		"Title": question.title,
		"JobDescribe": question.jobDescribe,
		"JobRequire": question.jobRequire,
		"EmployNum": question.employNum
	}
	return request({
		url: 'question/update',
		method: 'post',
		data:qs.stringify(_data)
	})
}
	
export function add (params) {

	// var _data = {
	// 	"params": question
	// }
	return request({
		url: 'question/add',
		method: 'post',
		data: params,
		headers:{
			'Content-Type':'application/json;charset=utf-8'
		}
	})
	
	
	
}

	

