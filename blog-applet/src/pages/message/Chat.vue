<template>
	<view class="content">
		<view class="content-box" @touchstart="touchstart" id="content-box" :class="{'content-showfn':showFunBtn}">
			<!-- 背景图- 定位方式 -->
			<!-- <image class="content-box-bg" :src="_user_info.chatBgImg" :style="{ height: imgHeight }"></image> -->
			<view class="content-box-loading" v-if="!loading && !noMore"><u-loading mode="flower"></u-loading></view>
			<view v-else-if="noMore" class="no-data">无更多历史信息</view>
			<view class="message" v-for="(item, index) in list" :key="item._id" :id="`msg-${item._id}`">
				<view class="message-item " :class="item.senderId === user.userId ? 'right' : 'left'">
					<image class="img" :src="item.senderId === user.userId ? user.avatarUrl:friendInfo.avatarUrl" mode="" ></image>
					<!-- contentType = 1 文本 -->
					<view class="content" v-if="item.messageType == 1">{{ item.content }}</view>
					<!-- contentType = 2 语音 -->
					<!-- <view
						class="content contentType2"
						:class="[{ 'content-type-right': item.senderId === user.userId }]"
						v-if="item.messageType == 2"
						@tap="handleAudio(item)"
						hover-class="contentType2-hover-class"
						:style="{width:`${130+(item.contentDuration*2)}rpx`}"
					>
						<view
							class="voice_icon"
							:class="[
								{ voice_icon_right: item.isItMe },
								{ voice_icon_left: !item.isItMe },
								{ voice_icon_right_an: item.anmitionPlay && item.isItMe },
								{ voice_icon_left_an: item.anmitionPlay && !item.isItMe }
							]"
						></view>
						<view class="">{{ item.contentDuration }}''</view>
					</view> -->
					<!-- contentType = 3 图片 -->
					<!-- <view 
						class="content contentType3" 	
						v-if="item.messageType == 3"
						@tap="viewImg([item.content])"
					>
						<image :src="item.content" class="img" mode="widthFix"></image>
					</view> -->
				</view>
			</view> 
		</view>
		
		<!-- 底部聊天输入框 -->
		<view class="input-box" :class="{ 'input-box-mpInputMargin': mpInputMargin }">
			<view class="input-box-flex">
				<view class="input-box-flex-grow"> 
					<input
						type="text"
						class="content"
						id="input"
						v-model="message"
						:hold-keyboard="true"
						:confirm-type="'send'"
						:confirm-hold="true"
						placeholder-style="color:#DDDDDD;"
						:cursor-spacing="10"
						@confirm="sendMessage"
					/>
				</view>
				<!-- 功能性按钮 -->
				<!-- <image class=" icon_btn_add" :src="require('@/static/images/chat/add.png')" @tap="switchFun"></image> -->
			</view>

			<!-- <view class="fun-box" :class="{'show-fun-box':showFunBtn}">
				<u-grid :col="4"  hover-class="contentType2-hover-class" :border="false" @click="clickGrid">
					<u-grid-item v-for="(item, index) in funList" :index="index" :key="index" bg-color="#eaeaea">
						<u-icon :name="item.icon" :size="52"></u-icon>
						<view class="grid-text">{{ item.title }}</view>
					</u-grid-item>
				</u-grid>
			</view> -->
		</view>
		
		<!-- //语音动画 -->
		<!-- <view class="voice_an"  v-if="recording">
			<view class="voice_an_icon">
				<view id="one" class="wave"></view>
				<view id="two" class="wave"></view>
				<view id="three" class="wave"></view>
				<view id="four" class="wave"></view>
				<view id="five" class="wave"></view>
				<view id="six" class="wave"></view>
				<view id="seven" class="wave"></view>
			</view>
			<view class="text">{{voiceIconText}}</view>
		</view> -->
	</view>
</template>

