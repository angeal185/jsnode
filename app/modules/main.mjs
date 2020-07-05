import { router } from './jsnode.mjs';


router.on('/', function(request, stream) {

  let data = '{"test":"json.parse"}'

  console.log(stream.jp(data)) // {test: 'json.parse'}
  stream.setCookie('name', 'value', {
    'path': '/',
    'secure': true,
    'max-age': 999999
  })

/*
  .render({test: 'working'}, function(err){
    if(err){return console.error(err)}
  })//.delCookie('name')
*/


  //stream.setSs('key', 'val')


  //console.log(stream.getCookie('name'))
  //stream.delCookie('name')

})

.on('/home', function(request, stream) {

  if(request.params){
    console.log(request.params.get('test'))
  }

  /*
    stream.render({test: 'working'}, function(err){
      if(err){return console.error(err)}
    })
  */

  console.log(request)

})

.on('/home2', function(request, stream) {

  if(request.params){
    console.log(request.params.get('test'))
  }
  console.log(request)

  stream.render({test: 'working2'}, function(err){
    if(err){return console.error(err)}
  })

})

.on('/download_example', function(request, stream) {
  stream.download(
    "test.json", // filename ~ requestuired
    JSON.stringify({"test":"!@#$<}(*&^%$ok"}), // file data ~ required
    'application/json', // content-type ~ optional
    'utf8' // content-encoding ~ optional
  );
})

.on('/fetch_example', function(request, stream) {

  stream.fetch('./app/data/index.json', function(err, data){
    if(err){return console.error(err)}
    console.log(data)
  })

})

.on('error', function(err) {
  console.log(err)
})

.init().listen().validate();

router.rout('/home?test="ok"', {'test':'sdfsdfsd'}) //fallback to config.base_data
