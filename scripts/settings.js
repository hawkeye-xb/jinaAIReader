/*
JSON Response 互斥 Stream Mode
'imageCaption', 'gatherAllLinksAttheEnd', 'gatherAllImagesAttheEnd' 只能default
*/ 

init(['imageCaption', 'gatherAllLinksAttheEnd', 'gatherAllImagesAttheEnd', 'JSONResponse']);
function init(names) {
	names.forEach(name => {
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

async function setStorage(obj, callback) {
	chrome.storage.sync.set(obj, function() {
		console.log(obj, `setted`);
		if (callback) callback();
	});
}

function toggleDisabled(name) {
	const actionDom = document.getElementById(name);
	actionDom.disabled = !actionDom.disabled;
}

initLevelOfDetails();

async function initLevelOfDetails() {
	const levelOfDetails = await getStorage('levelOfDetails');
	if (levelOfDetails) {
		var selectElement = document.querySelector('select');
		selectElement.value = levelOfDetails;
	}
	
	initLevelOfDetailsDisabledSwitch('levelOfDetails');

	document.querySelector('#levelOfDetails').addEventListener('change', function(event) {
		var selectedLevelOfDetails = event.target.value;
		let headers = {'levelOfDetails': selectedLevelOfDetails};
		if (selectedLevelOfDetails.toLowerCase() !== 'default') {
			headers = {
				...headers,
				'imageCaption': false, 'gatherAllLinksAttheEnd': false, 'gatherAllImagesAttheEnd': false,
			};
		}

		setStorage(
			headers,
			() => {
				setHeaders({
					"X-Return-Format": selectedLevelOfDetails.toLowerCase(),
				});
				initLevelOfDetailsDisabledSwitch(selectedLevelOfDetails);
			},
		);
	});
}
function initLevelOfDetailsDisabledSwitch(selectedLevelOfDetails) {
	if (selectedLevelOfDetails && selectedLevelOfDetails.toLowerCase() !== 'default') {
		['imageCaption', 'gatherAllLinksAttheEnd', 'gatherAllImagesAttheEnd'].forEach(name => {
			document.getElementById(name).disabled = true;
			document.getElementById(name).checked = false;

			var toggleSwitchWithChild = findToggleSwitchWithChildId(name);
			if (toggleSwitchWithChild) {
				toggleSwitchWithChild.classList.add('disabled');
			}
		});
	} else {
		['imageCaption', 'gatherAllLinksAttheEnd', 'gatherAllImagesAttheEnd'].forEach(name => {
			document.getElementById(name).disabled = false;

			var toggleSwitchWithChild = findToggleSwitchWithChildId(name);
			if (toggleSwitchWithChild) {
				toggleSwitchWithChild.classList.remove('disabled');
			}
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
