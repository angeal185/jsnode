import { x, xrender } from './modules/xscript.mjs';
import { xutils } from './modules/xutils.mjs';
import { xviews } from './views/xviews.mjs';
import { xdata } from './data/xdata.mjs';

//cached reference to app-main object
let app_main = x('div');

// app default functions
let defaults = Object.assign(xdata.default, {
  app_main: app_main,
  each: {
    before: function(dest) {
      // return false;  cancel rout
      return true // continue to rout
    },
    after: function(dest) {
      document.title = dest.slice(1)
    }
  },
  init: function(){
    xutils.build(xdata, xviews['build'](app_main));
    
    return this;
  },
  render: function(stream, path, data, cb){
    xrender(stream, xviews[path], data, xdata[path], cb);
    return this;
  }
})

export { defaults, app_main }
