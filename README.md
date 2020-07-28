# jsnode
A speed oriented javascript browser web framework with nodejs like syntax

# build

```js
// cwd
const { build } = require('jsnode');

build()


```


# defaults

* all default vals/functions are fully customizable
```js
// ./app/defaults.mjs

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
    before: function(dest) { // tasks to be carried out prior to each rout
      // return false;  cancel rout
      return true // continue to rout
    },
    after: function(dest) { // tasks to be carried out after each rout
      document.title = dest.slice(1)
    }
  },
  init: function(){ // tasks to be carried out on init
    xutils.build(xdata, xviews['build'](app_main));
    return this;
  },
  render: function(stream, path, data, cb){ // tasks to be carried out on render
    xrender(stream, xviews[path], data, xdata[path], cb);
    return this;
  }
})

export { defaults, app_main }

```

```js
// app/data/xdata.mjs

const xdata = {
  default:{
    version: '1.0.0', // app version
    origin: 'http://localhost:8000', // app origin
    params: true, // parse rout params
    error: 'error', // error handler listener
    base_path: '/index', // app base path
    delete_meta: 10000, // automatically remove meta timeout in ms || 0/false
    base_script_name: 'main', //main script name attr
    styles:[{ // styles to be added
      href: 'app/css/app.css',
      rel: 'stylesheet'
    }],
    js_head:[], // js to be added to head
    js_body:[], // js to be added to body
    storage: { // state storage
       max_age: 9999999999, // state storage max-age ms
       prefix: 'rt' // state storage key prefix
     },
     stream: { // stream method defaults/fallbacks
       download: { //download fallbacks
         type: 'text/plain',
         charset: 'utf-8'
       },
       fetch: { //fetch fallbacks
         method: 'GET',
         headers: {
           'Content-Type': 'application/json'
         }
       }
     }
  },
  // rout default data below
  index: {
    msg: 'Big things have small beginnings.'
  },
  home: {
    msg: 'welcome message 2'
  }
}

export { xdata }


```

# router

```js

import { router, x } from './app/modules/jsnode.mjs';

router.on('/', function(request, stream) {

  stream.render('index', request.data, function(err){
    if(err){return console.error(err)}
  })

})
.on('/home', function(request, stream) {

  stream.render('home', request.data, function(err){
    if(err){return console.error(err)}
  })

})
.on('error', function(err) { // router error handler
  console.log(err)
})

.init() // build app base defaults.init function ~ optional ~ called first
.listen() // initialize router and start listening for rout calls ~ called second
.validate() // check/remove stale cache entries ~ optional ~ called third
```

#### router.on
```js
//router.on
import { router } from './jsnode.mjs';

router.on('/', function(req, res) {
  console.log(req) // request object
  console.log(res) // stream object
})

```

#### router.off
```js
//router.off
import { router } from './jsnode.mjs';

router.on('/delete_rout', function(request,stream){

})
.off('/delete_rout')// delete rout '/delete_rout'

```

#### router.rout

```js
//router.rout

router.on('/test_basic', function(request, stream) {
  console.log(request.data) // {test:'basic'}
})

.on('/test_params', function(request, stream) {

  if(request.params){
    console.log(request.params.get('test')) // ok
  }

})

// navigate with data
router.rout('/test_basic', {
  test:'basic'
})

// navigate with data and params
router.rout('/test_params?test=ok', {
  'test':'sdfsdfsd'
})
```


# stream

#### stream.render

```js
//stream.render

router.on('/', function(request, stream) {

  stream.setCookie('name', 'value', { // add cookie
    'path': '/',
    'secure': true,
    'max-age': 999999
  })

  stream.render('index', function(err){
    if(err){return console.error(err)}
    //do something

  })

})
.on('/about', function(request, stream) {

  stream.render('about', {some: 'data'}, function(err){
    if(err){return console.error(err)}
    //do something
  })

})

```

#### stream.redirect

redirect path
```js
//stream.render

router.on('/path1', function(request, stream) {

  // navigate away from path1 to path2 within the site
  // history state is added
  stream.redirect('/path2', {data: 'redirecting'})

})

```

#### stream.replace

replace state
```js
//stream.render

router.on('/path1', function(request, stream) {

  // load path2 into view without navigating away from path1
  // no history state is added

  stream.replace('/path2', {data: 'redirecting'})

})

```


#### stream.download

```js
//stream.download
router.on('/download', function(request, stream) {

    let data = JSON.stringify({"test":"!@#$<}(*&^%$ok"});
    stream.download(
      "test.json", // filename ~ required
      data, // file data ~ required
      'application/json', // content-type ~ optional
      'utf8' // content-encoding ~ optional
    );

})

```

#### stream.fetch

