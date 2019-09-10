const mode = document.getElementById('mode')

chrome.storage.sync.get(['trans-mode'], function(result) {
  if(result['trans-mode']){
    mode.value= result['trans-mode']
  }
});

mode.onchange = function(){
  console.log(this.value)
  chrome.storage.sync.set({'trans-mode': this.value})

  // 从extension给 content-script 发请求
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, {'trans-mode': this.value}, response => {
      console.log(response);
    });
  });
}