import request from '@/utils/request.js'
var qs = require('qs')
export function getStatistics () {
  return request({
    url: 'statistics/count',
		method: 'get'
  })
}

export function getJobStatistics () {
  return request({
    url: 'statistics/job',
		method: 'get'
  })
}

export function getUserMonth (year) {
	var _data = {
		"year": year
	}
  return request({
    url: 'user/month/list',
		method: 'post',
		data:qs.stringify(_data)
  })
}

export function getJobMonth (year) {
	var _data = {
		"year": year
	}
  return request({
    url: 'job/month/list',
		method: 'post',
		data:qs.stringify(_data)
  })
}

