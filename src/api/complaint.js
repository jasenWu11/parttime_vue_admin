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
    url: 'complaint/list',
		method: 'post',
		data:qs.stringify(_data)
  })
}

export function getInfo (id) {
	var _data = {
		"id": id
	}
  return request({
    url: 'complaint/info',
		method: 'post',
		data:qs.stringify(_data)
  })
}

export function deleteById (id) {
	var _data = {
		"id": id
	}
	return request({
		url: 'complaint/delete',
		method: 'post',
		data:qs.stringify(_data)
	})
}

export function deleteList (ids) {
  return request({
    url: 'complaint/delete/list',
		method: 'post',
		data:ids,
		headers:{
			'Content-Type':'application/json;'
		}
  })
	
}
