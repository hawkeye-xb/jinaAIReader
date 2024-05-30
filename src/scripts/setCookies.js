let cookies = [];

// 添加表单提交事件监听器
document.getElementById('cookieForm').addEventListener('submit', function(event) {
	event.preventDefault();

	// 获取输入的值
	let name = document.getElementById('nameInput').value;
	let value = document.getElementById('valueInput').value;
	let domain = document.getElementById('domainInput').value;
	let expires = document.getElementById('expiresInput').value;
	let path = document.getElementById('pathInput').value;
	let secure = document.getElementById('secureInput').checked;
	let httponly = document.getElementById('httponlyInput').checked;

	// 创建Cookie字符串
	let cookieString = `${name}=${value};`;
	if (domain) cookieString += ` Domain=${domain};`;
	if (expires) cookieString += ` Expires=${expires};`;
	if (path) cookieString += ` Path=${path};`;
	if (secure) cookieString += ` Secure;`;
	if (httponly) cookieString += ` HttpOnly;`;

	// 将新的cookie添加到cookies数组中
	cookies.push(cookieString);

	// 更新最终的Cookie字符串显示
	updateFinalCookieString();

	// 清空输入框
	document.getElementById('nameInput').value = '';
	document.getElementById('valueInput').value = '';
	document.getElementById('domainInput').value = '';
	document.getElementById('expiresInput').value = '';
	document.getElementById('pathInput').value = '';
	document.getElementById('secureInput').checked = false;
	document.getElementById('httponlyInput').checked = false;

	setStorage({
		'cookies': cookies,
	});
});

// 添加"Save Cookies as HTTP Headers"按钮的点击事件监听器
// document.getElementById('saveCookies').addEventListener('click', function() {
// 	// 将所有cookie字符串连接起来
// 	let finalCookieString = cookies.join('; ');

// 	// 设置到document.cookie
// 	// document.cookie = finalCookieString;

// 	console.info('Cookies have been saved as HTTP headers. ' + finalCookieString);
// 	setStorage({
// 		'cookies': cookies,
// 	});
// });

document.getElementById('clearCookies').addEventListener('click', function() {
	cookies = [];
	updateFinalCookieString();
	setStorage({
		'cookies': cookies,
	});
});

// 更新最终的Cookie字符串显示
function updateFinalCookieString() {
	let finalCookieString = cookies.join('\n');
	document.getElementById('finalCookieString').textContent = finalCookieString;
}

initCookies();
async function initCookies() {
	const storageCookies = await getStorage('cookies');
	if (storageCookies && storageCookies.length > 0) {
		cookies = cookies.concat(storageCookies);
	}

	updateFinalCookieString();
}

