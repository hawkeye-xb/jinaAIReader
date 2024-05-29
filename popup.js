console.info('hello chrome');

document.querySelector('#usePrefix').addEventListener('click', () => {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var currentTab = tabs[0]; // 在当前窗口中获取活动标签
    console.info(currentTab.url); // 输出当前标签的URL
    var newUrl = `https://r.jina.ai/${currentTab.url}`; // 您想要导航到的新URL
    console.info(`newUrl: ${newUrl}`);
    // chrome.tabs.update(currentTab.id, {url: newUrl});
    fetch(newUrl, {
      method: 'GET', // 或者 'POST', 'PUT', 等。
      headers: {
        'x-respond-with': 'html',
        // 其他需要的请求头
      },
      // 其他fetch选项
    }).then(response => {
      // 处理响应
      if (!response.ok) {
        throw new Error('网络请求错误，状态码：' + response.status);
      }
      console.info(response);
      return response.text(); //.json();
    }).then(data => {
      console.log(data); // 这里的data是一个JavaScript对象
      console.log(data.replace('甜胚子绿茶', '!!!!!!!!!!!!!!!')); // 这里的data是一个JavaScript对象
      const blob = new Blob([data.replace('甜胚子绿茶', '!!!!!!!!!!!!!!!')], {type: 'text/html'});
      const blobUrl = URL.createObjectURL(blob);
      // chrome.tabs.update({url: url});
      console.info(blobUrl);
      chrome.tabs.update(currentTab.id, {url: blobUrl});
    }).catch(error => {
      console.error('请求失败:', error);
    });

  });
});