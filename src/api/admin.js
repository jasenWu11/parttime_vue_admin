import request from '@/utils/request.js'
var qs = require('qs')

export function toLogin (username,password) {
	var _data = {
		"UserName":username,
		"Password":password,
	}
  return request({
    url: 'admins/login',
		method: 'post',
		data:qs.stringify(_data)
  })
}

export function getUserInfo (id) {
//	JSON.parse(sessionStorage.getItem('user'))
 var _data = {
		"id":id
	}
  return request({
    url: 'admins/info',
		method: 'post',
		data:qs.stringify(_data)
  })
}

// 登出
export function toLoginOut () {
  return request({
    url: 'user/loginout',
		method: 'get'
  })
}


export function updateUser (user) {
	var _data = {
		"id":user.id,
		"nickname": user.nickname,
		"phone": user.phone,
		"username":user.username
	}
  return request({
    url: 'admins/update',
		method: 'post',
		data:qs.stringify(_data)
  })
}

export function updatePassword (user) {
	var _data = {
		"id":user.id,
		"password": user.password,
		"oldPassword": user.oldPassword
	}
  return request({
    url: 'admins/update',
		method: 'post',
		data:qs.stringify(_data)
  })
}