/**
 *  background.js  在插件一启动则会在后台持续运行，若要使用需要在 manifest.json中配置对应属性
 *  popup 则是点开插件对应的页面
 *
**/

const translateUrl = 'https://fanyi-api.baidu.com/api/trans/vip/translate'
const APP_ID='20190909000333072'
const APP_KEY='y1loGIAsxE7YyelbZV6_'
const MD5 = require('./md5.js')

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.queryType === 'translate') {
      const q= request.q
      const from = request.from
      const to=request.to
      const appid = APP_ID
      const appkey = APP_KEY
      const salt = Math.ceil(Math.random()*10000000000)+''
      const sign= MD5(appid+q+salt+appkey)

      const url = `${translateUrl}?q=${q}&from=${from}&to=${to}&appid=${appid}&salt=${salt}&sign=${sign}`
      fetch(url, { headers: {'content-type': 'application/json'} })
        .then(res => res.json())
        .then(data => sendResponse(data))
        .catch(e => {
          console.log(e.error_msg || e)
          sendResponse('')
        })
      return true;  // Will respond asynchronously.
    }
  }
);



/*
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log("The color is green.");
  });

  // 添加功能： 默认情况下是灰的，切换到匹配目录，则点亮可用
  // 需要在 manifest.json  的 permission属性中添加 "declarativeContent" 的配置
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'developer.chrome.com'},
      })
      ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});
*/
