<template>
    <view>
        <view class="article-list" v-if="list.length>0">
            <view class="article-list-item pb-3 bg-white mb-3" v-for="item in list" :key="item._id" @click="navigateTo('../home/ArticleDetail?id='+item._id+'&user='+item.user._id)">
                <view class="article-list-item-head jc-start ai-center d-flex" v-show="showUser">
                    <image :src="item.user.avatarUrl" class="mr-3"  @click="navigateTo('../common/PeopleDetail?userId='+item.user._id)"></image>
                    <view class="d-flex flex-column jc-center ai-start">
                        <text class="bold fs-lg pb-1">{{item.user.nickName}}</text>
                        <text class="text-grey">{{getDateDiff(item.createdAt)}}</text>
                    </view>
                </view>
                <view class="text-grey article-list-item-content">
                    {{item.content}}
                </view>
                <!-- <view v-if="item.imgList.length>0" class="article-list-item-img">
                        <image :src="item.imgList[0]" mode="aspectFill"></image>
                    </view> -->
                <view class="d-flex jc-start ai-center article-list-item-bottom">
                    <view class="d-flex jc-start ai-center pr-4">
                        <image src="../static/images/mine/read.png"></image>
                        <text class="text-grey fs-xs">{{item.readNum}}</text>
                        <text class="text-grey fs-xs">阅读</text>
                    </view>
                    <view class="d-flex jc-start ai-center pr-4">
                        <image src="../static/images/mine/comment.png"></image>
                        <text class="text-grey fs-xs">{{item.commentNum}}</text>
                        <text class="text-grey fs-xs">评论</text>
                    </view>
                </view>
            </view>
        </view>
        <view class="pb-3 pt-2">
            <u-empty text="暂无文章" mode="list" v-if="list.length===0"></u-empty>
            <u-loadmore :status="status" v-else/>
        </view>
    </view>
</template>
<script lang="ts">
    import { Vue, Component, Prop, Watch } from 'vue-property-decorator'; 
    @Component
    export default class CardList extends Vue {
        @Prop({
            type:Array,
            required:true,
            default:[]
        }) list!:any;
        @Prop({
            type:String,
            required:true,
            default:''
        }) status:any;
        @Prop({
            type:Boolean,
            required:false,
            default:true
        }) showUser:any;
    }
</script>
<style lang="scss" scope>
    .article-list{
        padding:30rpx;
        @include bt();
        &-item{
            padding-bottom:30rpx;
            border-radius: 16rpx;
            box-shadow: 0rpx 1rpx 24rpx 0rpx rgba(118, 118, 118, 0.15);
            &-head{
                padding:30rpx 30rpx 0 30rpx;
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
</style>