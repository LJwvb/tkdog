import axios from 'axios';
const baseUrl = 'http://127.0.0.1:7001/api';

export const request = (method: string, url: any) => {
  return new Promise((resolve, reject) => {
    axios({
      method,
      url: baseUrl + url,
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
