# jsnode
A speed oriented javascript browser web framework with nodejs like syntax

## status
* framework ~ working but under development
* documentation ~ incomplete

## goals

* create a browser web framework  that is ideal for full-stack js development.

* the creation of the framework "must" be speed oriented. the code used to create jsnode
  will not contain any so called "synthetic-sugar" that is detrimental to the speed of end
  product. native js must be used over modern js concerning speed.
  the user is free to use any "synthetic-sugar" they wish in creating their app.

* the framework should not obfuscate an entry/mid level developers understanding of js,
  as many browser based frameworks do. there will be no human made euphemisms or concepts
  that confuse or mislead the user in their understanding of how javascript works.

* the framework should be usable for entry/mid level developers and easily extendable/
  highly customizable for mid/high level developers.

* the framework will have its own optional high speed rendering engine but this
  engine can be replaced entirely with any other template engine the user wishes to implement.
  furthermore, the render method will be able to use vanilla javascript / plain html as
  an alternative.

* the framework will produce a spa (single page app) without the need for any specific server
  modifications. it will rely on browser storage as opposed to history state to store state data.

* all router stream methods are to be optional. the user should be able to include/exclude
  all stream methods on a per-case basis to their build.

* the framework will never force a user to use external dependencies

* the framework must have a close to zero learning curve duration


## defaults

* all default vals/functions are fully customizable
```js
// defaults.mjs

// optional cached reference to app-main object for render
let app_main = document.createElement('app-main');

// app defaults
let defaults = {
  origin: 'http://localhost:8000', // app origin
  params: true, // parse rout params
  error: 'error', // error handler listener
  base_path: '/', // app base path
  base_data: { // app base default data
    msg: 'home psdfsath'
  },
  each: { // functions to occur on every rout
    before: function(dest) { // before rout ~ optional
      // return false;  cancel rout
      return true // continue to rout
    },
    after: function(dest) { // after rout ~ optional
      document.title = dest.slice(1)
    }
  },
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
  },
  app_main: app_main, // reference to app-main element
  init: function(){ // function to call prior to initializing router
    document.body.append(app_main);
    return this
  },
  render: function(stream, data, cb){ //render function
    // add custom render function here.
    // jsnode is compatibe with any template engine render/pre-rendered function/s
    // or vanillajs / parsed html
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

```

## API

```js

import { router } from './jsnode.mjs';

#### router


router
.on('/', function(request, stream) {

  stream  
  .render({test: 'working'}, function(err){
    if(err){return console.error(err)}
  })

})

.on('error', function(err) { // router error handler
  console.log(err)
})

.init() // build app base defaults.init function ~ optional
.listen() // initialize router and start listening for rout calls
.validate() // check/remove stale cache entries ~ optional


#### rout


router
.on('/test_basic', function(request, stream) {
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

#### render

router.on('/', function(request, stream) {

  stream
  .setCookie('name', 'value', { // add cookie
    'path': '/',
    'secure': true,
    'max-age': 999999
  })
  .render(request.data, function(err){
    if(err){return console.error(err)}
  })

})

#### download

router.on('/download', function(request, stream) {

    let data = JSON.stringify({"test":"!@#$<}(*&^%$ok"});
    stream.download(
      "test.json", // filename ~ required
      data, // file data ~ required
      'application/json', // content-type ~ optional
      'utf8' // content-encoding ~ optional
    );

})

#### fetch

router
.on('/fetch_default', function(request, stream) {

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
  let obj = {
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

#### params

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

#### cookies

router.on('/', function(request, stream) { // add cookie

  stream
  .setCookie('name', 'value', {
    'path': '/',
    'secure': true,
    'max-age': 999999
  })
  .delCookie('name') // delete cookie

  console.log(stream.getCookie('name')) // get a cookie

})

#### sessionStorage

router.on('/', function(request, stream) {
  stream
  .setSs('key', {test: 'working'}) // set stringified session storage

  .delSs('key') // delete session storage item

  console.log(stream.getSs('key')) // get parsed session storage

})

#### localStorage

router.on('/', function(request, stream) {
  stream
  .setLs('key', {test: 'working'}) // set stringified local storage

  .delLs('key') // delete local storage item

  console.log(stream.getLs('key')) // get parsed local storage

})



```
