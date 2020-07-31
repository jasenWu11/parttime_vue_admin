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
    url: 'profession/list',
		method: 'post',
		data:qs.stringify(_data)
  })
}

export function getInfo (id) {
	var _data = {
		"id": id
	}
  return request({
    url: 'profession/info',
		method: 'post',
		data:qs.stringify(_data)
  })
}

export function deleteById (id) {
	var _data = {
		"id": id
	}
	return request({
		url: 'profession/delete',
		method: 'post',
		data:qs.stringify(_data)
	})
}

export function update (profession) {
	var _data = {
		"Id":profession.id,
		"Name": profession.name,
		"Details": profession.details,
		"characterCode": profession.characterCode
	}
	return request({
		url: 'profession/update',
		method: 'post',
		data:qs.stringify(_data)
	})
}
	
export function add (profession) {
	var _data = {
		"Name": profession.name,
		"Details": profession.details
	}
	return request({
		url: 'profession/add',
		method: 'post',
		data:qs.stringify(_data)
	})
	
	
	
}

	

