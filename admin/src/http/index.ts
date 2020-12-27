import axios from 'axios';
import Vue from 'vue';
import router from '../router';
import store from '../store';
const http = axios.create({
    baseURL:process.env.VUE_APP_API_URL,
    timeout: 60000,
})

http.interceptors.request.use((config)=>{
    if(store.state.token){
        config.headers.Authorization = 'Bearer ' + store.state.token;
    }else{
        router.push('/login');
    }
    return config;
},(error)=>{
    return Promise.reject(error);
})

http.interceptors.response.use(res=>{
    return res.data;
},err=>{
    if(err.response.data.message){
        Vue.prototype.$message({
            type:'error',
            message:err.response.data.message
        })
        if(err.response.status === 401){
            router.push('/login');
        }
    }
    return Promise.reject(err);
})


export default http;