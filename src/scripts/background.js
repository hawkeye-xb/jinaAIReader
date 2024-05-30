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

const switchNameItems = [
	'ImageCaption', 'GatherAllLinksAttheEnd', 'GatherAllImagesAttheEnd',
	'JSONResponse',
	'BypasstheCache',
	'TargetSelector',
	'WaitForSelector'
];
updateHeaders();
async function updateHeaders() {
	const res = await getStorages(switchNameItems.concat(['levelOfDetails']));
	console.info('配置信息:', res);
	const headers = {};
	if (res?.WaitForSelector) {
		headers['X-Wait-For-Selector'] = "#content";
	}
	if (res?.TargetSelector) {
		headers['Target-Selector'] = "#img-content";
	}

	if(res?.levelOfDetails && res?.levelOfDetails !== undefined && res?.levelOfDetails?.toLowerCase() !== 'default') {
		headers['X-Return-Format'] = res?.levelOfDetails?.toLowerCase();
	} else {
		if (res?.ImageCaption) {
			headers["X-With-Generated-Alt"] = "true";
		}
		if (res?.GatherAllLinksAttheEnd) {
			headers["X-With-Links-Summary"] = "true";
		}
		if (res?.GatherAllImagesAttheEnd) {
			headers["X-With-Images-Summary"] = "true";
		}
	}

	if (res?.BypasstheCache) {
		headers["X-No-Cache"] = "true";
	}

  console.info(headers, "headers");
	setHeaders(headers);
}

async function setHeaders(obj) {
  if (!(Object.keys(obj).length > 0)) return;
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
              value, // value为空的时候呢？
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

async function getStorages(names) {
	return new Promise((resolve, reject) => {
		chrome.storage.sync.get(names, function(result) {
			if (chrome.runtime.lastError) {
				reject(new Error(chrome.runtime.lastError));
			} else {
				resolve(result);
			}
		});
	});
}
