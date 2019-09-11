const mode = document.getElementById('mode')
const srcLang = document.getElementById('src-lang')
const destLang = document.getElementById('dest-lang')


chrome.storage.sync.get(['trans-mode'], function(result) {
  if(result['trans-mode']){
    mode.value= result['trans-mode']
  }
})

chrome.storage.sync.get(['src-lang','dest-lang'], function(result) {
  if(result['src-lang']){
    srcLang.value = result['src-lang'].value
  }

  if(result['dest-lang']){
    destLang.value = result['dest-lang'].value
  }
})



mode.onchange = function(){
  chrome.storage.sync.set({'trans-mode': this.value})

  // 从extension给 content-script 发请求
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, {'trans-mode': this.value}, response => {
      if(!response){
        console.log(chrome.runtime.lastError)
      }else {
        console.log(response);
      }
    })
  })
}


srcLang.onchange = function(){
  const key = this.selectedOptions[0].dataset.key
  chrome.storage.sync.set({'src-lang': {key: key, value: this.value}})
}

destLang.onchange = function(){
  const key = this.selectedOptions[0].dataset.key
  chrome.storage.sync.set({'dest-lang': {key: key, value: this.value}})
}


