/**
 * 防止网络攻击
 * @param text 文本
 */
export function parseText(text: string) {
    let HTML = /<\/?.+?>/gi;
    let COOKIE = /document\.cookie/gi;
    let URL = /^\w+[^\s]+(\.[^\s]+){1,}$/gi;
    let HTTP = /http:\/\//gi;
    if (HTML.test(text)) {
      return '无效输入,别耍花样!';
    }
    if (COOKIE.test(text)) {
      return '无效输入,你想干嘛!';
    }
    // 解析网址
    if (URL.test(text)) {
      if (HTTP.test(text)) {
        return `<a onClick="window.open('${text}','_blank')" target="_blank">${text}</a>`;
      }
      return `<a onClick="window.open('http://${text}','_blank')" target="_blank">${text}</a>`;
    }
    return text;
}