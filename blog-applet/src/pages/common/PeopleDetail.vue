<template>
    <view clas="bg-white">
        <view class="page-content bg-white">
            <view class="page-top d-flex jc-start ai-center pb-2" :style="{backgroundImage:'url('+(userInfo.backgroundImage || defaultBg)+')'}">
                <!-- <image src="../../static/images/mine/timg.jpg"></image> -->
                <view class="mine-info-head">
                    <image class="user-img" :src="userInfo.avatarUrl"></image>
                </view>
                <view class="d-flex flex-column jc-center ai-start pl-2">
                    <view class="mine-info-main-username text-dark fs-lg text-ellipsis pb-2">
                        <text class="text-white bold fs-xl">{{userInfo.nickName}}</text>
                    </view>
                    <view class="text-grey text-ellipsis">{{userInfo.utograph}}</view>
                </view>
            </view>
            <view class="mine-info">
                <view class="mine-info-main h-100">
                    <view class="text-grey-1 d-flex jc-between ai-center w-100">
                        <view class="d-flex jc-start ai-center">
                            <view class="d-flex flex-column jc-center ai-center"  @click="navigateTo('./PeopleList?current=0')">
                                <text class="bold fs-xl test-black pb-1">{{followInfo.userCount}}</text>
                                <text class="text-grey">关注</text>
                                <!-- <u-icon name="edit-pen-fill" color="#75C3DF" size="40" @click="navigateTo('./WriteBlog')"></u-icon> -->
                            </view>
                            <view class="d-flex flex-column jc-center ai-center pl-6"  @click="navigateTo('./PeopleList?current=1')">
                                <text class="bold fs-xl test-black pb-1">{{followInfo.actionCount}}</text>
                                <text class="text-grey">粉丝</text>
                                <!-- <u-icon name="edit-pen-fill" color="#75C3DF" size="40" @click="navigateTo('./WriteBlog')"></u-icon> -->
                            </view>
                            <view class="d-flex flex-column jc-center ai-center pl-6">
                                <text class="bold fs-xl test-black pb-1">{{articleTotal}}</text>
                                <text class="text-grey">文章</text>
                                <!-- <u-icon name="edit-pen-fill" color="#75C3DF" size="40" @click="navigateTo('./WriteBlog')"></u-icon> -->
                            </view>
                        </view>
                    </view>
                </view>
            </view>
            <view>
                <card-list :list="articleList" :status="status" :showUser="false"></card-list>
            </view>
        </view>
        <view class="d-flex jc-around ai-center d-fixed w-100 bottom-btn bg-white zIndex-999" v-show="user.userId != userId && loginStatus">
            <view class="flex-1 d-flex jc-center ai-center h-100" @click="navigateTo('../message/Chat?friendId='+userId)">
                <u-icon name="liaotian" custom-prefix="custom-icon" size="30" color="#888888"></u-icon>
                <text class="fs-l pl-1">聊天</text>
            </view>
            <view class="flex-1 d-flex jc-center ai-center">
                <button class="follow-btn" v-if="!followStatus" @click="follow">关注</button>
                <view v-else  @click="follow">取消关注</view>
            </view>
        </view>
        <u-toast ref="uToast" />
    </view>
</template>
<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import CardList from '../../components/CardList.vue';
    import { namespace } from 'vuex-class';
	const appModule = namespace('app');
    @Component({
        components: {
            CardList
        }
    })
    export default class Mine extends Vue{
        defaultBg:string = '';
        status:string = 'loadmore';
        pageNo:number = 1;
        pageSize:number = 10;
        totalPage:number = 0;
        articleList:Array<Object> = [];//我的文章列表
        followInfo:any = [];//关注/粉丝信息
        articleTotal:number = 0;//我的文章数量
        userId:string = '';//用户userid
        userInfo:any = {};//用户信息
        followStatus:boolean = false;//关注状态
        $refs!: {
            uToast:HTMLFormElement
        }
        @appModule.Getter('user') user:any
        @appModule.Getter('loginStatus') loginStatus:any;
        onLoad(opt:any){
            this.defaultBg = '../../static/images/mine/timg.jpg'
            this.userId = opt.userId;
            this.getUserInfo();
            this.getArticleList();
            this.getFollowNum();
            this.loginStatus && this.getFollowStatus()
        }
        // onShow(){
        //    this.getArticleList();
        //    this.getActionList();
        // }
        //获取我的文章列表
        getArticleList(){
            this.$http.articleListByUser({
                userId:this.userId,
                pageNo:this.pageNo,
                pageSize:this.pageSize
            }).then((data:any)=>{
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
        async getUserInfo(){
            this.userInfo = await this.$http.userInfoByUserId({
                id:this.userId
            })
        }
        //关注
        follow(){
            this.$http.toggle({
                type:'User',
                object:this.userId,
                name:'follow'
            }).then((data:any)=>{
                this.followStatus = data.status;
                const title = data.status?'关注成功':'取消关注';
                this.$refs.uToast.show({
                    title,
                    type:'success'
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
                user:this.userId,
                object:this.userId
            }).then((data:any)=>{
                this.followInfo = data;
            })
        }
        //获取关注状态
        getFollowStatus(){
            this.$http.getActionStatus({
                type:'User',
                object:this.userId,
                name:'follow'
            }).then((data:any)=>{
                this.followStatus = data.status;
            })
        }
        //下拉刷新
        onReachBottom() {
            if(this.pageNo >= this.totalPage) return ;
            this.status = 'loading';
            this.pageNo = ++ this.pageNo;
            setTimeout(() => {
                this.getArticleList();
            }, 2000)
		}
    }
</script>
<style lang="scss" scope>
    .page-content{
        width:100%;
        margin:0 auto;
        padding-bottom:100rpx;
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
    }
    .bottom-btn{
        border-top:2rpx solid #E6E5EB;
        bottom:0rpx;
        left:0rpx;
        height:100rpx;
    }
    .follow-btn{
        width:230rpx;
        height:66rpx;
        background:linear-gradient(266deg,rgba(89,193,220,0.88),rgba(128,219,243,0.88));
        box-shadow:0rpx 7rpx 7rpx 0rpx rgba(56,183,216,0.29);
        border-radius:36rpx;
        line-height:66rpx;
        text-align: center;
        font-size:28rpx;
        color:#fff;
    }
</style>