import { utils } from './utils.mjs';

function Stream(cnf){
  this.settings = cnf
}

Stream.prototype = {
  download(filename, text, type, charset){
    utils.download(this.settings.download, filename, text, type, charset);
    return this
  },
  empty(x){
    utils.empty(this.settings, x);
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
 },
 js: JSON.stringify,
 jp: JSON.parse
}

export { Stream }
