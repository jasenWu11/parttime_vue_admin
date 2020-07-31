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
    url: 'companys/list',
		method: 'post',
		data:qs.stringify(_data)
  })
}

export function getInfo (id) {
	var _data = {
		"id": id
	}
  return request({
    url: 'companys/info',
		method: 'post',
		data:qs.stringify(_data)
  })
}

export function update (companys) {
	var _data = {
		"Id":companys.id,
		"Cname": companys.cname,
		"Address": companys.address,
		"Introduce": companys.introduce,
		"Email": companys.email,
		"Verify": companys.verify,
		"Phone": companys.phone,
		"Scale": companys.scale,
		"Chttp":companys.chttp
	}
  return request({
    url: 'companys/update',
		method: 'post',
		data:qs.stringify(_data)
  })
}

export function resetPassword (companys) {
  var _data = {
    'Id': companys.id,
    'Password': companys.newpwd
  }
  return request({
    url: 'companys/update',
    method: 'post',
    data: qs.stringify(_data)
  })
}