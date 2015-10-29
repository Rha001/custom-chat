var express 		= require('express');//webserver nodejs Library
var app 			= express();
var http 			= require('http').Server(app);//server Library
var io 				= require('socket.io')(http);//sockets Library
var bodyParser 		= require('body-parser');//Library to manage POST and GET data
//var process 	= require('process');
var CHAT_ROOMS = 0;
var clients = {};//object to store all socket clients
app.set('view engine', 'jade');
app.use(express.static('public'));
app.use( bodyParser.urlencoded({ extended: true }) );
//mongoose.connect('mongodb://localhost/CHAT_DB');

app.get('/', function(req, res){
	res.render('login');
});
app.post('/chat', function(req, res){
	var clientName 	 = req.body.clientName;
	if( clientName.trim() )
		res.render('chat', { clientName: clientName });
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
	socket.client_id = socket.id//shortid.generate()
	clients[socket.id] = socket
	var CHAT_HISTORY = [];
	socket.on('new client', function(){
		//console.log('Theres a new Client !')
		CHAT_HISTORY.push( { 'client' : socket.client_id } )
		io.emit('new client', socket.client_id );
	});
	socket.on('chat message', function( data ){
		if( data.msg.trim() != '' ){
			//console.log('message: ' + data.msg + ' from: ' + socket.client_id );
			io.emit('chat message client', {msg: data.msg, from: socket.client_id});
			CHAT_HISTORY.push( {'msg':data.msg} );
		}
	});
	socket.on('admin response', function( data ){
		if( data.msg.trim() != '' ){
			clients[data.to].emit('chat message server', data.msg);
		}	
	});
	socket.on('response', function(msg){
		CHAT_HISTORY.push( { 'resp' : msg.msg } )
	});
	socket.on('disconnect', function(){
		console.log( CHAT_HISTORY );
		CHAT_HISTORY = [];
		io.emit('close chat', socket.client_id );
	});
});
http.listen(3000, function(){
	console.log('listening on *:3000');
});
process.on('uncaughtException', function (err) {
	console.log(err);
});






