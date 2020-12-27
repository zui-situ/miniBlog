import minRequest from '../models/api' 

declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        minRequest?: minRequest
    }
}

// export = minRequest;