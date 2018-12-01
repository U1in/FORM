const BASE_URL = 'http://192.168.1.231:4000';

export const $get = (url, data) => {
    return new Promise(function (resolve, reject) {
        let XHR = new XMLHttpRequest();
        // XHR.withCredentials = true;
        url = BASE_URL + url;
        if (data !== undefined) {
            let query = '';
            for (let i in data) {
                query += (i + '=' + data[i] + '&');
            }
            url = url + '?' + query;
        }
        XHR.open('GET', url, true);
        XHR.send();

        XHR.onreadystatechange = function () {
            if (XHR.readyState === 4) {
                if (XHR.status === 200) {
                    try {
                        let response = JSON.parse(XHR.responseText);
                        resolve(response);
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    reject(new Error(XHR.statusText));
                }
            }
        }
    })
}

export const $post = (url, data) => {
    return new Promise(function (resolve, reject) {
        let XHR = new XMLHttpRequest();
        // XHR.withCredentials = true;
        XHR.open('POST', BASE_URL + url, true);
        
        XHR.setRequestHeader("Content-Type", "application/json");

        XHR.send(JSON.stringify(data));

        XHR.onreadystatechange = function () {
            if (XHR.readyState === 4) {
                if (XHR.status === 200 || XHR.status === 0) {
                    try {
                        let response = JSON.parse(XHR.responseText);
                        resolve(response);
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    reject(new Error(XHR.statusText));
                }
            }
        }
    })
}