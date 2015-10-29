$(document).ready(function(){
	var socket = io();
	socket.emit('new room');
	$(document).on('submit','form',function(ev){
		var dataId = $(this).attr('id');
		var msg = $(this).children('input').val();
		socket.emit('admin response', { msg: msg, to: dataId });
		$(this).siblings('ul').append('<li>' + msg + '</li>');
		$(this).children('input').val('');
		return false;
	});
	socket.on('chat message client', function(data){
		$('#'+data.from).siblings('ul').append('<li>' + data.msg + '</li>');
	});
	socket.on('new client', function(id){
		$('.container').append('<div class="chat"><ul></ul><form id="' + id + '">\
								<input type="text"/><button>Send</button></form></div>');
	});
	socket.on('close chat', function(id){
		$('#' + id).parent('.chat').remove()
	})
	socket.on('chat message server', function(msg){
		$('#messages').append($('<li class="server">').text(msg));
	});
})