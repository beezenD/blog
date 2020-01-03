# 初探 React Hook

很多人都听过 React Hook，但其实对它也不是很清楚。大概知道是个啥，但要和别人说却也说不出来是个啥。

如果你想入门 React Hook。

如果你想应付面试。

如果你没有耐心去看官方文档。

那就看完下面内容就够了。(附官方地址：[https://zh-hans.reactjs.org/docs/hooks-intro.html](https://zh-hans.reactjs.org/docs/hooks-intro.html))

## 简单介绍

1.什么是 React Hook

顾名思义，它就是提供了几个勾子，能够调用 React 的方法（只能在 React 中使用）。

简单讲：它就是提供了几个函数api，`useState` 它就是来调用 `state`,`this.setState`。`useEffect` 它就类似生命周期，重新渲染时触发回调，等同于 `componentDidMount`,`componentDidUpdate`。

2.设计目的

用阮一峰老师文章中的一句话：`React Hooks 的设计目的，就是加强版函数组件，完全不使用"类"，就能写出一个全功能的组件。`

3.怎么用

首先要明白为什么要用，同样首先要知道`函数组件`（函数组件：它是一个函数，也是一个组件，但它没有 `state` 状态,也没有 `componentDidMount` 等生命周期，优点：代码少，效率高）。

用过的都知道，很多简单的组件，它其实还是需要状态的，所以就出现了 React Hook。用它就可以不用写 `class` 类，就能在函数中使用 `state` 状态，"生命周期",以及一些 React 本身的 api。

具体怎么用，主要看下面两个 API,其他的一些就看官方文档吧。（注：下面案例来源于官方文档）

## useState

Hook 写法:

```javascript
import React, { useState } from 'react';

function Example() {
  // 声明一个叫 "count" 的 state 变量
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

等价 Class 写法:

```javascript
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```

`useState()` 方法返回值为：当前 state 以及更新 state 的函数。所以用解构的方式 `const [count, setCount] = useState(0)`，函数第一个参数为当前 state 的初始值。

可以同时多个使用，必须最顶层使用。如下：

```javascript
import React, { useState } from 'react';

function Example() {
  const [count, setCount] = useState(0);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: '学习 Hook' }]);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

## useEffect

Hook 写法：

```javascript
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

等价 Class 写法:

```javascript
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
  }

  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```

上面 `useEffect` 等价于 `componentDidMount` 和 `componentDidUpdate`,通过这个函数，你可以告诉 React 组件需要在渲染后执行某些操作。React 会保存你传递给 useEffect 的函数，例如：`useEffect(()=>{ alert(1) })`,表示执行 DOM 更新之后调用 alert。

`另一部分：需要清除的 effect`

在 React Class 中，componentDidMount 中设置的订阅，需要在 componentWillUnmount 中清除它（也就是组件卸载时，需要清除一些异步、广播或者叫做订阅等，不然可能会有意向不到的bug，像计时器、异步接口等，可以自己揣摩一下）。

Hook 写法如下：

`useEffect` 中传入的参数我们称为 `effect` ，当 `effect` 返回一个函数，React 将会在执行清除操作时调用它,这就是 effect 可选的清除机制。

```javascript
import React, { useEffect } from 'react';

function example() {
  useEffect(() => {
    ChatAPI.subscribe();
    return function cleanup() {
      ChatAPI.unsubscribe();
    };
  });
  return <div></div>;
}
```

## 规则

Hook 的规则很好理解，核心就两个

1.只在最顶层使用 Hook

2.只在 React 函数中调用 Hook

因为：Hook 调用顺序在多次渲染之间需要保持一致，所以必须要放顶层，没有逻辑判断（这样 React 才知道哪一个 Hook 对应哪一个操作 state 函数和 state，或者其他的api）。

## 最后

在目前大家都着重前端工程化，前端性能优化的时候，React 的这一手能极大的满足开发者的需求，不至于让大家弃坑。React Hook 这个 api 或者说这概念、设计，这一定是 React 的未来方向。所以有兴趣，愿意挤时间，少看会电视，少玩点游戏，一定要好好的仔细的研究一下 React Hook 的底层原理，以及它的设计思想来源。
