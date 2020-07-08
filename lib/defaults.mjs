// optional default template engine setup
import { x, xrender } from './xscript.mjs';
import { xtpl } from '../views/xviews.mjs';
import { xdata } from '../data/xdata.mjs';
//cached reference to app-main object

let app_main = x('div');

// app defaults
let defaults = {
  version: '1.0.0', // don't delete me
  origin: 'http://localhost:8000',
  params: true,
  error: '/error',
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
    document.head.append(x('link', {
      href: 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.0/css/bootstrap.min.css',
      rel: 'stylesheet'
    }))
    document.body.append(xtpl['build'](app_main));
    return this;

  },
  render: function(stream, path, data, cb){
    xrender(stream, xtpl[path], data, xdata[path], cb);
    return this;
  }
}

export { defaults, app_main }
