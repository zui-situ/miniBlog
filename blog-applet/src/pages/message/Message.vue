<template>
  <view class="container h-100 bg-white">
		<!-- <u-navbar :is-back="false" title="" :background="{ backgroundColor: '#F8F8F8' }">
			<view class="navbar">
				<view class="app-name">快聊</view>
				<view class="app-operate">
					<u-icon name="plus-circle" size="50" @click="showMenu" />
				</view>
			</view>
		</u-navbar> -->
		<view class="main">
			<u-search height="70" :show-action="false" :disabled="true"/>
			<view class="list">
				<view class="list-item" v-for="item in dialogList" :key="item._id" @click="navigateTo('./Chat?friendId='+item._id+'&friendName='+item.friendInfo[0].username)">
					<view class="avatar">
						<image :src="item.friendInfo[0].avatarUrl" class="image">
						<u-badge type="error" :count="item.unreadMsgCount" :offset="[-10, -10]" />
					</view>
					<view class="wrap">
						<view class="content">
							<view class="name">{{item.friendInfo[0].username}}</view>
							<view class="message">{{item.lastMessage}}</view>
						</view>
						<view class="time">{{getDateDiff(item.createdAt)}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { namespace } from 'vuex-class';
    const chatModule = namespace('chat');
    
    @Component({})
    export default class Mine extends Vue{
		list:Array<Object> = [];
		@chatModule.Mutation('initDialogList') initDialogList:any;
		@chatModule.Action('connectSocket') connectSocket: any;
		@chatModule.Action('handleChatData') handleChatData: any;
		@chatModule.Getter('dialogList') dialogList:any;

        onLoad(){
			this.connectSocket();
		}
    }

</script>
<style lang="scss" scoped>

.line-1 {
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 1;
	display: -webkit-box;
	overflow: hidden;
	white-space: normal;
	text-overflow: ellipsis;
}
.container {
	.navbar {
		display: flex;
		align-items: center;
		flex: 1;
		padding: 0 30rpx;
		font-size: 32rpx;
		& > view {
			flex: 1;
			&.app-name {
				font-weight: bold;
			}
			&.app-operate {
				text-align: right;
			}
		}
	}
	.main {
		padding: 30rpx;
		.list {
			margin-top: 10rpx;
			.list-item {
				display: flex;
				align-items: center;
				.avatar {
					position: relative;
					width: 84rpx;
					height: 84rpx;
					margin-right: 24rpx;
					.image {
						width: 100%;
						height: 100%;
						border-radius: 10%;
					}
				}
				.wrap {
					flex: 1;
					display: flex;
					align-items: center;
					padding: 20rpx 0;
					.content {
						flex: 1;
						.name {
							font-size: 32rpx;
							color: #333;
						}
						.message {
							@extend .line-1;
							font-size: 26rpx;
							color: #999;
						}
					}
					.time {
						color: #999;
						margin-left: 26rpx;
					}
				}
			}
			.list-item + .list-item {
				.wrap {
					border-top: 1rpx solid #fafafa;
				}
			}
		}
	}
}
</style>