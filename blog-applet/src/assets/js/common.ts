let dayjs = require('dayjs');

/* 跳转tab页面方法,不能带参数 */
const switchTab = (path:string) => {
    uni.switchTab({url: path});   
}
/* 跳转页面方法,页面会被加入堆栈 */
const navigateTo = (path:string) => {
    uni.navigateTo({url: path});
}
/* 跳转页面方法,页面不会被加入堆栈 */
const redirectTo = (path:string) => {
    uni.redirectTo({url: path});
}
/* 关闭当前页面，返回上一页面或多级页面 */
const navigateBack = (num=1) => {
    uni.navigateBack({delta: num});
}
//计算与当前时间相差多少
function getDateDiff(dateTime:Date){
	let minute = 1000 * 60,
	    hour = minute * 60,
	    day = hour * 24,
	    month = day * 30,
        now = new Date().getTime(),
        dateTimeStamp = new Date(dateTime).getTime(),
	    diffValue = now - dateTimeStamp;
	if(diffValue < 0){return;}
	let monthC = diffValue/month,
	    weekC = diffValue/(7*day),
	    dayC = diffValue/day,
	    hourC = diffValue/hour,
        minC = diffValue/minute,
        result = '';
	if(monthC>=1){
        result = dayjs(dateTimeStamp).format('YYYY-MM-DD HH:mm:ss')
		// result="" + parseInt(monthC) + "月前";
	}
	else if(weekC>=1){
		result = "" + parseInt(weekC.toString()) + "周前";
	}
	else if(dayC>=1){
		result = ""+ parseInt(dayC.toString()) +"天前";
	}
	else if(hourC>=1){
		result = ""+ parseInt(hourC.toString()) +"小时前";
	}
	else if(minC>=1){
		result = ""+ parseInt(minC.toString()) +"分钟前";
	}else result="刚刚";
	return result;
}



//挂载在Vue
export default{
	switchTab,
	navigateTo,
    redirectTo,
    navigateBack,
    getDateDiff
}