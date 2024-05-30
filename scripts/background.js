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

initLevelOfDetails();
async function initLevelOfDetails() {
  const levelOfDetails = await getStorage('levelOfDetails');
  if (levelOfDetails) {
    setHeaders({
      "X-Return-Format": levelOfDetails.toLowerCase(),
    });
  }
}

async function setHeaders(obj) {
  const allResourceTypes = Object.values(chrome.declarativeNetRequest.ResourceType);
  const MY_CUSTOM_RULE_ID = 1

  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [MY_CUSTOM_RULE_ID],
    addRules: [
      {
        id: MY_CUSTOM_RULE_ID,
        priority: 1,
        action: {
          type: "modifyHeaders",
          requestHeaders: Object.keys(obj).map(el => {
            const value = obj[el];
            return {
              operation: "set",
              header: el,
              value,
            }
          })
          // requestHeaders: [
          //   {
          //     operation: "set",
          //     header: "X-Return-Format",
          //     value: "screenshot"
          //   },
          // ]
        },
        condition: {
          urlFilter: "r.jina.ai",
          resourceTypes: allResourceTypes
        },
      }
    ],
  });

}

async function getStorage(name) {
	return new Promise((resolve, reject) => {
		chrome.storage.sync.get([name], function(result) {
			if (chrome.runtime.lastError) {
				reject(new Error(chrome.runtime.lastError));
			} else {
				resolve(result[name]);
			}
		});
	});
}
