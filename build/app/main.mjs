import { router, x, q } from './jsnode/jsnode.mjs';


function render_error(){

}
router.on('/', function(request, stream) {

  stream.render('index', function(err){
    if(err){
      stream.renderErr();
      return;
    }


  })

})

.on('/home', function(request, stream) {

  stream.render('home', request.data, function(err){
    if(err){
      stream.renderErr();
      return;
    }
  })


})

.on('/error', function(request, stream) {
  stream.render('error', request.data, function(err){
    if(err){return console.error(err)}
  })

})

.init().listen().validate();

window.onload = function(){
  //router.rout('/home', {})
}

//router.rout('/');

function onmessage(evt){
  console.log(evt)
}

function onerror(evt){
  console.log(evt)
}


//worker.add({path:'test.js', type: 'web'}, onmessage, onerror)
