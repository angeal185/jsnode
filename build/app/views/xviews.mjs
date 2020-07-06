import { x } from '../jsnode/xengine.mjs';
import { xdata } from '../data/xdata.mjs';
import { router } from '../jsnode/jsnode.mjs';

const xtpl = {
  index(stream, data){
    let item = x('div', {
        class: 'mt-4'
      },
      x('p', data.msg)
    )

    return item;
  },
  home(stream, data){
    let item = x('div', {
        class: 'mt-4'
      },
      x('p', data.msg)
    )

    return item;
  },
  error(stream, data){
    return x('code', stream.js(data))
  },
  build(app_main){
    let item = x('div',
    x('nav', {class:'navbar navbar-dark bg-dark justify-content-center'},
      x('a',{class: 'navbar-brand'}, 'jsnode')
    ),
    x('div', {
        class: 'container'
      }, app_main)
    )

    return item
  }
}

export { xtpl }
