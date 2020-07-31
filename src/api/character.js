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
    url: 'character/list',
		method: 'post',
		data:qs.stringify(_data)
  })
}

export function getInfo (id) {
	var _data = {
		"id": id
	}
  return request({
    url: 'character/info',
		method: 'post',
		data:qs.stringify(_data)
  })
}

export function deleteById (id) {
	var _data = {
		"id": id
	}
	return request({
		url: 'character/delete',
		method: 'post',
		data:qs.stringify(_data)
	})
}

export function update (character) {
	var _data = {
		"id":character.id,
		"name": character.name,
		"content": character.content,
		// "code": character.code,
	}
	return request({
		url: 'character/update',
		method: 'post',
		data:qs.stringify(_data)
	})
}
	
export function add (character) {
	var _data = {
		"name": character.name,
		"content": character.content,
		"code": character.code,
	}
	return request({
		url: 'character/add',
		method: 'post',
		data:qs.stringify(_data)
	})
	
	
	
}

	

