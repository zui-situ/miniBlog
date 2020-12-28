<template>
    <view class="bg-white h-100">
        <view class="page-content bg-white">
            <view class="page-top d-flex jc-start ai-center pb-2" :style="{backgroundImage:'url('+(userInfo.backgroundImage || defaultBg)+')'}">
                <!-- <image src="../../static/images/mine/timg.jpg"></image> -->
                <view class="mine-info-head" @click="loginStatus && navigateTo('./PersonalData')">
                    <open-data type="userAvatarUrl" class="user-img"></open-data>
                </view>
                <view class="d-flex flex-column jc-center ai-start pl-2">
                    <view class="mine-info-main-username text-dark fs-lg text-ellipsis pb-2">
                        <text class="text-white bold fs-xl" v-if="userInfo.nikeName">{{userInfo.nikeName}}</text>
                        <open-data type="userNickName" class="text-white bold fs-xl" v-else></open-data>
                    </view>
                    <view class="text-grey text-ellipsis" v-if="loginStatus">{{userInfo.utograph}}</view>
                </view>
            </view>
            <view class="mine-info">
                <view class="mine-info-main h-100">
                    <view class="text-grey-1 d-flex jc-between ai-center w-100" v-if="loginStatus">
                        <view class="d-flex jc-start ai-center">
                            <view class="d-flex flex-column jc-center ai-center"  @click="navigateTo('./PeopleList?current=0')">
                                <text class="bold fs-xl test-black pb-1">{{followInfo.userCount || 0}}</text>
                                <text class="text-grey">关注</text>
                                <!-- <u-icon name="edit-pen-fill" color="#75C3DF" size="40" @click="navigateTo('./WriteBlog')"></u-icon> -->
                            </view>
                            <view class="d-flex flex-column jc-center ai-center pl-6"  @click="navigateTo('./PeopleList?current=1')">
                                <text class="bold fs-xl test-black pb-1">{{followInfo.actionCount || 0}}</text>
                                <text class="text-grey">粉丝</text>
                                <!-- <u-icon name="edit-pen-fill" color="#75C3DF" size="40" @click="navigateTo('./WriteBlog')"></u-icon> -->
                            </view>
                            <view class="d-flex flex-column jc-center ai-center pl-6">
                                <text class="bold fs-xl test-black pb-1">{{articleTotal}}</text>
                                <text class="text-grey">文章</text>
                                <!-- <u-icon name="edit-pen-fill" color="#75C3DF" size="40" @click="navigateTo('./WriteBlog')"></u-icon> -->
                            </view>
                        </view>
                        <view>
                            <u-icon name="edit-pen-fill" color="#75C3DF" size="60" @click="navigateTo('./WriteBlog')"></u-icon>
                        </view>
                    </view>
                    <view class="w-100" v-if="!loginStatus">
                        <u-button type="primary" @getuserinfo="onGotUserInfo" open-type="getUserInfo" lang="zh_CN">登录</u-button>
                    </view>
                </view>
            </view>
            <view v-if="loginStatus">
                <u-tabs :list="list" :is-scroll="false" :current="current" @change="tabsChange" active-color="#75C3DF" ref="uTabs" class="bg-grey-2"></u-tabs>
                <view v-if="current===0">
                    <card-list :list="articleList" :status="status"></card-list>
                </view>
                <view v-if="current===1">
                    <card-list :list="collectionList" :status="collectStatus"></card-list>
                </view>
            </view>
            
        </view>
    </view>
