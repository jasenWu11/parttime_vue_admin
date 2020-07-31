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
    url: 'cv/list',
		method: 'post',
		data:qs.stringify(_data)
  })
}

export function download (id) {
	var _data = {
		"id": id
	}
	// var urls = 'cv/download/?id=' + id;
	// window.open(urls, '_blank')
  return request({
    url: 'cv/download5',
		method: 'post',
		data:qs.stringify(_data),
		headers:{
			responseType: 'blob',
			// 'responseType':'arraybuffer' 
			 // 'Content-Type': 'application/octet-stream;charact'
		},
  })
}

export function deleteById (id) {
	var _data = {
		"id": id
	}
	return request({
		url: 'cv/delete',
		method: 'post',
		data:qs.stringify(_data)
	})
}

// export function deleteList (ids) {
//   return request({
//     url: 'cv/delete/list',
// 		method: 'post',
// 		data:ids,
// 		headers:{
// 			'Content-Type':'application/json;'
// 		}
//   })
	
// }
