<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';

    @Component({})
    export default class uniApp extends Vue {
        mpType:string = 'app'
        onLaunch() {
            console.log('App Launch')
        };
        onShow() {
            console.log('App Show')
        };
        onHide() {
            console.log('App Hide')
        }
    }
</script>

<style lang="scss">
    /*引入自定义字体图标*/
    @import "./assets/scss/iconfont.css";
    /*引入uView基础样式*/
    @import "uview-ui/index.scss";
    /* 自定义公共css */
    @import "./assets/scss/style.scss";
    /*每个页面公共css */
    @import "./assets/scss/common.css";
</style>
