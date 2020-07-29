import { x } from '../modules/xscript.mjs';
import { xdata } from '../data/xdata.mjs';
import { router } from '../modules/jsnode.mjs';

const xviews = {
  build(app_main){
    let item = x('main-view',
    x('div', {
        class: 'container'
      }, app_main)
    )

    return item
  },
  error(stream, data){
    return x('code', stream.js(data))
  },

  //views
  index(stream, data){
    let item = x('div', x('p', data.msg));

    return item;
  },
  home(stream, data){
    let item = x('div', x('p', data.msg));

    return item;
  }
}

export { xviews }
