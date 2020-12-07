module.exports = {
    css:{
        loaderOptions:{
            // 给 sass-loader 传递选项
            scss: {
                additionalData: `@import "~@/assets/scss/style.scss";@import "~@/uni.scss";`,
                // additionalData: `@import "~@/uni.scss";`
            },
        }
    }
}