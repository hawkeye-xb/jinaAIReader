/*
JSON Response 互斥 Stream Mode
'ImageCaption', 'GatherAllLinksAttheEnd', 'GatherAllImagesAttheEnd' 只能default
*/ 
const switchNameItems = [
	'ImageCaption', 'GatherAllLinksAttheEnd', 'GatherAllImagesAttheEnd',
	'JSONResponse',
	'BypasstheCache',
	'TargetSelector',
	'WaitForSelector'
];
init();
async function init() {
	await initLevelOfDetails();
	switchNameItems.forEach(name => {
		initSwitch(name);
		initListener(name);
	});
}
async function initSwitch(name) {
	// const switchStatus = localStorage.getItem(name) === 'true';
	const switchStatus = await getStorage(name);
	document.getElementById(name).checked = switchStatus;
}
function initListener(name) {
	document.getElementById(name).addEventListener('change', async function() {
		const switchStatus = await getStorage(name);
		setStorage({
			[name]: !switchStatus,
		})
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

async function setStorage(obj) {
	chrome.storage.sync.set(obj, function() {
		console.log(obj, `setted`);
		updateHeaders();
	});
}

async function initLevelOfDetails() {
	const levelOfDetails = await getStorage('levelOfDetails');
	if (levelOfDetails) {
		var selectElement = document.querySelector('select');
		selectElement.value = levelOfDetails;
	}
	
	initLevelOfDetailsDisabledSwitch(levelOfDetails);

	document.querySelector('#levelOfDetails').addEventListener('change', function(event) {
		var selectedLevelOfDetails = event.target.value;
		let headers = {'levelOfDetails': selectedLevelOfDetails};
		if (selectedLevelOfDetails.toLowerCase() !== 'default') {
			headers = {
				...headers,
				'ImageCaption': false, 'GatherAllLinksAttheEnd': false, 'GatherAllImagesAttheEnd': false,
			};
		}

		setStorage(headers);
		initLevelOfDetailsDisabledSwitch(selectedLevelOfDetails);
	});
}
function initLevelOfDetailsDisabledSwitch(selectedLevelOfDetails) {
	if (selectedLevelOfDetails && selectedLevelOfDetails.toLowerCase() !== 'default') {
		['ImageCaption', 'GatherAllLinksAttheEnd', 'GatherAllImagesAttheEnd'].forEach(name => {
			document.getElementById(name).disabled = true;
			document.getElementById(name).checked = false;

			var toggleSwitchWithChild = findToggleSwitchWithChildId(name);
			if (toggleSwitchWithChild) {
				toggleSwitchWithChild.classList.add('disabled');
			}
		});
	} else {
		['ImageCaption', 'GatherAllLinksAttheEnd', 'GatherAllImagesAttheEnd'].forEach(name => {
			document.getElementById(name).disabled = false;

			var toggleSwitchWithChild = findToggleSwitchWithChildId(name);
			if (toggleSwitchWithChild) {
				toggleSwitchWithChild.classList.remove('disabled');
			}
		});
	}
}

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

	const cookies = await getStorage('cookies');
	if (cookies && cookies.length > 0) {
		headers["X-Set-Cookie"] = cookies.join('; ');
	}

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

function findToggleSwitchWithChildId(childId) {
  // 获取所有的toggle-switch元素
  var toggleSwitches = document.querySelectorAll('.toggle-switch');

  // 遍历所有的toggle-switch元素
  for (var i = 0; i < toggleSwitches.length; i++) {
    var toggleSwitch = toggleSwitches[i];
    // 检查toggle-switch元素是否有指定ID的子元素
    if (toggleSwitch.querySelector('#' + childId)) {
      return toggleSwitch;
    }
  }

  // 如果没有找到，返回null
  return null;
}