<script lang="ts">
    import { Vue, Component, Watch } from 'vue-property-decorator';
    import { namespace } from 'vuex-class';
	const appModule = namespace('app');
	const chatModule = namespace('chat');
	
    @Component({})
    export default class Chat extends Vue {
        list:Array<any> = []
        friendInfo:any = {}
        friendName:string = ''
        mpInputMargin:boolean = false //适配微信小程序 底部输入框高度被顶起的问题
        message:string = ''
        uid:number = 1001
        friendId:string = ''
        pageNo:number = 1
        pageSize:number = 15
        totalPage:number = 0
		loading:boolean = true
		noMore:boolean = false
		historyNum:number = 0
		nowDate:Date = new Date()
		@appModule.Getter('user') user:any
		@chatModule.Getter('targetMessage') targetMessage:any
		@chatModule.Mutation('setTargetId') setTargetId:any
		@chatModule.Mutation('delTargetId') delTargetId:any
		@chatModule.Mutation('setTargetMessage') setTargetMessage:any
		@chatModule.Mutation('delMessageMap') delMessageMap:any
		@chatModule.Mutation('clearUnreadMsgCount') clearUnreadMsgCount:any
		@chatModule.Action('connectSocket') connectSocket: any;
        onLoad(opt:any) {
            this.friendId = opt.friendId;
			this.friendName = opt.friendName;
			this.setTargetId(this.friendId);
			this.clearUnreadMsgCount(this.friendId);
			this.delMessageMap();
			this.getUserInfo();
			this.joinFriend();
            this.joinData();
        }
        onReady(){
            uni.setNavigationBarTitle({
                title:this.friendName
            });
		}
		// 新消息会进入此方法
		@Watch('targetMessage', { deep: true })
		changeMessages() {
			this.addMessage();
		}
		//加入私聊socket
        joinFriend(){
            let socket = this.$store.state.chat.socket;
            if(socket.connected){
                socket.emit("joinFriendSocket", {
                    userId: this.user.userId,
                    friendId: this.friendId,
                })
            }else{
				this.connectSocket();
			}
		}
		//发送信息
        sendMessage(){
            let socket = this.$store.state.chat.socket;
            if(socket.connected){
                socket.emit("sendMessage", {
                    senderId: this.user.userId,
                    receiverId: this.friendId,
                    messageType: 1,
                    content: this.message,
                })
            }
		}
		//在分页信息的基础上来了新消息
		addMessage() {
			// 新消息来了只有是自己发的消息和消息框本身在底部才会滚动到底部
			if (this.judgeScrollToBottom()) {
				this.$nextTick(()=>{
					// 清空内容框中的内容
					this.message = '';
					uni.pageScrollTo({
						scrollTop: 999999,	// 设置一个超大值，以保证滚动条滚动到底部
						duration: 0
					});
				})
			}
			let messages = this.targetMessage;
			console.log(this.list);
			console.log(this.historyNum);
			let newMessages = messages.slice(this.list.length-this.historyNum)
			this.list = [...this.list,...newMessages];
			console.log(this.list);
		}
		//判断是否应该滚动到底部
		judgeScrollToBottom() {
			let messages = this.targetMessage;
			return messages.length>0 && messages[messages.length - 1].senderId === this.user.userId;
		}
		//获取好友信息
        getUserInfo(){
            this.$http.userInfoByUserId({
                id:this.friendId
            }).then((data:any)=>{
                this.friendInfo = data;
            })
		}
		//获取历史信息
        getMessageList(){
			return new Promise((resolve:any)=>{
				this.$http.messageList({
					date:this.nowDate,
					friendId:this.friendId,
					pageNo:this.pageNo,
					pageSize:this.pageSize,
				}).then((data:any)=>{
					const list:Array<object> = [];
					this.totalPage = data.pagination.totalPage;
					this.historyNum += data.list.length;
					data.list.forEach((item:any,index:number)=>{
						list.unshift(item);
					})
					resolve(list);
				})
			})
        }
        // onPageScroll(e:any) {
		// 	console.log(e)
        //     if (e.scrollTop < 50) {
        //         this.joinData();
        //     }
		// }
		//用户触摸屏幕的时候隐藏键盘
		touchstart() {
			uni.hideKeyboard();
		}       
		//拼接消息 处理滚动
		async joinData() {
			if (!this.loading) {
				//如果没有获取数据 即loading为false时，return 避免用户重复上拉触发加载
				return;
			}
			this.loading = false;
			const data:any = await this.getMessageList();
			uni.stopPullDownRefresh();
			//获取节点信息
			const sel = `#msg-${this.pageNo > 1 ? this.list[0]._id : data[data.length - 1]._id}`;
			this.list = [...data,...this.list];
			//填充数据后，视图会自动滚动到最上面一层然后瞬间再跳回bindScroll的指定位置 ---体验不是很好，后期优化
			this.$nextTick(() => {
				this.bindScroll(sel);
				//如果还有数据
				if (data.length >= this.pageSize) {
					this.pageNo++;
					setTimeout(() => {
						this.loading = true;
					}, 200);
				}else{
					this.noMore = true;
				}
			});
        }
        //处理滚动
		bindScroll(sel:any, duration = 0) {
			const query = uni.createSelectorQuery().in(this);
			console.log(sel);
			query
				.select(sel)
				.boundingClientRect((data:any) => {
					console.log(data);
					uni.pageScrollTo({
						scrollTop: data && data.top,
						duration
					});
				})
				.exec();
		}
		onPullDownRefresh(){
			this.joinData();
		}
		onUnload(){
			this.delTargetId();
		}
    }   
