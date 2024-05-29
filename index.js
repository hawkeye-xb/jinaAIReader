document.querySelector('#usePrefix').addEventListener('click', () => {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			var currentTab = tabs[0]; // 在当前窗口中获取活动标签
			console.info(currentTab.url); // 输出当前标签的URL
			var newUrl = `https://r.jina.ai/${currentTab.url}`; // 您想要导航到的新URL
			console.info(`newUrl: ${newUrl}`);
			chrome.tabs.update(currentTab.id, {url: newUrl});
	});
});

// document.querySelector('#resHTML').addEventListener('click', () => {
// 	try {
// 		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
// 			console.info('current tab url is:', tabs[0].url);
// 			chrome.tabs.update(
// 				tabs[0].id,
// 				{
// 					url: `https://hawkeye-jina-redirect-file.deno.dev/?targetURL=${encodeURIComponent(tabs[0].url)}`
// 				}
// 			);
// 		});

// 	} catch (error) {
// 		console.warn('scripting.executeScript 操作error: ', error);
// 	}
// });

// function generateIframe(url) {
// 	const body = document.querySelector('body');
// 	body.style.position = 'relative';

// 	const iframe = document.createElement('iframe');
// 	function setIframeStyles() {
// 		iframe.style.width = '100%';
// 		iframe.style.height = '100%';
// 		iframe.style.position = 'absolute';
// 		iframe.style.top = 0;
// 		iframe.style.left = 0;
// 		iframe.style.zIndex = 100;
// 		iframe.style.backgroundColor = '#FFFFFF';
// 	}

// 	const newUrl = `https://r.jina.ai/${url}`;
// 	// Unchecked runtime.lastError: Frame with ID 0 is showing error page 不能修改chrome:// 协议的页面

// 	fetch(newUrl, {
// 		method: 'GET',
// 		headers: {
// 			'x-respond-with': 'html',
// 		},
// 	}).then(response => {
// 		if (!response.ok) {
// 			throw new Error('网络请求错误，状态码：' + response.status);
// 		}
// 		return response.text();
// 	}).then(data => {
// 		const blob = new Blob([data], {type: 'text/html'});
// 		const blobUrl = URL.createObjectURL(blob);
// 		console.info('新地址:', blobUrl);
		
// 		iframe.src = blobUrl;
// 		body.appendChild(iframe);
// 		setIframeStyles();
// 	}).catch(error => {
// 		console.error('请求失败:', error);
// 	});
// }

