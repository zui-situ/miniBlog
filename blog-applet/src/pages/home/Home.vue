<template>
    <view class="home bg-white">
        <view class="page-content bg-white">
            <view>
                <u-sticky>
                    <view class="pr-7 pl-7 w-100 bg-white">
                        <u-tabs :list="tabList" :is-scroll="false" :current="current" @change="tabsChange" active-color="#75C3DF" ref="tabs"></u-tabs>
                    </view>
                </u-sticky>
                <view>
                    <view v-if="current===0">
                        <card-list :list="articleList" :status="status"></card-list>
                    </view>
                    <view v-else-if="current===1">
                        <card-list :list="followionList" :status="followStatus"></card-list>
                    </view>
                </view>
                
            </view>
        </view>
    </view>
</template>
<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import CardList from '../../components/CardList.vue';  
    import { namespace } from 'vuex-class';
    const chatModule = namespace('chat');
    const appModule = namespace('app');
    @Component({ 
        components: {
            CardList
        }
    })

    export default class Home extends Vue{
        tabList:Array<Object> = [{
            name: '推荐'
        }, {
            name: '关注'
        }]
        current:number = 0;// tabs组件的current值，表示当前活动的tab选项
        pageNo:number = 1;
        pageSize:number = 10;
        totalPage:number = 0;
        status:string = 'loadmore';
        followPageNo:number = 1;//收藏列表页数
        followPageSize:number = 10;//收藏列表页数
        followTotalPage:number = 0;//收藏列表总页数
        followStatus:string = 'loadmore';//收藏列表状态
        articleList:Array<Object> = [];//我的文章列表
        followionList:Array<Object> = [];//收藏的文章列表
        @chatModule.Action('connectSocket') connectSocket: any;
        @appModule.Getter('loginStatus') loginStatus:any;
        onLoad(){
            this.getArticleList();
            if(this.loginStatus){
                this.followArticleList();
                this.connectSocket();
            }
        }
        //tab方法
        tabsChange(index:number):void {
            this.current = index;
        }
        //获取推荐文章列表
        getArticleList(){
            this.$http.articleList({
                pageNo:this.pageNo,
                pageSize:this.pageSize
            }).then((data:any)=>{
                this.totalPage = data.pagination.totalPage;
                if(this.pageNo>=this.totalPage) this.status = 'nomore';
                else this.status = 'loading';
                data.list.map(async(item:any)=>{
                    item.commentNum = await this.getCommentNum(item._id);
                    this.articleList.push(item);
                })
            })
        }
        //获取关注的用户的文章列表
        followArticleList(){
            this.$http.followArticleList({
                pageNo:this.pageNo,
                pageSize:this.pageSize
            }).then((data:any)=>{
                this.followTotalPage = data.pagination.totalPage;
                if(this.followPageNo>=this.followTotalPage) this.followStatus = 'nomore';
                else this.followStatus = 'loading';
                data.list.map(async(item:any)=>{
                    item.commentNum = await this.getCommentNum(item._id);
                    this.followionList.push(item);
                })
            })
        }
        getCommentNum(id:string){
            return new Promise(resolve=>{
                this.$http.getCommentNum({
                    id
                }).then((data:number)=>{
                    resolve(data);
                })
            })
        }
        //下拉刷新
        onReachBottom() {
            if(this.current===0){
                if(this.pageNo >= this.totalPage) return ;
                this.status = 'loading';
                this.pageNo = ++ this.pageNo;
                setTimeout(() => {
                    this.getArticleList();
                }, 2000)
            }else{
                if(this.followPageNo >= this.followTotalPage) return ;
                this.followStatus = 'loading';
                this.followPageNo = ++ this.followPageNo;
                setTimeout(() => {
                    this.followArticleList();
                }, 2000)
            }
			
		}
    }
</script>
<style lang="scss">
    .home{
        height:100%;
    }
    .wrap {
		padding: 40rpx;
    }
    .article-list{
        padding:20rpx 30rpx;
        &-item{
            &-head{
                image{
                    @include wh(60rpx);
                    border-radius: 50%;
                }
            }
        }
    }
</style>