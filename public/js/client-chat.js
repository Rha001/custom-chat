$(document).ready(function(){
	var socket = io();
	socket.emit('new client');
	$('form').submit(function(){
		socket.emit('chat message', { msg: $('#m').val() });
		$('#m').val('');
		return false;
	});
	socket.on('chat message client', function(data){
		$('#messages').append($('<li class="client">').text(data.msg));
	});
	socket.on('chat message server', function(msg){
		$('#messages').append($('<li class="server">').text(msg));
		socket.emit('response', { msg });
	});
})
