const utils = {
  ls: {
    get(i) {
      return JSON.parse(localStorage.getItem(i))
    },
    set(i, e) {
      localStorage.setItem(i, JSON.stringify(e))
      return;
    },
    del(i) {
      localStorage.removeItem(i);
    }
  },
  ss: {
    get(i) {
      return JSON.parse(sessionStorage.getItem(i))
    },
    set(i, e) {
      sessionStorage.setItem(i, JSON.stringify(e))
      return;
    },
    del(i) {
      sessionStorage.removeItem(i);
    }
  },
  cookie: {
    set(name, val, obj) {
      let str = (name + "=" + val + ";")
      Object.keys(obj).forEach(function(x,y){
        str+= x + "=" + y + ";";
      })
      return document.cookie = str;
    },
    get(name){
      name+= "=";
      let ca = document.cookie.split(';');
      for(var i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return false;
    },
    del(name){
      let str = (name + "=;max-age=0;")
      return document.cookie = str;
    }
  },
  parse_params(str){
    str = str.split('?');
    let obj = {
      dest: str[0]
    }
    if(str[1]){
      obj.params = new URLSearchParams(str[1])
    }
    return obj;
  },
  download(settings, filename, text, type, charset) {
    if(!type){type = settings.type;}
    if(!charset){charset = settings.charset;}
    let blob = new Blob([text], {
      type: [type +";"+ charset].join(';')
    }),
    url = URL.createObjectURL(new Blob([text], {type: type})),
    link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.style.display = 'none';
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    setTimeout(function(){
      URL.revokeObjectURL(url);
      blob = url = link = null;
    },5000)

  },
  empty(settings, x){
    if(!x){
      x = settings.app_main
    }
    while(x.firstChild){
      x.removeChild(x.firstChild);
    }
  },
  fetch(settings, src, options, cb){
    let cnf = settings.fetch
    if(typeof options === 'function'){
      cb = options;
      options = cnf;
    } else {
      options = Object.assign(cnf, options);
    }

    let headers = {}
    fetch(src, options).then(function(res){
      console.log(res)
      if (res.status >= 200 && res.status < 300) {
        headers.status = res.status;
        headers.statusText = res.statusText;
        res.headers.forEach(function(x,y){
          headers[y] = x;
        })
        return res.text();
      } else {
        return Promise.reject(new Error(res.statusText))
      }
    }).then(function(data){
      let ctype = headers['content-type'];

      headers.body = data;

      if (ctype && ctype.includes('application/json')) {
        headers.json = JSON.parse(data)
      }

      cb(false, headers);

      headers = data = null;
    }).catch(function(err){
      cb(err)
    })
  }
}

export { utils }
