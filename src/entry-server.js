import { createApp } from './main'


// 因为有可能会是异步路由钩子函数或组件，所以将返回一个 Promise，
// 以便服务器能够等待所有的内容在渲染前，就已经准备就绪。
export default context => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp()

    const { url } = context
    // const { fullPath } = router.resolve(url).route

    // if (fullPath !== url) {
    //   return reject({ url: fullPath })
    // }

    // 设置服务器端 router 的位置
    router.push(url)

    // 等到 router 将可能的异步组件和钩子函数解析完
    console.log('asyncData0')
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      // no matched routes
      if (!matchedComponents.length) {
        return reject({ code: 404 })
      }
      // 对所有匹配的路由组件调用 `asyncData()`
      console.log('asyncData1')
      // Promise.all(matchedComponents.map((Component) => {
      //   if (Component.extendOptions.asyncData) {
      //     const result = Component.extendOptions.asyncData({
      //       store,
      //       route: router.currentRoute,
      //       options: {},
      //     });
      //     return result;
      //   }
      // })).then(() => {
      //   // 状态将自动序列化为 window.__INITIAL_STATE__，并注入 HTML。
      //   context.state = store.state;
      //   resolve(app);
      // }).catch(reject);
      Promise.all(matchedComponents.map(({ asyncData }) => asyncData && asyncData({
        store,
        route: router.currentRoute
      }))).then(() => {
        // isDev && console.log(`data pre-fetch: ${Date.now() - s}ms`)

        // 在所有预取钩子(preFetch hook) resolve 后，
        // 我们的 store 现在已经填充入渲染应用程序所需的状态。
        // 当使用 template 时，context.state 将作为 window.__INITIAL_STATE__ 状态，自动嵌入到最终的 HTML 中
        context.state = store.state
        resolve(app)
      }).catch(reject)
    }, reject)
  })
}
