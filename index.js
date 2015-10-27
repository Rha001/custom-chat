var express 		= require('express');//webserver nodejs Library
var app 			= express();
var http 			= require('http').Server(app);//server Library
var io 				= require('socket.io')(http);//sockets Library
var bodyParser 		= require('body-parser');//Library to manage POST and GET data
//var session 		= require('express-session');//Sessions Library
//var sharedsession 	= require('express-socket.io-session');//Library to read sessions inside the sockets
var shortid 		= require('shortid');//Library to generate some random ids

//var mongoose 	= require('mongoose');
//var process 	= require('process');
var CHAT_ROOMS = 0;

app.set('view engine', 'jade');
app.use(express.static('public'));
app.use( bodyParser.urlencoded({ extended: true }) );
//mongoose.connect('mongodb://localhost/CHAT_DB');

app.get('/', function(req, res){
	res.render('login');
});
app.post('/chat', function(req, res){
	var nombre 	 = req.body.nombre;
	var problema = req.body.problema;
	if( nombre.trim()  != '' && problema.trim()  != '' )
		res.render('chat', { name: nombre, problema: problema, ssid: 'Id from session' });
	else
		res.redirect('/');
});
app.get('/admin', function(req, res){
	res.render('adminChat');
});
app.all('/*', function(req, res) {
	res.redirect('/');
    //res.render(404, '404');
});
io.sockets.on('connection', function(socket){
	console.log('Someone conected !')
	socket.client_id = shortid.generate()
	var CHAT_HISTORY = [];
	socket.on('new room', function(){
		CHAT_ROOMS++;
	});
	socket.on('new client', function(){
		//console.log('Theres a new Client !')
		CHAT_HISTORY.push( { 'client' : socket.client_id } )
		io.emit('new client', {'client' : socket.client_id } );
	});
	socket.on('chat message', function( data ){
		if( data.msg.trim() != '' ){
			var message = {};
			console.log('message: ' + data.msg + ' from: ' + socket.client_id );
			io.emit('chat message client', data.msg);
			CHAT_HISTORY.push( {'msg':data.msg} );
		}
	});
	socket.on('chat response', function( data ){
		if( data.msg.trim() != '' )
			io.emit('chat message server', data.msg);
	});
	socket.on('response', function(msg){
		CHAT_HISTORY.push( { 'resp' : msg.msg } )
	});
	socket.on('disconnect', function(){
		console.log( CHAT_HISTORY );
		CHAT_HISTORY = [];
	});
});
http.listen(3000, function(){
	console.log('listening on *:3000');
});
process.on('uncaughtException', function (err) {
	console.log(err);
});






