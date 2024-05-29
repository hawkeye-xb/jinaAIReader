document.querySelector('#resHTML').addEventListener('click', () => {
	try {
		const mth = 'chrome-error://';
		console.info('location.href', location.href);
		if (location.href.match(mth)) {
			console.info('chrome error page, auto redirect');
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				console.info(tabs[0].url);
				chrome.tabs.update(
					currentTab.id,
					{
						url: `https://jina-redirect-file.vercel.app/?targetURL=${encodeURIComponent(tabs[0].url)}`
					}
				);
			});

			return;
		}

		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			console.info(tabs[0].url);
	
			chrome.scripting.executeScript({
				target: {tabId: tabs[0].id},
				function: () => {
					generateIframe(tabs[0].url);
				}
			}, function(results) {
				// 这里的results是一个数组，包含了每个执行环境的执行结果
				console.log('code res:', results);
			});
		});
	} catch (error) {
		console.warn('scripting.executeScript 操作error: ', error);
	}
});

function generateIframe(url) {
	const body = document.querySelector('body');
	body.style.position = 'relative';

	const iframe = document.createElement('iframe');
	function setIframeStyles() {
		iframe.style.width = '100%';
		iframe.style.height = '100%';
		iframe.style.position = 'absolute';
		iframe.style.top = 0;
		iframe.style.left = 0;
		iframe.style.zIndex = 100;
		iframe.style.backgroundColor = '#FFFFFF';
	}

	const newUrl = `https://r.jina.ai/${url}`;
	// Unchecked runtime.lastError: Frame with ID 0 is showing error page 不能修改chrome:// 协议的页面

	fetch(newUrl, {
		method: 'GET',
		headers: {
			'x-respond-with': 'html',
		},
	}).then(response => {
		if (!response.ok) {
			throw new Error('网络请求错误，状态码：' + response.status);
		}
		return response.text();
	}).then(data => {
		const blob = new Blob([data], {type: 'text/html'});
		const blobUrl = URL.createObjectURL(blob);
		console.info('新地址:', blobUrl);
		
		iframe.src = blobUrl;
		body.appendChild(iframe);
		setIframeStyles();
	}).catch(error => {
		console.error('请求失败:', error);
	});
}

