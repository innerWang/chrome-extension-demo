class Panel {
  constructor(){
    this.mode = 'off'
    this.srcLang = {value: 'en', key: 'English'}
    this.destLang = {value: 'zh', key: '中文'}
    this.createPanel()
    this.bind()
  }
  createPanel(){
    const panelWrap = document.createElement('div')
    panelWrap.id = 'translate-panel'
    const tpl = `<div class="panel-header">
                  <h4></h4>
                  <span class="close-x">x</span>
                </div>
                <div class="panel-cont"></div>`
    panelWrap.innerHTML = tpl
    document.body.appendChild(panelWrap)
    this.panel = panelWrap
    this.src = panelWrap.querySelector('h4')
    this.closeIcon = panelWrap.querySelector('.close-x')
    this.content = panelWrap.querySelector('.panel-cont')
  }

  bind(){
    this.closeIcon.addEventListener('click',()=>{
      this.hidePanel()
    })
  }

  showPanel(){
    this.panel.classList.add('show')
  }

  hidePanel(){
    this.panel.classList.remove('show')
  }

  moveTo(x,y){
    this.panel.style.left=x+10+'px'
    this.panel.style.top=y+10+'px'
  }

  isShow(){
    return this.panel.classList.contains('show')
  }

  translate(data,x,y){
    const q= data.toString()
    chrome.runtime.sendMessage(
      { queryType: 'translate', q:q, form: this.srcLang.value, to:this.destLang.value }, 
      res => {
        if(res){
          this.src.innerText=q
          this.content.innerText=res.trans_result[0].dst
          this.moveTo(x,y)
          this.showPanel()
        }
      }
    )
  }
}

const trans_panel = new Panel()

document.onmouseup= function(e){
  if(trans_panel.mode === 'off') return

  const str = window.getSelection().toString().trim()
  if(!str) {
    if(trans_panel.isShow()){
      if(e.target !== trans_panel.panel && !trans_panel.panel.contains(e.target)){
        trans_panel.hidePanel()
      }
    }
    return
  } 
  trans_panel.translate(str,e.clientX,e.clientY)
}

chrome.storage.sync.get(['trans-mode','src-lang','dest-lang'], function(result) {
  if(result['trans-mode']){
    trans_panel.mode= result['trans-mode']
  }

  if(result['src-lang']){
    trans_panel.srcLang= result['src-lang']
  }

  if(result['dest-lang']){
    trans_panel.destLang = result['dest-lang']
  }
})

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request['trans-mode']){
      trans_panel.mode= request['trans-mode']
      sendResponse('already renew trans-mode!');
    } 
  });

chrome.storage.onChanged.addListener(function(changes){
  if(changes['src-lang']){
    trans_panel.srcLang = changes['src-lang'].newValue
  }else if(changes['dest-lang']){
    trans_panel.destLang = changes['dest-lang'].newValue
  }
})