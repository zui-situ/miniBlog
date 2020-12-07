import common from './common.js' 
declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        common?: common
    }
}
