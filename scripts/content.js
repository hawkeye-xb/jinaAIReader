console.info('info from jina reader content.js');
// const body = document.querySelector('body');
// body.style.position = 'relative';

// const iframe = document.createElement('iframe');
// function setIframeStyles() {
// 	iframe.style.width = '100%';
// 	iframe.style.height = '100%';
// 	iframe.style.position = 'absolute';
// 	iframe.style.top = 0;
// 	iframe.style.left = 0;
// 	iframe.style.zIndex = 100;
// 	iframe.style.backgroundColor = '#FFFFFF';
// }

// // body.appendChild(iframe);

// function jinaRespondWithHTML(currentUrl) {
// 	console.info('jinaRespondWithHTML called! currentUrl is: ', currentUrl);
// 	const newUrl = `https://r.jina.ai/${location.href}`;

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
		
// 		iframe.src = blobUrl;
// 		body.appendChild(iframe);
// 		setIframeStyles();
// 	}).catch(error => {
// 		console.error('请求失败:', error);
// 	});
// }
