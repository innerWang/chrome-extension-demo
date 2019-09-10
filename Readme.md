# 使用 Chrome 插件

#### 1. 创建 `manifest.json`配置文件
  * 添加基础信息
  * 添加 `browser_action`属性，定义浏览器地址右侧图标相关的信息，包含显示的图标以及弹出页面
  * 添加 `commands`属性, 定义快捷方式
  * 添加 `background`属性， 定义背景页所执行的脚本，即插件安装后执行的脚本
  * 添加 `permission`属性，定义权限
  * 添加 `page_action`属性，定义在某个页面才生效，设置对应的`default_popup`以及`default_icon`(图标)
  * 添加 `icons`属性，定义扩展图标
  * 添加 `options_page`属性，则添加了插件的配置页，从插件安装页面 `详细信息-- 扩展程序选项`即可打开该页面
  * 添加`content_scripts`，定义注入页面的js



#### 2. 编译
  若在`background`目录下执行 `./build.sh`提示`permission denied`，则先执行`chmod +x build.sh`即可。

#### 3. `content_scripts`简介
1. 可以直接访问的chrome API的列表
  * `i18n`
  * `storage`
  * `runtime` : connect、getMenifest、getURL、id、onConnect、onMessage、sendMessage


2. 调用方式
  * 编程式注入

    注意此种方式需要在 `permissions`中添加 `activeTab`。
  ```js
  // 注入代码
  chrome.runtime.onMessage.addListener(
    function(message, callback) {
      if (message == "changeColor"){
        chrome.tabs.executeScript({
          code: 'document.body.style.backgroundColor="orange"'
        });
      }
   });

  // 注入文件
  chrome.runtime.onMessage.addListener(
    function(message, callback) {
      if (message == "runContentScript"){
        chrome.tabs.executeScript({
          file: 'contentScript.js'
        });
      }
   });
  ```

  * 声明式注入

     在`content_scripts`中声明要注入的文件。
  ```js
  {
    "content_scripts": [
      {
        "matches": ["http://*.nytimes.com/*"],
        "css": ["myStyles.css"],
        "js": ["contentScript.js"]
      }
    ]
  }
  ```

3. `content_scripts`各配置项

|键|说明|取值|
|:-|:-|:-|
|`'matches'`|必须！定义content script注入的页面|[参考](https://developer.chrome.com/extensions/match_patterns)|
|`'css'`|注入指定页面的css|`['a.css', 'b.css']`|
|`'js'`|注入指定页面的js|`['a.js', 'b.js']`|
|`'run_at'`|指定js被注入页面的时机|`'document_idle'` : 默认<br> `'document_start'` : css之后，DOM构建或其他js运行之前注入 <br> `'document_end'` : DOM加载结束，但是图片等加载之前注入<br>|


