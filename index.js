var express 		= require('express');
var app 			= express();
var http 			= require('http').Server(app);
var io 				= require('socket.io')(http);
var bodyParser 		= require('body-parser');
var session 		= require('express-session');
var shortid 		= require('shortid');

//var mongoose 	= require('mongoose');
//var process 	= require('process');

app.set('view engine', 'jade');
app.use(express.static('public'));
app.use( session({
		secret: 'dont move',
		resave: true,
	    saveUninitialized: true
	})
);
app.use( bodyParser.urlencoded({ extended: true }) );

var CHAT_HISTORY = [];

//mongoose.connect('mongodb://localhost/CHAT_DB');

app.get('/', function(req, res){
	var sess = req.session;
	res.render('login');
});
app.post('/chat', function(req, res){
	var nombre 	 = req.body.nombre;
	var problema = req.body.problema;
	if( nombre.trim()  != '' && problema.trim()  != '' ){
		var sess = req.session;
		sess.ssid = shortid.generate();
		res.render('chat', { name: nombre, problema: problema, ssid: sess.ssid });
	}
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

io.on('connection', function(socket){
	socket.on('chat message', function( data ){
		if( data.msg.trim() != '' ){
			var message = {};
			//console.log( data.request );
			console.log('message: ' + data.msg);
			if( data.client_id === 1000 )
				io.emit('chat message client', data.msg);
			else
				io.emit('chat message server', data.msg);
			message['client_id'] = data.client_id;
			message['msg'] = data.msg;
			CHAT_HISTORY.push( message );
			//console.log('Client: ' + sess.MYVAR);
		}
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