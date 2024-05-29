console.info('info from jina reader content.js');

// // 在content.js中
// chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
//   console.log(response.farewell);
// });

// 在content.js中
chrome.runtime.sendMessage({contentScriptStatus: "loaded"});
