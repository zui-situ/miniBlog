import MinRequest from '../utils/http'
import store from '../store';
import { Config,Options } from '../types/http';
const minRequest = new MinRequest()

// 请求拦截器
minRequest.interceptors.request((request:any) => {
  uni.showLoading({
    title: '努力加载中···',
    mask: true,
  });
  request.header.authorization = store.state.app.token;
  return request
})

// 响应拦截器
minRequest.interceptors.response((response:any) => {
  uni.hideLoading();
  if(response.data.code===0){
    return response.data.data;
  }else{
    uni.showToast({
      title: response.data.msg,
      duration: 2000,
      icon:'none'
    })
  }
})

// 设置默认配置
minRequest.setConfig((config:any) => {
  config.baseURL = process.env.VUE_APP_BASE_URL
  return config
})

const apis:any = {
  login (data:any) {
    return minRequest.post('/auth/login', data)
  },
  wxSaveUserByOpenId(data:any){
    return minRequest.post('/auth/wxSaveUserByOpenId', data)
  },
  createArticle(data:any){
    return minRequest.post('/articles/create', data)
  },
  listForUser(data:any){
    return minRequest.post('/articles/listForUser', data)
  },
  articleList(data:any){
    return minRequest.post('/articles/list', data)
  },
  articleDetail(data:any){
    return minRequest.get('/articles/detail', data)
  },
  getCommentList(data:any){
    return minRequest.get('/comments/get', data)
  },
  createComment(data:any){
    return minRequest.post('/comments/create', data)
  },
  getUser(data:any){
    return minRequest.get('/auth/user', data)
  },
  getActionStatus(data:any){
    return minRequest.get('/actions/status', data)
  },
  toggle(data:any){
    return minRequest.post('/actions/toggle', data)
  },
  getActionList(data:any){
    return minRequest.post('/actions/getActionList', data)
  },
  followArticleList(data:any){
    return minRequest.get('/articles/followArticleList', data)
  },
  readNumAdd(data:any){
    return minRequest.get('/articles/readNumAdd', data)
  },
  getActionNum(data:any){
    return minRequest.get('/actions/getActionNum', data)
  },
  getCommentNum(data:any){
    return minRequest.get('/comments/getCommentNum', data)
  },
  getFollowList(data:any){
    return minRequest.get('/actions/getFollowList', data)
  },
  articleListByUser(data:any){
    return minRequest.get('/articles/articleListByUser', data)
  },
  userInfoByUserId(data:any){
    return minRequest.get('/auth/userInfoByUserId', data)
  },
  modifyUserInfo(data:any){
    return minRequest.post('/users/modifyUserInfo', data)
  },
  friendList(data:any){
    return minRequest.post('/message/friendList', data)
  },
  messageList(data:any){
    return minRequest.post('/message/messageList', data)
  },
}
// 这里统一管理api请求
export default { apis }
  