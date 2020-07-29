
const xdata = {
  default:{
    version: '1.0.0',
    origin: 'http://localhost:8000',
    params: true,
    error: '/error',
    base_path: '/index',
    delete_meta: 10000,
    webmanifest: './manifest.webmanifest',
    base_script_name: 'main',
    styles:[{
      href: './app/css/main.css',
      rel: 'stylesheet'
    }],
    js_head:[],
    js_body:[],
    storage: {
      max_age: 9999999999,
      prefix: 'rt'
    },
    stream: {
      download: {
        type: 'text/plain',
        charset: 'utf-8'
      },
      fetch: {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    }
  },
  index: {
    msg: 'Big things have small beginnings.'
  },
  home: {
    msg: 'welcome message 2'
  }
}

export { xdata }
