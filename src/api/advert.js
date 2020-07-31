import request from '@/utils/request.js'
var qs = require('qs')

export function addAdvert (obj) {
  var _data = {
    'Title': obj.title,
    'Urls': obj.urls,
    'Photo': obj.photo,
		'Details': obj.details
  }
  return request({
    url: 'advert/add',
    method: 'post',
    data: qs.stringify(_data)
  })
}

export function getAdvertList (pageIndex, pageSize, searchName) {
  var _data = {
    'pageIndex': pageIndex,
    'pageSize': pageSize
  }
  if (searchName != null && searchName.length > 0) {
    _data.searchName = searchName
  }

  return request({
    url: 'advert/list',
    method: 'post',
    data: qs.stringify(_data)
  })
}

export function updateAdvert (obj) {
  var _data = {
   'Id': obj.id,
   'Title': obj.title,
   'Urls': obj.urls,
   'Photo': obj.photo,
   'Details': obj.details
  }
  return request({
    url: 'advert/update',
    method: 'post',
    data: qs.stringify(_data)
  })
}

export function getInfo (id) {
	var _data = {
		"id": id
	}
  return request({
    url: 'advert/info',
		method: 'post',
		data:qs.stringify(_data)
  })
}

export function deleteList (ids) {
  return request({
    url: 'advert/delete/list',
		method: 'post',
		data:ids,
		headers:{
			'Content-Type':'application/json;'
		}
  })
}

// 图片上传
export function uploadIMG (image) {
	return request({
		url: 'advert/upload',
		method: 'post',
		data: image
	})
}
	
