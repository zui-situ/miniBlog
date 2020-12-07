import minRequest from './api.js' 

declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        minRequest?: minRequest
    }
}

export = minRequest;