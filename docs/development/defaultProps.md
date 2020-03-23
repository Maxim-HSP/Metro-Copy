---
name: 函数组件的默认值
menu: 开发
---

## Function Component 的 DefaultProps 怎么处理？
+ 这个问题看似简单，实则不然。我们至少有两种方式对 Function Component 的 DefaultProps 进行赋值，下面一一说明。

  首先对于 Class Component，DefaultProps 基本上只有一种大家都认可的写法：

    ```js
      class Button extends React.PureComponent {
        defaultProps = { type: "primary", onChange: () => {} };
      }
    ```
  然而在 Function Component 就五花八门了。

  利用 ES6 特性在参数定义阶段赋值

    ```js
      function Button({ type = "primary", onChange = () => {} }) {}
    ```

  这种方法看似很优雅，其实有一个重大隐患：没有命中的 props 在每次渲染引用都不同。

  看这种场景：

  ```
    const Child = memo(({ type = { a: 1 } }) => {
      useEffect(() => {
        console.log("type", type);
      }, [type]);

      return <div>Child</div>;
    });
  ```
  只要 type 的引用不变，useEffect 就不会频繁的执行。现在通过父元素刷新导致 Child 跟着刷新，我们发现，每次渲染都会打印出日志，也就意味着每次渲染时，type 的引用是不同的。

  有一种不太优雅的方式可以解决：

  ```js
    const defaultType = { a: 1 };

    const Child = ({ type = defaultType }) => {
      useEffect(() => {
        console.log("type", type);
      }, [type]);

      return <div>Child</div>;
    };
  ```
  复制代码此时不断刷新父元素，只会打印出一次日志，因为 type 的引用是相同的。

  我们使用 DefaultProps 的本意必然是希望默认值的引用相同， 如果不想单独维护变量的引用，还可以借用 React 内置的 defaultProps 方法解决。
