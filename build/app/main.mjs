import { router, x } from './modules/jsnode.mjs';

router.on('/index', function(request, stream){
  stream.render('index', function(err){
    if(err){return stream.renderErr();}
  })
})
.on('/home', function(request, stream) {
  stream.render('home', request.data, function(err){
    if(err){return stream.renderErr();}
  })
})
.on('/error', function(request, stream) {
  stream.render('error', request.data, function(err){
    if(err){return console.error(err)}
  })
})
.init().listen().validate();
