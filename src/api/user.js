import request from '@/utils/request.js'
var qs = require('qs')
export function getUserList (pageIndex, pageSize, name) {
	var _data = {
		"pageIndex": pageIndex,
		"pageSize": pageSize
	}
	if (name != null && name.length > 0) {
			_data.searchName = name;
	} 
  return request({
    url: 'user/list',
		method: 'post',
		data:qs.stringify(_data)
  })
}

export function getUserInfo (id) {
	var _data = {
		"id": id
	}
  return request({
    url: 'user/info',
		method: 'post',
		data:qs.stringify(_data)
  })
}

export function updateUser (user) {
	var _data = {
		"Id":user.id,
		"Sex": user.sex,
		"City": user.city,
		"Nature": user.nature,
		"Email": user.email,
		"Phone": user.phone,
		// "UserName":user.username,
		"Married":user.married
	}
  return request({
    url: 'user/update',
		method: 'post',
		data:qs.stringify(_data)
  })
}

export function resetPassword (user) {
  var _data = {
    'Id': user.id,
    'Password': user.newpwd
  }
  return request({
    url: 'user/update',
    method: 'post',
    data: qs.stringify(_data)
  })
}