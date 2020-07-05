//cached reference to app-main object
let app_main = document.createElement('app-main');

// app defaults
let defaults = {
  type: 'hash',
  origin: 'http://localhost:8000',
  params: true,
  error: 'error',
  base_path: '/',
  base_data: {
    msg: 'home psdfsath'
  },
  each: {
    before: function(dest) {
      // return false;  cancel rout
      return true // continue to rout
    },
    after: function(dest) {
      document.title = dest.slice(1)
    }
  },
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
  },
  app_main: app_main,
  init: function(){
    document.body.append(app_main);
    return this
  },
  render: function(stream, data, cb){

    try {
      stream.empty();
      let ele = stream.settings.app_main;
      let p = document.createElement('p');
      p.textContent = data.test;
      ele.append(p)
      cb(false)
    } catch (err) {
      cb(err)
    }
    return this

  }
}

export { defaults, app_main }
