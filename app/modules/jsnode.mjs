import { defaults } from './defaults.mjs';
import { utils } from './utils.mjs';

const ls = utils.ls;


let navigate = {},
stream;

function Router(cnf) {
  this.settings = defaults;

  if(cnf){
    this.settings = Object.assign(this.settings, cnf)
  }

  let settings = this.settings,
  x = ls.get(settings.pf)
  if (!x || x === '') {
    ls.set(settings.pf, {})
  }

  let init = settings.init;
  if(init){
    this.init = settings.init
  }

}

Router.prototype = {
  on(dest, fn) {
    navigate[dest] = fn;
    return this;
  },
  off(dest, cb) {
    delete navigate[dest];
    return this;
  },
  back() {
    let pf = this.settings.pf,
    r = ls.get(pf),
    current = ls.get(pf +'_current'),
    prev = ls.get(pf +'_prev');

    if(current === prev || !prev || typeof prev !== 'string' || !r[prev]){
      return;
    }

    this.rout(prev, r[prev])
  },
  rout(dest, data) {
    let settings = this.settings,
    params;
    data = {data: data};

    if(settings.params){
      params = utils.parse_params(dest);
      dest = params.dest;
      data.params = params.params;
    }

    if (dest === settings.error) {
      return navigate[dest](data)
    }

    if (dest === settings.base_path && !data) {
      data = {data: settings.base_data};
    }

    let pf = settings.pf,
    before = settings.before,
    after = settings.after,
    r = ls.get(settings.pf),
    current = ls.get(pf +'_current');

    if (before && typeof before === 'function') {
      if (!before(dest)) {
        return;
      };
    }

    location.hash = dest;

    let loc = location;

    data.href = loc.href;
    data.host = loc.host;
    data.path = loc.hash.slice(1);

    try {
      navigate[dest](data, stream);
      r[dest] = {
        date: Date.now() + settings.max_age,
        data: data
      }

      ls.set(pf, r);
      ls.set(pf +'_current', dest);
      ls.set(pf +'_prev', current);

    } catch (err) {
      return router.rout('error', {
        dest: dest,
        msg: 'not found',
        code: 404
      })
    }

    if (after && typeof after === 'function') {
      after(dest);
    }
  },
  listen() {
    let settings = this.settings;

    stream = new Stream(settings);

    let dest = location.hash.slice(1),
    pf = settings.pf,
    params;

    if(settings.params){
      params = utils.parse_params(dest);
      dest = params.dest;
      params = params.params;
    }

    ls.set(pf +'_current', dest);
    if (location.href !== settings.origin) {
      let r = ls.get(pf),
      dnow = Date.now();

      if (r[dest]) {
        if (r[dest].date && typeof r[dest].date === 'number' && r[dest].date > dnow) {
          console.log('path data found')
          if(settings.params && params){
            r[dest].data.params = params
          }
          navigate[dest](r[dest].data, stream);
        } else {
          this.rout(settings.base_path, settings.base_data, stream);
          delete r[dest];
          ls.set(pf, r);
        }
      } else {
        this.rout(settings.base_path, settings.base_data, stream);
      }
    } else {
      this.rout(settings.base_path, settings.base_data, stream);
    }
    return this;
  },
  validate() {
    let pf = this.settings.pf,
    r = ls.get(pf),
    dnow = Date.now();
    try {
      Object.keys(r).forEach(function(key) {
        if (key.date < dnow){delete r[key];}
      });
      ls.set(pf, r);
    } catch (err) {
      console.error(err)
    } finally {
      return this;
    }
  }
};

function Stream(cnf){
  this.settings = cnf

}

Stream.prototype = {
  download(filename, text, type, charset){
    utils.download(this.settings.download, filename, text, type, charset);
    return this
  },
  empty(x){
    utils.download(this.settings, x);
    return this
  },
  fetch(src, options, cb){
    utils.fetch(this.settings, src, options, cb);
    return this;
  },
  setCookie(key,val,obj){
    utils.cookie.set(key,val,obj);
    return this;
  },
  getCookie(key){
    return utils.cookie.get(key);
  },
  delCookie(key){
    utils.cookie.del(key);
    return this;
  },
  setLs(key,val){
    ls.set(key,val);
    return this;
  },
  getLs(key){
    return ls.get(key);
  },
  delLs(key){
    ls.del(key);
    return this;
  },
  setSs(key,val){
    utils.ss.set(key,val);
    return this;
  },
  getSs(key){
    return utils.ss.get(key);
  },
  delSs(key){
    utils.ss.del(key);
    return this;
  },
  render(data,cb){
   this.settings.render(this,data,cb);
   return this;
  }
}

const router = new Router();

export { router }