```js
//stream.fetch

router.on('/fetch_default', function(request, stream) {

  //fallback to default.fetch
  stream.fetch('./app/data/index.json', function(err, data){
    if(err){return console.error(err)}
    console.log(data.headers) // return response headers object
    console.log(data.json) // return json data
    console.log(data.body) // return body response
  })

})
.on('/fetch_post', function(request, stream) {
  // cors post example
  let obj = { // optional || fallback to xdata.default.stream.fetch
    method: 'post',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      'Sec-Fetch-Dest': 'object',
      'Sec-Fetch-mode': 'cors',
      'Sec-Fetch-Site': 'cross-site'
    },
    body: stream.js({example: 'working'})
  }
  //fallback to default.fetch
  stream.fetch('https/someurl.com/api', obj, function(err, data){
    if(err){return console.error(err)}
    console.log(data.headers) // return response headers object
    console.log(data.json) // return json data
    console.log(data.body) // return body response
  })

})

```

#### stream.params

```js
//stream.params
router.on('/', function(request, stream) {

  console.log(request)

  if(request.params){
    console.log(request.params.get('test')) // get params by key
    console.log(params.getAll('foo')) // get all of key ["1","4"].
    console.log(params.has('bar') === true); // true/false param exists
    console.log(params.keys()) // return params keys
    console.log(params.values()) // return params values

    params.set('baz', 3) // set params
    params.append('foo', 4); // add to params
    params.toString() // return params as string
    params.sort(); // sort params
    params.delete('foo') // delete a param

    params.entries()
    params.forEach()

  }

})

```

#### stream.js

```js
//stream.params
router.on('/', function(r, s) {

  let data = {
    test: 'json.stringify'
  }

  console.log(s.js(data)) // '{"test":"json.stringify"}'


  console.log(s.js(data,0,2))
  /*
    {
      "test":"json.stringify"
    }
  */
})

```

#### stream.jp

```js

router.on('/', function(r, s) {

  let data = '{"test":"json.parse"}'

  console.log(s.jp(data)) // {test: "json.parse"}

})

```

#### stream.empty

```js

router.on('/', function(request, stream) {

  stream.empty() // remove app_main childNodes


  stream.empty(document.body)  // remove any elements childNodes

})

```

#### stream.append

```js

router.on('/', function(request, stream) {
  // append elements to app-main
  stream.append(x('p', 'text appended to app-main'))

})

```

#### stream.path

```js

router.on('/example', function(request, stream) {
  // return parsed path details
  console.log(
    stream.path(request.data.filename)
  )
  //{fileName: "file.js", baseName: "file", ext: "js", dirName: "/path/to"}

})

router.rout('/example', {filename: '/path/to/file.js'})

```

#### stream.blob

```js
router.on('/example', function(request, stream) {
  // create blob object from data
  console.log(
    stream.blob(...request.data.blob)
  )
  //Blob {size: 9, type: "plain/text;utf-8"}

})

router.rout('/example', {blob: ['some test', 'plain/text','utf-8']})

```

#### stream.url.parse

```js

router.on('/example', function(request, stream) {
  // return parsed url object
  console.log(
    stream.url.parse(request.data.path)
  )
  /*
  {
    hash: ""
    host: "www.someurl.com"
    hostname: "www.someurl.com"
    href: "https://www.someurl.com/index.js"
    origin: "https://www.someurl.com"
    password: ""
    pathname: "/index.js"
    port: ""
    protocol: "https:"
    search: ""
    searchParams: URLSearchParams {}
    username: ""
  }
  */
})

router.rout('/example', {path: 'https://www.someurl.com/index.js'})

```

#### stream.url.add

```js
router.on('/example', function(request, stream) {
    // create new url from blob object
    let newUrl = stream.url.add(...request.data.url);
    document.body.append(
      x('a', {href: newUrl}, 'test-link')
    )

})

router.rout('/example', {url: ['some test', 'plain/text','utf-8']})

```

#### stream.url.del

```js
router.on('/example', function(request, stream) {
    // create new url from blob object
    let newUrl = stream.url.add(...request.data.url),
    lnk = x('a', {
      href: newUrl,
      onclick: function(){
        lnk.remove();

        setTimeout(function(){
          // delete new url link
          stream.url.del(newUrl);
        },3000)

      }
    }, 'test-link');

    document.body.append(lnk)
})

router.rout('/example', {url: ['some test', 'plain/text','utf-8']})

```

#### cookies

* stream.setCookie
* stream.getCookie
* stream.delCookie

```js

router.on('/', function(request, stream) { // add cookie

  stream.setCookie('name', 'value', {
    'path': '/',
    'secure': true,
    'max-age': 999999
  })
  .delCookie('name') // delete cookie

  console.log(stream.getCookie('name')) // get a cookie

})

```

#### sessionStorage

* stream.ssSet
* stream.ssGet
* stream.ssDel

```js

router.on('/', function(request, stream) {

  stream.ssSet('key', {test: 'working'}) // set stringified session storage
  .ssDel('key') // delete session storage item

  console.log(stream.ssGet('key')) // get parsed session storage

})

```

#### localStorage

* stream.lsSet
* stream.lsGet
* stream.lsDel

```js

router.on('/', function(request, stream) {
  stream.lsSet('key', {test: 'working'}) // set stringified local storage
  .lsDel('key') // delete local storage item

  console.log(stream.lsGet('key')) // get parsed local storage

})

```
