chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.contentScriptStatus === "loaded") {
      console.info('content.js normal operation');
    }
    if (request.greeting === "hello") {
      sendResponse({ farewell: "hi" });
    }
    return true;
  }
);

const allResourceTypes = 
    Object.values(chrome.declarativeNetRequest.ResourceType);
const MY_CUSTOM_RULE_ID = 1

chrome.declarativeNetRequest.updateDynamicRules({
  removeRuleIds: [MY_CUSTOM_RULE_ID],
  addRules: [
    {
      id: MY_CUSTOM_RULE_ID,
      priority: 1,
      action: {
        type: "modifyHeaders",
        requestHeaders: [
          // {
          //   operation: "set",
          //   header: "x-respond-with",
          //   value: "html"
          // },
          // {
          //   operation: "set",
          //   header: "X-With-Generated-Alt",
          //   value: "true"
          // }
          {
            operation: "set",
            header: "X-Return-Format",
            value: "screenshot"
          },
        ]
      },
      condition: {
        urlFilter: "r.jina.ai",
        resourceTypes: allResourceTypes
      },
    }
  ],
});

// chrome.webRequest.onBeforeSendHeaders.addListener(
//   function(details) {
//     var headers = details.requestHeaders;
//     var headerExists = false;

//     console.info('检查header信息...');
//     // 检查是否已存在
//     for (var i = 0; i < headers.length; ++i) {
//       if (headers[i].name.toLowerCase() === 'x-respond-with') {
//         headerExists = true;
//         headers[i].value = 'html';  // 如果存在，更新它
//         break;
//       }
//     }

//     // 如果header不存在，添加它
//     if (!headerExists) {
//       headers.push({ name: 'x-respond-with', value: 'html' });
//     }

//     return { requestHeaders: headers };
//   },
//   { urls: ["*://r.jina.ai/*"] },  // 仅对https://r.jina.ai的URL有效
//   ["blocking", "requestHeaders"]
// );

