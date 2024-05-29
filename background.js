chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.contentScriptStatus === "loaded") {
      console.info('content.js normal operation');
    }
    if (request.greeting === "hello") {
      sendResponse({farewell: "hi"});
    }
    return true;
  }
);
