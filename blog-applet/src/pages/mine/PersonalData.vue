<template>
    <view class="personal-data bg-white h-100">
        <view class="page-content bg-white">
            <view class="d-flex jc-center ai-center">
                <u-avatar :src="userInfo.avatarUrl"  mode="circle" size="120"></u-avatar>
            </view>
            <view>
                <u-field
                    maxlength="10"
                    v-model="userInfo.nickName"
                    label="昵称"
                    placeholder="请填写昵称"
                />
                <u-field
                    maxlength="20"
                    v-model="userInfo.utograph"
                    label="签名"
                    placeholder="请填写签名"
                />
            </view>
            <view class="d-flex jc-center ai-center pt-3">
                <u-upload :action="action" :file-list="fileList" max-count="1" upload-text="选择背景图" @on-uploaded="onUploaded" :header="header" :auto-upload="false" ref="uUpload" :show-progress="false">
                </u-upload>
            </view>
            <view class="p-5">
                <u-button type="primary" @click="submit">保存</u-button>
            </view>
        </view>
        <u-toast ref="uToast" />
    </view>
</template>
<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    @Component({})

    export default class PersonalData extends Vue{
        userInfo:any = {};
        fileList:Array<object> = [];
        action:string = process.env.VUE_APP_BASE_URL + '/upload'
        header:any = {
            authorization:this.$store.state.app.token
        }
        $refs!: {
            uUpload: HTMLFormElement,
            uToast:HTMLFormElement
        }
        onLoad(){
            this.getUserInfo();
        }
        async getUserInfo(){
            this.userInfo = await this.$http.getUser();
            this.userInfo.backgroundImage && this.fileList.push({
                url:this.userInfo.backgroundImage
            });
        }
        onUploaded(lists:Array<any>):void {
            this.$http.modifyUserInfo({
                utograph:this.userInfo.utograph,
                nickName:this.userInfo.nickName,
                backgroundImage:lists[0].response.url
            }).then((data:any)=>{
                this.navigateBack();
            })
        }
        submit():void {
            if(this.userInfo.nickName===''){
                this.$refs.uToast.show({
					title: '请填写昵称后再提交',
					type: 'warning'
				})
                return;
            }
            this.$refs.uUpload.upload();
        }
    }
</script>