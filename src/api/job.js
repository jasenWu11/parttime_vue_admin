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
    url: 'job/list',
		method: 'post',
		data:qs.stringify(_data)
  })
}

export function getInfo (id) {
	var _data = {
		"id": id
	}
  return request({
    url: 'job/info',
		method: 'post',
		data:qs.stringify(_data)
  })
}

export function deleteById (id) {
	var _data = {
		"id": id
	}
	return request({
		url: 'job/delete',
		method: 'post',
		data:qs.stringify(_data)
	})
}

export function update (job) {
	var _data = {
		"Id":job.id,
		"ProfessionId": job.professionId,
		"Education": job.education,
		"Title": job.title,
		"JobDescribe": job.jobDescribe,
		"JobRequire": job.jobRequire,
		"EmployNum": job.employNum
	}
	return request({
		url: 'job/update',
		method: 'post',
		data:qs.stringify(_data)
	})
}
	
export function add (job) {
	var _data = {
		"Name": job.name,
		"Details": job.details
	}
	return request({
		url: 'job/add',
		method: 'post',
		data:qs.stringify(_data)
	})
	
	
	
}

	

