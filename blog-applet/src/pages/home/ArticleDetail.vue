<template>
    <view class="h-100 bg-white">
        <view class="page-content p-2 bg-white">
            <view>
                <view class="d-flex jc-between ai-center" v-if="articleDetail">
                    <view class="article-head jc-start ai-center d-flex">
                        <image :src="articleDetail.user.avatarUrl" class="mr-2" @click="navigateTo('../common/PeopleDetail?userId='+articleDetail.user._id)"></image>
                        <view class="d-flex flex-column ai-start jc-center">
                            <text class="fs-md">{{articleDetail.user.nickName}}</text>
                            <view>
                                <text class="text-grey fs-xs pr-2">{{getDateDiff(articleDetail.createdAt)}}</text>
                                <text class="text-grey fs-xs">阅读：{{articleDetail.readNum}}</text>
                            </view>
                        </view>
                        
                    </view>
                    <view class="d-flex jc-end ai-center text-grey">
                        <view class="d-flex flex-column jc-between ai-center mr-3">
                            <u-icon name="star-fill" :color="collectStatus?'#75C3DF':''" @click="collect" size="34"></u-icon>
                            <text class="mt-1">收藏</text>
                        </view>
                        <view class="d-flex flex-column jc-between ai-center" v-if="!isMine">
                            <u-icon name="man-add-fill" size="34" @click="follow" :color="followStatus?'red':''"></u-icon>
                            <text class="mt-1">关注</text>
                        </view>
                    </view>
                </view>
                <view class="pt-3">
                    <view class="pb-3">{{articleDetail.content}}</view>
                    <view class="img-list d-flex jc-start ai-center flex-wrap">
                        <view v-for="(item,index) in articleDetail.imgList" :key="`img-${index}`" class="pr-2 img-item">
                            <image :src="item[0]" mode="aspectFill" class="pt-1"></image>
                        </view>
                    </view>
                </view>
            </view>
            <view class="comment-part pt-3">
                <text class="comment-title">评论</text>
                <u-gap height="2" bg-color="#bbb"></u-gap>
                <view class="comment-list">
                    <view class="comment-item pt-3 pb-3" v-for="item in commentList" :key="item._id">
                        <view class="d-flex jc-between ai-center pb-1">
                            <view class="comment-item-top d-flex jc-start ai-center">
                                <view class="mr-2">
                                    <image src="../../static/images/home/no-img.png" v-if="!item.user"></image>
                                    <image :src="item.user.avatarUrl" v-else @click="navigateTo('../common/PeopleDetail?userId='+item.user._id)"></image>
                                </view>
                                <view class="d-flex flex-column jc-start ai-between">
                                    <view class="fs-md text-dark bold pb-1">
                                        <text v-if="!item.user">游客</text>
                                        <text v-else>{{item.user.nickName}}</text>
                                    </view>
                                    <text class="fs-xs text-grey">{{getDateDiff(item.createdAt)}}</text>
                                </view>
                            </view>
                            <view v-if="user" class="pr-2">
                                <u-icon name="thumb-up-fill" size="50" :color="item.status?'#75C3DF':'#999'" class="pr-1" @click="upVote(item)"></u-icon>
                                <text v-if="item.count">{{item.count}}</text>
                            </view>
                        </view>
                        <view  class="comment-content">
                            <text>{{item.content}}</text>
                        </view>
                    </view>
                    <view class="pb-3 pt-2">
                        <u-empty text="暂无评论" mode="list" v-if="commentList.length===0"></u-empty>
                        <u-loadmore :status="status" v-else />
                    </view>
                </view>
            </view>
            <view class="comment-input d-flex jc-between ai-center bg-grey-2 w-100 zIndex-999">
                <view class="bg-white mr-2">
                    <u-field v-model="content" placeholder="你想说的话···" label-width="0"></u-field>
                </view>
                <view>
                    <u-button type="primary" size="medium" slot="button" @click="createComment">发表</u-button>
                </view>
                    
            </view>
        </view>
        <u-toast ref="uToast" />
    </view>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';  
    import { namespace } from 'vuex-class';
    const appModule = namespace('app');
    @Component({})

    export default class Home extends Vue{
        id:string = '';
        articleDetail:any = {};//文章详情
        commentList:Array<Object> = [];//评论列表
        content:string = '';//评论内容
        pageNo:number = 1;
        pageSize:number = 10;
        status:string = 'loadmore';
        totalPage:number = 0;
        collectStatus:boolean = false;//文章收藏状态
        followStatus:boolean = false;//用户关注状态
        $refs!: {
            uToast:HTMLFormElement
        }
        isMine:boolean = false;//是否自己的文章
        @appModule.Getter('user') user:any
        @appModule.Getter('loginStatus') loginStatus:any;
        userId:string = this.$store.state.userId || null;
        articleUser:string = '';
        onLoad(opt:any){
            this.articleUser = opt.user;
            if(this.articleUser === this.user.userId){
                this.isMine = true;
            }
            this.id = opt.id;
            this.readNumAdd();
            this.getDetail();
            if(this.loginStatus){
                this.getCollectStatus();
                this.getFollowStatus();
            }
            this.getCommentList();
        }
        //获取文章详情
        getDetail(){
            this.$http.articleDetail({
                id:this.id
            }).then((data:any)=>{
                this.articleDetail = data;
            })
        }
        //获取评论列表
        getCommentList(){
            this.$http.getCommentList({
                id:this.id,
                pageNo:this.pageNo,
                pageSize:this.pageSize
            }).then((data:any)=>{
                this.totalPage = data.pagination.totalPage;
                if(this.pageNo>=this.totalPage) this.status = 'nomore';
                else this.status = 'loading';
                data.list.map(async (item:any)=>{
                    item.status = await this.getStatus('Comment','upVote',item._id);
                    this.commentList.push(item);
                })
            })
        }
        readNumAdd(){
            this.$http.readNumAdd({
                id:this.id
            }).then((data:any)=>{
                console.log(data);
            })
        }
        //点赞
        upVote(item:any){
            this.$http.toggle({
                type:'Comment',
                object:item._id,
                name:'upVote'
            }).then((data:any)=>{
                item.status = data.status;
                data.status?item.count++ : item.count--;
                this.$forceUpdate();
            })
        }
        //收藏
        collect(){
            this.$http.toggle({
                type:'Article',
                object:this.id,
                name:'collection'
            }).then((data:any)=>{
                this.collectStatus = data.status;
                const title = data.status?'收藏成功':'取消收藏';
                this.$refs.uToast.show({
                    title,
                    type:'success'
                })
            })
        }
        //关注
        follow(){
            this.$http.toggle({
                type:'User',
                object:this.articleUser,
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
        //获取收藏状态
        async getCollectStatus(){
            this.collectStatus = await this.getStatus('Article','collection',this.id)
        }
        //获取关注状态
        async getFollowStatus(){
            this.followStatus = await this.getStatus('User','follow',this.articleUser)
        }
        //获取状态
        getStatus(type:string,name:string,object:string):Promise<boolean>{
            return new Promise(resolve=>{
                this.$http.getActionStatus({
                    type,
                    object,
                    name,
                }).then((data:any)=>{
                    resolve(data.status);
                })
            })
        }
        //新建评论
        async createComment(){
            if(!this.content){
                this.$refs.uToast.show({
                    title: '请输入评论内容',
                    type:'warning'
                }) 
                return;
            }
            this.$http.createComment({
                user:this.user.userId,
                content:this.content,
                article:this.id
            }).then((data:any)=>{
                this.content = '';
                this.$refs.uToast.show({
                    title: '评论成功',
                    type:'success'
                })
                this.pageNo = 1;
                this.commentList = [];
                this.getCommentList();
            })
        }
        //下拉刷新
        onReachBottom() {
			if(this.pageNo >= this.totalPage) return ;
			this.status = 'loading';
			this.pageNo = ++ this.pageNo;
			setTimeout(() => {
				this.getCommentList();
			}, 2000)
		}
    }
</script>
<style lang="scss" scope>
    .page-content{
        padding-bottom:150rpx;
    }
    .comment-part{
        .comment-title{
            border-bottom:8rpx solid #75C3DF
        }
        .comment-list{
            .comment-item{
                &-top{
                    image{
                        @include wh(90rpx);
                        border-radius: 50%;
                    }
                }
                .comment-content{
                    padding-left:110rpx;
                }
            }
        }
    }
    .article-head{
        image{
            @include wh(100rpx);
            border-radius: 50%;
        }
    }
    .img-list{
        .img-item:nth-child(3n){
            padding-right:0;
        }
        image{
            border-radius:10rpx;
            @include wh(220rpx);
        }
    }
    .comment-input{
        padding:13rpx 24rpx;
        position: fixed;
        bottom:0;
        left:0;
    }
</style>