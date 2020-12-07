<template>
    <view class="h-100 bg-white">
        <view class="page-content">
            <u-field
				v-model="content"
				placeholder="请输入分享的内容"
                type="textarea"
                auto-height
                confirm-type="确认"
                label-width="0"
			/>
            <u-upload :action="action" ref="uUpload" :auto-upload="false" max-count="6" :max-size="5 * 1024 * 1024" @on-uploaded="onUploaded" :header="header"></u-upload>
        </view>
        <u-button @click="submit" class="d-fixed bottom-btn w-100 bg-main" :ripple="true" ripple-bg-color="#75C3DF" type="primary">提交</u-button>
        <u-toast ref="uToast" />
    </view>
</template>
<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator'; 

    @Component({})

    export default class WriteBlog extends Vue{
        content:string = ''
        action:string = process.env.VUE_APP_BASE_URL + '/upload'
        $refs!: {
            uUpload: HTMLFormElement,
            uToast:HTMLFormElement
        }
        header:any = {
            authorization:this.$store.state.app.token
        }
        onLoad(){
            
        }
        onUploaded(lists:Array<Object>):void {
            const imgList:string[] = [];
            console.log(lists);
            lists.forEach((item:any)=>{
                imgList.push(item.response.url);
            })
            console.log(imgList);
            this.$http.createArticle({
                content:this.content,
                imgList
            }).then((data:any)=>{
                this.navigateBack();
            })
        }
        submit():void {
            console.log(this.$refs.uUpload);
            if(this.content===''){
                this.$refs.uToast.show({
					title: '请填写内容后再提交',
					type: 'warning'
				})
                return;
            }
            this.$refs.uUpload.upload();
        }
    }
</script>
<style lang="scss" scope>
    .bottom-btn{
        bottom:0rpx;
    }
</style>