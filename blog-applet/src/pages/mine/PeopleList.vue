<template>
    <view class="people-list bg-white h-100">
        <view class="page-content bg-white">
            <view class="d-flex jc-between ai-center pr-3 bg-white">
                <view class="tabs-list">
                    <u-tabs :list="tabsList" :is-scroll="false" :current="current" @change="tabsChange" active-color="#75C3DF" ref="uTabs" class="bg-grey-2"></u-tabs>
                </view>
                <u-icon name="man-add-fill" size="40"></u-icon>
            </view>
            <view>
                <view v-if="current==0">
                    <view v-for="item in followList" :key="item._id">
                        <view class="follow-item d-flex jc-between ai-center ">
                            <view class="d-flex jc-start ai-center">
                                <view class="item-img pr-3">
                                    <image :src="item.object.avatarUrl"></image>
                                </view>
                                <view class="d-flex flex-column jc-center ai-start">
                                    <text class="bold fs-lg pb-1">{{item.object.nickName}}</text>
                                    <text class="text-grey">备注</text>
                                </view>
                            </view>
                            <view>
                                <u-button size="mini" @click="follow(item.object)">{{item.object.status?'取消关注':'关注'}}</u-button>
                            </view>
                        </view>
                    </view>
                    <view class="pb-3 pt-2">
                        <u-empty text="暂无关注" mode="favor" v-if="followList.length===0"></u-empty>
                        <u-loadmore :status="status" v-else/>
                    </view>
                </view>
                <view v-if="current==1">
                    <view v-for="item in fansList" :key="item._id">
                        <view class="follow-item d-flex jc-between ai-center ">
                            <view class="d-flex jc-start ai-center">
                                <view class="item-img pr-3">
                                    <image :src="item.user.avatarUrl"></image>
                                </view>
                                <view class="d-flex flex-column jc-center ai-start">
                                    <text class="bold fs-lg pb-1">{{item.user.nickName}}</text>
                                    <text class="text-grey">备注</text>
                                </view>
                            </view>
                            <view>
                                <u-button size="mini" @click="follow(item.user)">{{item.user.status?'取消关注':'关注'}}</u-button>
                            </view>
                        </view>
                    </view>
                    <view class="pb-3 pt-2">
                        <u-empty text="暂无粉丝" mode="favor" v-if="fansList.length===0"></u-empty>
                        <u-loadmore :status="fansStatus" v-else/>
                    </view>
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

    export default class FollowList extends Vue{
        userId:string = '';
        $refs!: {
            uToast:HTMLFormElement
        }
        tabsList:Array<any> = [{
            name: '关注'
        }, {
            name: '粉丝'
        }]
        current:number = 0;// tabs组件的current值，表示当前活动的tab选项
        //关注列表参数
        status:string = 'loadmore';
        pageNo:number = 1;
        pageSize:number = 10;
        totalPage:number = 0;
        followTotal:number = 0;
        followList:Array<Object> = [];//我的关注列表
        //粉丝列表参数
        fansStatus:string = 'loadmore';
        fansPageNo:number = 1;
        fansPageSize:number = 10;
        fansTotalPage:number = 0;
        fansTotal:number = 0;
        fansList:Array<Object> = [];//我的关注列表
        @appModule.Getter('user') user:any
        //tab方法
        tabsChange(index:number):void {
            this.current = index;
            if(index===0) this.followList.length===0 && this.getList();
            else if(index===1) this.fansList.length===0 && this.getList();
        }
        onLoad(opt:any){
            this.current = opt.current || 0;
            this.userId = opt.userId || null;
            this.getList();
        }
        //获取我的文章列表
        getList(){
            let obj = {};
            if(this.current==0){
                obj = {
                    pageNo:this.pageNo,
                    pageSize:this.pageSize,
                    user:this.userId || this.user.userId,
                    status:1
                }
            }else{
                obj = {
                    pageNo:this.fansPageNo,
                    pageSize:this.fansPageSize,
                    user:this.userId || this.user.userId,
                    status:2
                }
            }
            this.$http.getFollowList(obj).then((data:any)=>{
                if(this.current==0){
                    this.totalPage = data.pagination.totalPage;
                    if(this.pageNo>=this.totalPage) this.status = 'nomore';
                    else this.status = 'loading';
                    this.followTotal = data.pagination.totalCount;
                    data.list.map(async (item:any)=>{
                        item.object.status = await this.getFollowStatus(item.object._id);
                        this.followList.push(item);
                    })
                }else{
                    this.fansTotalPage = data.pagination.totalPage;
                    if(this.fansPageNo>=this.fansTotalPage) this.fansStatus = 'nomore';
                    else this.fansStatus = 'loading';
                    this.fansTotal = data.pagination.totalCount;
                    data.list.map(async(item:any)=>{
                        item.user.status = await this.getFollowStatus(item.user._id);
                        this.fansList.push(item);
                    })
                }
            })
        }
        //关注
        follow(item:any){
            this.$http.toggle({
                type:'User',
                object:item._id,
                name:'follow'
            }).then((data:any)=>{
                item.status = data.status;
                const title = data.status?'关注成功':'取消关注';
                this.$refs.uToast.show({
                    title,
                    type:'success'
                })
                this.$forceUpdate();
            })
        }
        //获取关注状态
        getFollowStatus(id:string){
            return new Promise(resolve=>{
                this.$http.getActionStatus({
                    type:'User',
                    object:id,
                    name:'follow'
                }).then((data:any)=>{
                    resolve(data.status)
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
                    this.getList();
                }, 2000)
            }else{
                if(this.fansPageNo >= this.fansTotalPage) return ;
                this.fansStatus = 'loading';
                this.fansPageNo = ++ this.fansPageNo;
                setTimeout(() => {
                    this.getList();
                }, 2000)
            }
			
		}
    }
</script>
<style lang="scss">
    .people-list{
        .tabs-list{
            width:400rpx;
        }
        .follow-item{
            padding:20rpx 30rpx;
            @include bt();
        }
        .item-img{
            image{
                @include wh(100rpx);
                border-radius: 50%;
            }
            
        }
    }
</style>