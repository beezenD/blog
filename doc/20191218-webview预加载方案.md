# webview预加载方案

在 HybridApp 中加载web H5,你一定会发现 H5 加载会有白屏，因为要载入js，css等一些静态资源，而且现在很多都是采用 SPA 的模式开发，也就说首页加载会相对更慢一点，入口js是相对比较大的。通过采用webview预加载方式，能够极大的提高 HybridApp 中，H5加载的速度。

## 基本模式

在 HybridApp 中，app 在后台初始化一个 空 webview，提前载入前端的 `preload.html` 页面。`preload.html` 页面内容只有前端的第三方js和css,所有与当前页面地址相关的业务逻辑js或css，不直接加载，而是等 App 路由到指定页面时，主动加载对应页面的业务js或css资源。具体实现可参考下图所示。

<img src="http://img.dongbizhen.com/blog/webview预加载.png" />

## 代码实现

前端在 `preload.html` 页面中，提前在 window 对象下注册 `window.PRELOAD.nativeLoad` 方法，当 app 路由切换到前端页面，监听页面渲染完成时，主动触发 `nativeLoad("url")` 方法，将前端路由地址传递给前端，前端直接渲染指定路由对应的业务js和css。具体代码实现可以参考如下所示。

```javascript
// 预加载模式
(function (window) {
    var deviceReady = false;
    window.PRELOAD = {
        ready: function (success) {
            if (/cordova/i.test(navigator.userAgent)) {
                if (window.deviceReady) {
                    success();
                } else {
                    document.addEventListener("deviceready", function () {
                        window.deviceReady = true;
                        success();
                    }, false);
                }
            } else {
                success();
            }
        },
        loadScript: function (url, callback) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.async = true;
            if (script.readyState) {
                script.onreadystatechange = function () {
                    if (script.readyState == "loaded" || script.readyState == "complete") {
                        script.onreadystatechange = null;
                        callback && callback();
                    }
                };
            } else {
                script.onload = callback;
            }
            script.src = url;
            (document.body || document.getElementsByTagName("body")[0] || document.documentElement).appendChild(
                script);
        },
        loadStylesheet: function (url) {
            var link = document.createElement("link");
            link.setAttribute("href", url);
            link.setAttribute("rel", "stylesheet");
            document.getElementsByTagName("head")[0].appendChild(link);
        },
        formatUrl: function (url) {
            var str = url.replace(/(.*\.html)?(.*?)/, '$1,$2');
            var arr = str.split(',');
            var indexs = [arr[1].indexOf('?'), arr[1].indexOf('#')];
            var path = indexs[1] > indexs[0] ? (arr[1].slice(indexs[1], arr[1].length) + arr[1].slice(indexs[
                0], indexs[1])) : arr[1];
            return path;
        },
        appendQuery: function (url, query) {
            return url + (url.indexOf('?') > -1 ? '&' : '?') + query;
        },
        load: function () {
            if (location.href.indexOf('jscallback=loadScript') > -1) {
                window.PRELOAD = window.PRELOAD || {};
                PRELOAD.ready(function () {
                    PRELOAD.loadStylesheet('index.css');
                    PRELOAD.loadScript('index.js');
                });
            } else {
                window.PRELOAD = window.PRELOAD || {};
                window.PRELOAD.nativeLoad = function (url, data) {
                    location.replace((location.search ? 'preload.html' : '') + PRELOAD.appendQuery(PRELOAD.formatUrl(
                        url), "jscallback=loadScript") + location.search.replace('?', '&'));
                    PRELOAD.loadStylesheet('index.css');
                    PRELOAD.loadScript('index.js');
                }
            }
        }
    };
    window.PRELOAD.load();
})(window);
```

## 最后

预加载方案很多，以上的 wenview 预加载方案，大约能提升20-30%等待时间。想要将嵌入web体验提升到原生体验，更多的提升方向在app原生实现上，前端和客户端开发还是要多多共同讨论和探索。