</script>

<style lang="scss" scope>
page {
	background-color: #f3f3f3;
}

.content {
	&-showfn{
		padding-bottom: 0rpx;
		padding-bottom: calc(420rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(420rpx + env(safe-area-inset-bottom) );
		/* #ifdef MP-WEIXIN */
		/* #endif */
	}
	&-box {
		width: 100%;
		height: auto;
		min-height: calc(100vh - env(safe-area-inset-top) - 200rpx);
		box-sizing: content-box;
		position: relative;
		padding-bottom: 120rpx;
		
		/* #ifdef APP-PLUS  */
		margin-bottom: 0rpx;
		margin-bottom: constant(safe-area-inset-bottom);
		margin-bottom: env(safe-area-inset-bottom);
		/* #endif */
		/* #ifdef MP-WEIXIN */
		padding-bottom: 0rpx;
		padding-bottom: calc(120rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(120rpx + env(safe-area-inset-bottom) );
		/* #endif */
	
		&-bg {
			width: 100%;
			position: fixed;
			/* #ifdef MP-WEIXIN */
			bottom: 0;
			bottom: constant(safe-area-inset-bottom);
			bottom: env(safe-area-inset-bottom);
			/* #endif */
			/* #ifndef MP-WEIXIN */
			top: 0;
			left: 0;
			/* #endif */
		}

		&-loading {
			text-align: center;
			padding: 20rpx 0;
		}

		.message {
			padding: 13rpx 20rpx;
		}
		
		.message-item {
			display: flex;
			justify-content: flex-start;
			align-items: flex-start;
			align-content: flex-start;
			flex-wrap: nowrap;
			flex-direction: row;

			.img {
				width: 80rpx;
				height: 80rpx;
				border-radius: 5rpx;
			}

			.content {
				padding: 20rpx;
				max-width: 500rpx;
				border-radius: 10rpx;
				font-size: 28rpx;
			}
			
			// 语音
			// .contentType2 {
			// 	display: flex;
			// 	flex-direction: row;
			// 	align-items: center;
			// 	.voice_icon {
			// 		height: 34rpx;
			// 		width: 34rpx; 
			// 		background-repeat: no-repeat;
			// 		background-size: 100%;
			// 	}
			// 	.voice_icon_right {
			// 		background-image: url(../../static/voice-left-3.png);
			// 		margin-left: 10rpx;
			// 	}
			// 	.voice_icon_left {
			// 		background-image: url(../../static/voice-right-3.png);
			// 		margin-right: 10rpx;
			// 	}
			// 	.voice_icon_right_an {
			// 		animation: voiceAn_right 1s linear alternate infinite;
			// 	}
			// 	.voice_icon_left_an {
			// 		animation: voiceAn_left 1s linear alternate infinite;
			// 	}
			// 	@keyframes voiceAn_right {
			// 		0% {
			// 			background-image: url(../../static/voice-left-1.png);
			// 		}
			// 		50% {
			// 			background-image: url(../../static/voice-left-2.png);
			// 		}
			// 		100% {
			// 			background-image: url(../../static/voice-left-3.png);
			// 		}
			// 	}
			// 	@keyframes voiceAn_left {
			// 		0% {
			// 			background-image: url(../../static/voice-right-1.png);
			// 		}
			// 		50% {
			// 			background-image: url(../../static/voice-right-2.png);
			// 		}
			// 		100% {
			// 			background-image: url(../../static/voice-right-3.png);
			// 		}
			// 	}
			// }
			
			//图片
			.contentType3{
				padding: 0;
				border-radius: 2rpx;
				background-color: transparent !important;
				.img{
					width: 200rpx;
					height: auto;
					max-width: 300rpx;
					max-height: 400rpx;
				}
			}
			.contentType3::after{
				border: none !important;
				display: none !important;
			}
			.content-type-right {
				flex-direction: row-reverse;
			}

			&.right {
				flex-direction: row-reverse;

				.content {
					background-color: $uni-color-success;
					margin-right: 28rpx;
					word-break: break-all;
					line-height: 36rpx;
					position: relative;

					&::after {
						content: '';
						display: block;
						width: 0;
						height: 0;
						border-top: 10rpx solid transparent;
						border-bottom: 10rpx solid transparent;
						border-left: 16rpx solid $uni-color-success;
						position: absolute;
						right: -16rpx;
						top: 30rpx;
					}
				}
			}

			&.left {
				.content {
					background-color: $uni-text-color-inverse;
					margin-left: 28rpx;
					word-break: break-all;
					line-height: 36rpx;
					position: relative;

					&::after {
						content: '';
						display: block;
						width: 0;
						height: 0;
						border-top: 10rpx solid transparent;
						border-bottom: 10rpx solid transparent;
						border-right: 16rpx solid $uni-text-color-inverse;
						position: absolute;
						left: -16rpx;
						top: 30rpx;
					}
				}
			}
		}
	}

	.input-box {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		box-sizing: content-box;
		z-index: 999;
		background-color: #eaeaea;
		
		/* #ifdef APP-PLUS */
		margin-bottom: 0rpx;
		margin-bottom: constant(safe-area-inset-bottom);
		margin-bottom: env(safe-area-inset-bottom);
		/* #endif */
		/* #ifdef MP-WEIXIN */
		padding-bottom: 0rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		/* #endif */

		&-flex {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			flex-wrap: nowrap;
			flex-direction: row;
			padding: 20rpx;
			box-sizing: border-box;
			image{
				width: 56rpx;
				height: 56rpx;
			}
			.icon_img {
				margin-right: 20rpx;
			}
			.icon_btn_add{
				margin-left: 20rpx;
			}
			&-grow {
				flex-grow: 1;

				.content {
					box-sizing: border-box;
					background-color: #fff;
					height: 80rpx;
					padding: 0 20rpx;
					border-radius: 12rpx;
					font-size: 28rpx;
					caret-color: $uni-color-success;
				}

				.voice_title {
					text-align: center;
					background-color: #ffffff;
					height: 80rpx;
					line-height: 80rpx;
					border-radius: 12rpx;
				}
			}

			.btn {
				margin-left: 20rpx;
				background-color: $u-type-success;
				border: none;
			}
		}
		
		.fun-box{
			opacity: 0;
			transition: all 0.1s ease-in-out;
			height: 0;
			.grid-text{
				padding-top: 10rpx;
				color: $uni-text-color-grey;
			}
			
		}
		.show-fun-box{
			opacity: 1;
			height: 300rpx;
		}
	}

	.input-box-mpInputMargin {
		/* #ifdef MP-WEIXIN */
		padding-bottom: 0rpx;
		/* #endif */
	}
	.voice_an{
		width: 300rpx;
		height: 300rpx;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-55%);
		background-color: rgba(41,41,41,0.7);
		color: white;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		border-radius: 10rpx;
		.text{
			padding-top: 30rpx;
		}
		@keyframes runVoice{
			0%{
				height: 10%;
			}
			20%{
				height: 50%;
			}
			50%{
				height: 100%;
			}
			80%{
				height: 50%;
			}
			100%{
				height: 0%;
			}
		}	
		.wave{
			width:6rpx;
			height: 100%;
			margin-left: 10rpx;
			border-radius: 50rpx;
			background-color: #999;
			vertical-align: middle;
			display: inline-block;
		}
		.voice_an_icon{
			width: 200rpx;
			height: 100rpx;
			line-height: 50rpx;
			margin: 50rpx 0;
		}
		.voice_an_icon #one{
			animation:runVoice 0.6s infinite 0.1s;
		}
		.voice_an_icon #two{
			animation:runVoice 0.6s infinite 0.3s;
		}
		.voice_an_icon #three{
			animation:runVoice 0.6s infinite 0.6s;
		}
		.voice_an_icon #four{
			animation:runVoice 0.6s infinite 0.1s;
		}
		.voice_an_icon #five{
			animation:runVoice 0.6s infinite 0.3s;
		}
		.voice_an_icon #six{
			animation:runVoice 0.6s infinite 0.6s;
		}
		.voice_an_icon #seven{
			animation:runVoice 0.6s infinite 0.1s;
		}
	}
}
</style>