console.info('hello chrome');

document.querySelector('#usePrefix').addEventListener('click', () => {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			var currentTab = tabs[0]; // 在当前窗口中获取活动标签
			console.info(currentTab.url); // 输出当前标签的URL
			var newUrl = `https://r.jina.ai/${currentTab.url}`; // 您想要导航到的新URL
			console.info(`newUrl: ${newUrl}`);
			chrome.tabs.update(currentTab.id, {url: newUrl});
	});
});