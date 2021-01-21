const headers = {
  referrer: 'https://airbnb.com/',
  referrerPolicy: 'origin',
  accept: 'application/json; charset=UTF-8',
  'persistent-device-id': localStorage.getItem('AirbnbWeb/uuid'),
  platform: 'web',
  'X-Auth-Token': localStorage.getItem('AirbnbWeb/APIToken')
};

const defaultOptions = {
  headers,
  method: 'GET'
};

const fetchResource = (url, body = false) => {
  return new Promise((resolve, reject) => {
    const options = defaultOptions;
    if (body) {
      options.headers['content-type'] = 'application/json';
      options.body = JSON.stringify(body);
      options.method = 'POST';
    }
    chrome.runtime.sendMessage({ url, options }, (messageResponse) => {
      const [response, error] = messageResponse;
      if (response === null) {
        reject(error);
      } else {
        // Use undefined on a 204 - No Content
        const body = response.body ? new Blob([response.body]) : undefined;
        resolve(
          new Response(body, {
            status: response.status,
            statusText: response.statusText
          })
        );
      }
    });
  })
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      return data ? JSON.parse(data) : {};
    })
    .catch((error) => {
      console.log(error);
    });
};

export { fetchResource };
