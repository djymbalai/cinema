import qs from 'qs'

export default function ({$axios, error}) {

  $axios.onRequest(config => {
    return {
      ...config,
      paramsSerializer: params => qs.stringify(params, {arrayFormat: 'brackets'}),
      headers: {
        ...config.headers,
        'Accept-Language': 'en',
      },
      params: {
        ...config.params
      }
    }
  })

  $axios.onResponse(response => {
    if (response && response.data) {
      let res = {
        ...response,
        data: response.data
      }
      if (res.data && res.data.error_code) {
        switch (res.data.error_code) {
          case 404: {
            if(response.config.method === 'get') {
              error({statusCode: 404});
            }
            break;
          }
          case 403: {
            error({statusCode: 403});
            break;
          }
        }
      }
      return res;
    }
  })

  $axios.onError(({response}) => {
    if (response && response.status) {
      if (response.status === 404 && response.config.method === 'get') {
        error({statusCode: 404});
      }
      if (response.status === 403) {
        error({statusCode: 403});
      }
    }
  })
}
