import 'react-query';

export const get = async (url) => {
    const config = {
      method: 'GET',
    };
    const response = await fetch(url, config);
    return response.json();
  };
  
export const post = async (url, body) => {
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  };
  
export const put = async (url, body) => {
    return await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  };
  
export const remove = async (url, body) => {
    return await fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
  };
  
//   export const parseResponse = async (response) => {
//     if (!response.ok) {
//       throw response;
//     }
//     if (response.status !== 204) {
//       const json = await response.json();
//       return json;
//     }
//   };