</template>
<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import CardList from '../../components/CardList.vue';
    import { namespace } from 'vuex-class';
    const appModule = namespace('app');
    const chatModule = namespace('chat');
    @Component({
        components: {
            CardList
        }
    })
    export default class Mine extends Vue{
        defaultBg:string = '';
        list:Array<any> = [{
            name: '作品'
        }, {
            name: '收藏'
        }]
        current:number = 0;// tabs组件的current值，表示当前活动的tab选项
        status:string = 'loadmore';
        pageNo:number = 1;
        pageSize:number = 10;
        totalPage:number = 0;
        collectPageNo:number = 1;//收藏列表页数
        collectPageSize:number = 10;//收藏列表页数
        collectTotalPage:number = 0;//收藏列表总页数
        collectStatus:string = 'loadmore';//收藏列表状态
        articleList:Array<Object> = [];//我的文章列表
        collectionList:Array<Object> = [];//收藏的文章列表
        followInfo:any = [];//关注/粉丝信息
        articleTotal:number = 0;//我的文章数量
        userInfo:any = {};
        @appModule.Getter('user') user:any
        @appModule.Getter('loginStatus') loginStatus:any
        @appModule.Action('login') login:any
        @chatModule.Action('connectSocket') connectSocket: any;
        onLoad(){
            this.defaultBg = '../../static/images/mine/timg.jpg'
            this.loginStatus && this.init();
        }
        init(){
            this.getUserInfo();
            this.getArticleList();
            this.getActionList();
            this.getFollowNum();
        }
        // onShow(){
        //    this.getArticleList();
        //    this.getActionList();
        // }
        //tab方法
        tabsChange(index:number):void {
            this.current = index;
        }
        //授权按钮
	    onGotUserInfo(e:any) {
            let _this = this;
            //用户按了允许授权按钮 ——> 跳转登录页面
            if (e.detail.errMsg == 'getUserInfo:ok') {
                let userInfo = e.detail.userInfo;
                //登录获取临时code
                uni.login({
                    provider: 'weixin',
                    success: async function(res:any) {
                        if (res.code) {
                            await _this.login({
                                "appId": process.env.VUE_APP_ID,
                                "code": res.code,
                                "nickName": userInfo.nickName,
                                "avatarUrl": userInfo.avatarUrl
                            })
                            _this.init();
                            _this.connectSocket();
                        }
                    }
                })
            }
        }
        async getUserInfo(){
            this.userInfo = await this.$http.getUser();
        }
        //获取我的文章列表
        getArticleList(){
            this.$http.listForUser({
                pageNo:this.pageNo,
                pageSize:this.pageSize
            }).then((data:any)=>{
                uni.stopPullDownRefresh();
                this.totalPage = data.pagination.totalPage;
                if(this.pageNo>=this.totalPage) this.status = 'nomore';
                else this.status = 'loading';
                this.articleTotal = data.pagination.totalCount;
                data.list.map(async (item:any)=>{
                    item.commentNum = await this.getCommentNum(item._id);
                    this.articleList.push(item);
                })
            })
        }
        //获取我收藏的文章列表
        getActionList(){
            this.$http.getActionList({
                pageNo:this.collectPageNo,
                pageSize:this.collectPageSize,
                type:"Article",
                name:"collection",
                user:this.user.userId
            }).then((data:any)=>{
                uni.stopPullDownRefresh();
                this.collectTotalPage = data.pagination.totalPage;
                if(this.collectPageNo>=this.collectTotalPage) this.collectStatus = 'nomore';
                else this.collectStatus = 'loading';
                data.list.map(async(item:any)=>{
                    item.object.commentNum = await this.getCommentNum(item.object._id);
                    this.collectionList.push(item.object);
                })
            })
        }
        //获取评论数
        getCommentNum(id:string){
            return new Promise(resolve=>{
                this.$http.getCommentNum({
                    id
                }).then((data:number)=>{
                    resolve(data);
                })
            })
        }
        //获取粉丝/关注数
        getFollowNum(){
            this.$http.getActionNum({
                type:'User',
                name:'follow',
                user:this.user.userId,
                object:this.user.userId
            }).then((data:any)=>{
                this.followInfo = data;
            })
        }
        //上拉加载
        onReachBottom() {
            if(this.current===0){
                if(this.pageNo >= this.totalPage) return ;
                this.status = 'loading';
                this.pageNo = ++ this.pageNo;
                setTimeout(() => {
                    this.getArticleList();
                }, 2000)
            }else{
                if(this.collectPageNo >= this.collectTotalPage) return ;
                this.collectStatus = 'loading';
                this.collectPageNo = ++ this.collectPageNo;
                setTimeout(() => {
                    this.getActionList();
                }, 2000)
            }
			
        }
        //下拉刷新
        onPullDownRefresh(){
            if(this.current===0){
                this.pageNo = 1;
                this.getArticleList();
            }else{
                this.collectPageNo = 1;
                this.getActionList();
            }
		}
    }
</script>
<style lang="scss" scope>
    .page-content{
        width:100%;
        margin:0 auto;
        .page-top{
            background-repeat:no-repeat;
            -webkit-background-size: 100% 100%;
            -o-background-size: 100% 100%;
            background-size:100% 100%;
            background-position: 0 0;
            padding-top:360rpx;
            image{
                @include wh(100%,356rpx);
            }
        }
        .mine-info{
            @include bb();
            &-head{
                padding-left:20rpx;
                .user-img{
                    overflow:hidden;
                    display: block;
                    @include wh(110rpx);
                    margin: 20rpx;
                    margin-bottom:20rpx;
                    border-radius: 50%;
                    border: 2px solid #fff;
                    box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.2);
                }
            }
            &-main{
                padding:24rpx 30rpx 24rpx 44rpx; 
                @include fcaj(flex-start,space-between);
                &-username{
                    font-weight:700;
                }
            }
            &-btn{
                position:absolute;
                right:-50rpx;
                top:128rpx;
                z-index: 999;
                image{
                    @include wh(100rpx);
                }   
            }
        }
        .login-icon{
            image{
                @include wh(140rpx);
            }
        }
        .article-list{
            padding:30rpx;
            @include bt();
            &-item{
                padding:30rpx 0;
                border-radius: 16rpx;
                box-shadow: 0rpx 1rpx 24rpx 0rpx rgba(118, 118, 118, 0.15);
                &-head{
                    padding:0 30rpx;
                    image{
                        @include wh(100rpx);
                        border-radius: 50%;
                    }
                }
                &-content{
                    padding:20px 30rpx;
                }
                // &-img{
                //     @include wh()
                // }
                &-bottom{
                    padding:20rpx 30rpx 0 30rpx;
                    @include bt();
                    image{
                        @include wh(30rpx);
                    }
                }
                
            }
        }
    }
</style>