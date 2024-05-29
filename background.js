chrome.webRequest.onErrorOccurred.addListener(
  function(details) {
    console.log("Request failed: ", details);
    if (details.error === "net::ERR_BLOCKED_BY_CLIENT") {
      // 这里处理特定的错误，例如由于广告拦截插件导致的请求被阻止
      console.log("Request was blocked by an extension: ", details.url);
    } else {
      // 处理其他类型的错误
      console.log("Other error occurred: ", details.error);
    }
  },
  {urls: ["<all_urls>"]} // 监听所有URLs，你可以根据需要修改这里以只监听特定的URLs
);

chrome.webNavigation.onCompleted.addListener(function(details) {
  console.log('Navigation completed: ', details.url);
}, {url: [{urlMatches : 'http://*/*'}, {urlMatches : 'https://*/*'}]});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.active) {
      console.log('Tab updated: ', tab.url);
  }
});

chrome.runtime.onInstalled.addListener(() => {
  // chrome.action.setBadgeText({
  //   text: "OFF",
  // });
  // const mth = 'chrome-error://';
  // if (location.href.match(mth)) {
  //   console.info('chrome error page, auto redirect');
  //   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  //     console.info(tabs[0].url);
  //     chrome.tabs.update(
  //       currentTab.id,
  //       {
  //         url: `https://jina-redirect-file.vercel.app/?targetURL=${encodeURIComponent(tabs[0].url)}`
  //       }
  //     );
  //   });
  // }
});

// const extensions = 'https://developer.chrome.com/docs/extensions'
// const webstore = 'https://developer.chrome.com/docs/webstore'

// chrome.action.onClicked.addListener(async (tab) => {
//   if (tab.url.startsWith(extensions) || tab.url.startsWith(webstore)) {
//     // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
//     const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
//     // Next state will always be the opposite
//     const nextState = prevState === 'ON' ? 'OFF' : 'ON'

//     // Set the action badge to the next state
//     await chrome.action.setBadgeText({
//       tabId: tab.id,
//       text: nextState,
//     });

// 		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
// 			chrome.scripting.executeScript({
// 				target: {tabId: tabs[0].id},
// 				function: () => {
// 					alert('Hello, world!');
// 				}
// 			}, function(results) {
// 				// 这里的results是一个数组，包含了每个执行环境的执行结果
// 				console.log(results);
// 			});
// 		});
//   }
// });
