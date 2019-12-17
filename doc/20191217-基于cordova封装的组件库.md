# 基于cordova封装的组件库

之前有简单介绍过混合体系，其中底层cordova组件库搭建的好坏，会很大程度上影响业务开发效率，今天主要介绍一下我们团队的混合组件库的主要实现。

## 技术方案

技术栈：ts + webpack + typedoc + QUnit + 私有npm

所有的内容都是基于 typescript 语法，能够极大程度规范开发者使用；采用 webpack 做打包集成，虽然他慢，但是他好用，各种ts-loader、babel-loader...用起来很方便；typedoc 来生成组件库文档，只能说生成的内容看是能看，但是基本上只能提取 api，都是英文不是中文文档（看起来你懂得）；QUnit 做简单的单元测试，简单方便不多解释；我们将组件库发布到私有npm上，下载和使用非常方便。

最后产品情况大概图下图所示：

<img src="http://img.dongbizhen.com/blog/wdui.png" width="600px" />

## 核心封装

所有的公共组件或业务组件，都可以基于 `nativecall` 核心方法去做二次封装，具体代码如下仅供参考。

```typescript
declare global { const Cordova: any; };
let deviceReady: boolean = (window as any).deviceReady ;
/**
 * 是否是HybridApp
 * @ignore
 */
const hybrid = /Cordova/i.test(navigator.userAgent);
/** 配置文件参数 */
Object.defineProperty(window, "wdui", {
    configurable: false,
    writable: true,
    value: {}
});
(window as any)['wdui']['WduiConfig'] = {
    debug: false, // 是否开启debug
    monitor: false, // 是否开启监控
    monitorRecords: [], // 监控记录
    monitorLastData: {}, // 最后一条监控数据
};

/**
 * 插件服务监控
 * @ignore
 */
const monitor = {
    // 开始监控
    start: (service: string, action: string) => {
        return {
            service,
            action,
            startTime: Date.now(),
            endTime: Date.now(),
            speed: "0ms"
        }
    },
    // 结束监控
    end: (monitorData: any) => {
        if ((window as any)['wdui']['WduiConfig']['monitor']) {
            monitorData.endTime = Date.now();
            monitorData.speed = (monitorData.endTime - monitorData.startTime) + 'ms';
            (window as any)['wdui']['WduiConfig']['monitorRecords'].push(monitorData);
            (window as any)['wdui']['WduiConfig']['monitorLastData'] = monitorData;
        }
    }
};

/**
 * 是否混合
 * @description
 * 是否在HybridApp内部
 * 要求在使用cordova的APP中添加navigator.userAgent参数
 * @return boolean 是否在HybridApp中
 * @example console.log(isHybrid())
 */
export function isHybrid() {
    return hybrid;
}

/**
 * 插件调用
 * @description 底层调用 `Cordova` 原生方法
 * @param service 调用的插件的插件名
 * @param action 调用的插件的方法名
 * @param args 调用是传递的参数
 * @param success 成功回调
 * @param error 失败回调
 * @param defaultFn 浏览器模拟数据函数
 * @param format 返回数据拦截格式化函数
 */
export function nativeCall(service: string, action: string, args: any[] | null, success?: (data: any) => void, error?: (e: any) => void, defaultFn?: () => any, format?: (data: any) => any) {
    if (!success) {
        return new Promise((resolve, reject) => {
            nativeCall(service, action, args, resolve, reject, defaultFn, format);
        });
    }
    if (!error) {
        error = e => {
            console.error(e);
            if ((window as any)['wdui']['WduiConfig']['debug']) {
                alert(`${e.r}: ${e.m}`);
            }
        };
    }
    let monitorData = monitor.start(service, action); // 开始监控
    if (isHybrid()) {
        ready(() => {
            if ((window as any).Cordova) {
                Cordova.exec((data: any) => {
                    monitor.end(monitorData);
                    success(format ? format(data) : data);
                }, (err: any) => {
                    monitor.end(monitorData);
                    (error as any)(err);
                    if ((window as any)['wdui']['WduiConfig']['debug']) {
                        alert(`${err.r}: ${err.m}`);
                    }
                }, service, action, args);
            }
        }, error);
    } else if (defaultFn) {
        monitor.end(monitorData);
        success(format ? format(defaultFn()) : defaultFn());
    } else {
        monitor.end(monitorData);
        error({
            r: -10001,
            m: `无法模拟${service}.${action}接口回调,请在App内使用此功能`
        });
    }
}

/**
 * cordova是否准备完成
 * @ignore
 */
if (!deviceReady) {
    deviceReady = false;
}

/**
 * 准备函数
 * @description 判断app中cordova是否准备完成
 * @param success 成功回调
 * @param error 失败回调，不在app内部
 * @example ready(()=>{ console.log('成功回调')},()=>{ console.log('失败')})
 * @example ready().then(()=>{console.log('成功')}).catch(()=>{console.log('失败')})
 */
export function ready(success?: (data?: any) => void, error?: (e: any) => void) {
    if (!success) {
        return new Promise((resolve, reject) => {
            ready(resolve, reject);
        });
    }
    if (isHybrid()) {
        if (deviceReady) {
            success();
        } else {
            document.addEventListener("deviceready", () => {
                deviceReady = true;
                success();
            }, false);
        }
    } else if (error) {
        error({
            r: -10002,
            m: `Cordova未注入app的UA,不在App内？`
        });
    }
}
```

## 最后

组件库真的是一个团队可以持续开发的核心项目，他能极大的帮助整个团队提高开发效率，最重要的是加班少了。同样的一个组件库的质量是非常重要的，必须让所有开发认为，组件库的内容一定是稳定的，不会有问题的，这样你的组件库才能推广出去，才能让团队成员爱不释手。