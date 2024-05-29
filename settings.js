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
		// const switchStatus = localStorage.getItem(name) === 'true';
		const switchStatus = await getStorage(name);
		// localStorage.setItem(name, !switchStatus);
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

initLevelOfDetails();
async function initLevelOfDetails() {
	// var savedLevelOfDetails = localStorage.getItem('levelOfDetails');
	const levelOfDetails = await getStorage('levelOfDetails');
	if (levelOfDetails) {
		var selectElement = document.querySelector('select');
		selectElement.value = levelOfDetails;
	}

	document.querySelector('#levelOfDetails').addEventListener('change', function(event) {
		var selectedLevelOfDetails = event.target.value;
		console.info('selectedLevelOfDetails: ', selectedLevelOfDetails);
		// localStorage.setItem('levelOfDetails', selectedLevelOfDetails);
		setStorage(
			{'levelOfDetails': selectedLevelOfDetails},
			() => {
				setHeaders({
					"X-Return-Format": selectedLevelOfDetails.toLowerCase(),
				})
			},
		);
	});
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
