import MinRequest from '../utils/http'
import store from '../store';
const minRequest = new MinRequest()

// 请求拦截器
console.log(store);
minRequest.interceptors.request((request) => {
  uni.showLoading({
    title: '努力加载中···',
    mask: true,
  });
  request.header.authorization = store.state.app.token;
  return request
})

// 响应拦截器
minRequest.interceptors.response((response) => {
  uni.hideLoading();
  return response.data
})

// 设置默认配置
minRequest.setConfig((config) => {
  config.baseURL = process.env.VUE_APP_BASE_URL
  return config
})


export default {
  // 这里统一管理api请求
  apis: {
    login (data) {
      return minRequest.post('/auth/login', data)
    },
    wxSaveUserByOpenId(data){
      return minRequest.post('/auth/wxSaveUserByOpenId', data)
    },
    createArticle(data){
      return minRequest.post('/articles/create', data)
    },
    listForUser(data){
      return minRequest.post('/articles/listForUser', data)
    },
    articleList(data){
      return minRequest.post('/articles/list', data)
    },
    articleDetail(data){
      return minRequest.get('/articles/detail', data)
    },
    getCommentList(data){
      return minRequest.get('/comments/get', data)
    },
    createComment(data){
      return minRequest.post('/comments/create', data)
    },
    getUser(data){
      return minRequest.get('/auth/user', data)
    },
    getActionStatus(data){
      return minRequest.get('/actions/status', data)
    },
    toggle(data){
      return minRequest.post('/actions/toggle', data)
    },
    getActionList(data){
      return minRequest.post('/actions/getActionList', data)
    },
    followArticleList(data){
      return minRequest.get('/articles/followArticleList', data)
    },
    readNumAdd(data){
      return minRequest.get('/articles/readNumAdd', data)
    },
    getActionNum(data){
      return minRequest.get('/actions/getActionNum', data)
    },
    getCommentNum(data){
      return minRequest.get('/comments/getCommentNum', data)
    },
    getFollowList(data){
      return minRequest.get('/actions/getFollowList', data)
    },
    articleListByUser(data){
      return minRequest.get('/articles/articleListByUser', data)
    },
    userInfoByUserId(data){
      return minRequest.get('/auth/userInfoByUserId', data)
    },
    modifyUserInfo(data){
      return minRequest.post('/users/modifyUserInfo', data)
    },
    friendList(data){
      return minRequest.post('/message/friendList', data)
    },
    messageList(data){
      return minRequest.post('/message/messageList', data)
    },
  }
}