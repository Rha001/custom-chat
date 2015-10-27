$(document).ready(function(){
	var socket = io();
	socket.emit('new room');
	$('form').submit(function(){
		socket.emit('chat response', { msg: $('#m').val() });
		$('#m').val('');
		return false;
	});
	socket.on('chat message client', function(msg){
		$('#messages').append($('<li class="client">').text(msg));
	});
	socket.on('new client', function(id){
		//$('#messages').append($('<li class="client">').text(msg));
		console.log('open a chat')
		$('.container').append('<div class="chat"><ul class="msg-' + id + '"></ul><form>\
								<input type="text" class="' + id + '"/><button class="' + id + '-btn">Send</button></form></div>');
	});
	/*ul#messages
            li.client Hello #{name}!, sessID: #{ssid} how can I help you
        form
            input#m(type='text',autocomplete='off')
            button send*/
	socket.on('chat message server', function(msg){
		$('#messages').append($('<li class="server">').text(msg));
	});
})