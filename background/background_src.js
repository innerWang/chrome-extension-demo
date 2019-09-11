/**
 *  background.js  在插件一启动则会在后台持续运行，若要使用需要在 manifest.json中配置对应属性
 *  popup 则是点开插件对应的页面
 *
**/

const translateUrl = 'https://fanyi-api.baidu.com/api/trans/vip/translate'
const menuJumpUrl = 'https://fanyi.baidu.com'
const APP_ID='20190909000333072'
const APP_KEY='y1loGIAsxE7YyelbZV6_'
const MD5 = require('./md5.js')

chrome.runtime.onInstalled.addListener(function() {
  let from = 'en'
  let to = 'zh'

  chrome.storage.sync.get(['src-lang','dest-lang'], function(result) {
    if(result['src-lang']){
      from = result['src-lang'].value
    }
  
    if(result['dest-lang']){
      to = result['dest-lang'].value
    }
  })

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.queryType === 'translate') {
        const q= request.q
        from = request.from
        to=request.to
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
        return true  // Will respond asynchronously.
      }
    }   
  )

  chrome.contextMenus.create({
    "id": "trans",
    "title": "翻译",
    "contexts": ["selection"]   // 对应 contextType的取值，只有符合取值条件时才会显示menu
  })

  chrome.contextMenus.onClicked.addListener(function(info){
    if(info.menuItemId === 'trans'){
      chrome.tabs.create({url: `${menuJumpUrl}/#${from}/${to}/${info.selectionText}`})
    }
  })

  chrome.storage.onChanged.addListener(function(changes){
    if(changes['src-lang']){
      from = changes['src-lang'].newValue.value
    }else if(changes['dest-lang']){
      to = changes['dest-lang'].newValue.value
    }
  })

})





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
