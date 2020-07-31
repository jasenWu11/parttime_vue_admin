import request from '@/utils/request.js'
var qs = require('qs')
export function getOrderStatus () {
  return request({
    url: 'andre/order/admin/status.do',
		method: 'get'
  })
}

export function getUserStatus () {
  return request({
    url: 'andre/user/admin/status.do',
		method: 'get'
  })
}

export function getUserMonth (year) {
	var _data = {
		"year": year
	}
  return request({
    url: 'andre/user/admin/month.do',
		method: 'post',
		data:qs.stringify(_data)
  })
}


