module.exports = {
    /*publicPath: './',*/
    css: {
        loaderOptions: {
            scss: {
                additionalData: `
                @import "~@/assets/scss/colors.scss";
                @import "~@/assets/scss/fonts.scss";
                @import "~@/assets/scss/grid.scss";
                `
            }
        }
    }
}