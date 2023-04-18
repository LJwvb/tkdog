import axios from 'axios';
// const baseUrl = 'http://127.0.0.1:7001/api';
const onlineUrl = 'http://47.97.98.228:7001/api/';

export const request = (method: string, url: string, data?: any) => {
  return new Promise((resolve, reject) => {
    axios({
      method,
      url: onlineUrl + url,
      ...data,
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
