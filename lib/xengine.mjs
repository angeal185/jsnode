// clone dom object cache

let cobj = {
  txt: document.createTextNode('')
}

const u = {
  cloneTxt(l){
    let t = cobj.txt.cloneNode(false);
    t.textContent = l;
    return t;
  },
  isNode: function(i) {
    return i && i.nodeName && i.nodeType
  }
}

function xrender(stream, xpath, data, xdata, cb){
  try {
    if(typeof data === 'object'){
      data = Object.assign({}, xdata, data);
    } else {
      cb = data;
      data = xdata
    }
    stream.empty().append(xpath(stream, data));
    if(cb){cb(false)}
  } catch (err) {
    if(cb){cb(err)}
  }
}

function fn(e, l) {
  let t = typeof l;
  if (t === 'string') {
    if(!e){
      if(!cobj[l]){
        cobj[l] = document.createElement(l);
      }
      e = cobj[l].cloneNode(false);
    } else {
      e.appendChild(u.cloneTxt(l))
    }
  } else if (t === 'number' || t === 'boolean') {
    e.appendChild(u.cloneTxt(l.toString()))
  } else if (u.isNode(l)) {
    e.appendChild(l)
  } else if (t === 'object') {
    for (let k in l) {
      if (typeof l[k] === 'function') {
        e[k] = l[k];
      } else {
        e.setAttribute(k, l[k])
      }
    }
  } else if (t === 'function') {
    let v = l();
    e.appendChild(u.isNode(v) ? v : u.cloneTxt(v));
  }
  return e;
}

function x(){
  let arr = [...arguments],
  e = null;
  while (arr.length) {
    e = fn(e, arr.shift());
  }
  return e;
}

export { x, xrender };
