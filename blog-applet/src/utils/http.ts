const config = Symbol('config')
const isCompleteURL = Symbol('isCompleteURL')
const requestBefore = Symbol('requestBefore')
const requestAfter = Symbol('requestAfter')
import { Config,Options } from '../types/http';

class MinRequest {
  [config]:Config = {
    baseURL: '',
    header: {
      'content-type': 'application/json'
    },
    method: 'GET',
    dataType: 'json',
    responseType: 'text'
  }
  interceptors = {
    request: (func:any) => {
      if (func) {
        MinRequest[requestBefore] = func
      } else {
        MinRequest[requestBefore] = (request) => request
      }
    },
    response: (func:any) => {
      if (func) {
        MinRequest[requestAfter] = func
      } else {
        MinRequest[requestAfter] = (response) => response
      }
    }
  }
  static install: (Vue: any) => void;

  static [requestBefore] (config:Config) {
    return config
  }

  static [requestAfter] (response:any) {
    return response
  }

  static [isCompleteURL] (url:string) {
    return /(http|https):\/\/([\w.]+\/?)\S*/.test(url)
  }

  setConfig (func:Function) {
    this[config] = func(this[config])
  }

  request (options:any = {}) {
    options.baseURL = options.baseURL || this[config].baseURL
    options.dataType = options.dataType || this[config].dataType
    options.url = MinRequest[isCompleteURL](options.url) ? options.url : (options.baseURL + options.url)
    options.data = options.data
    options.header = {...options.header, ...this[config].header}
    options.method = options.method || this[config].method

    options = {...options, ...MinRequest[requestBefore](options)}

    return new Promise((resolve, reject) => {
      options.success = function (res:any) {
        resolve(MinRequest[requestAfter](res))
      }
      options.fail= function (err:any) {
        reject(MinRequest[requestAfter](err))
      }
      uni.request(options)
    })
  }

  get (url:string, data:any, options:any = {}) {
    options.url = url
    options.data = data
    options.method = 'GET'
    return this.request(options)
  }

  post (url:string, data:any, options:any = {}) {
    options.url = url
    options.data = data
    options.method = 'POST'
    return this.request(options)
  }
}

MinRequest.install = function (Vue:any) {
  Vue.mixin({
    beforeCreate: function () {
			if (this.$options.minRequest) {
				Vue._minRequest = this.$options.minRequest
			}
    }
  })
  Object.defineProperty(Vue.prototype, '$http', {
    get: function () {
			return Vue._minRequest.apis
		}
  })
}

export default MinRequest