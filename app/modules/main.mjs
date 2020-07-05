import { router } from './jsnode.mjs';


router.on('/', function(req, res) {

  console.log(req)
  res.setCookie('name', 'value', {
    'path': '/',
    'secure': true,
    'max-age': 999999
  })

/*
  .render({test: 'working'}, function(err){
    if(err){return console.error(err)}
  })//.delCookie('name')
*/


  //res.setSs('key', 'val')


  //console.log(res.getCookie('name'))
  //res.delCookie('name')

})

.on('/home', function(req, res) {

  if(req.params){
    console.log(req.params.get('test'))
  }

/*
  res.render({test: 'working'}, function(err){
    if(err){return console.error(err)}
  })
*/
  console.log(req)

})

.on('/home2', function(req, res) {

  if(req.params){
    console.log(req.params.get('test'))
  }
  console.log(req)

  res.render({test: 'working2'}, function(err){
    if(err){return console.error(err)}
  })

})

.on('/download_example', function(req, res) {
  res.download(
    "test.json", // filename ~ required
    JSON.stringify({"test":"!@#$<}(*&^%$ok"}), // file data ~ required
    'application/json', // content-type ~ optional
    'utf8' // content-encoding ~ optional
  );
})

.on('/fetch_example', function(req, res) {

  res.fetch('./app/data/index.json', function(err, data){
    if(err){return console.error(err)}
    console.log(data)
  })

})

.on('error', function(err) {
  console.log(err)
})

.init().listen().validate();

router.rout('/home?test="ok"', {'test':'sdfsdfsd'}) //fallback to config.base_data




// Start file download.
