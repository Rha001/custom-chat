var socket = io();
$('form').submit(function(){
    socket.emit('chat message', { client_id: 2000, msg: $('#m').val() });
    $('#m').val('');
    return false;
});
socket.on('chat message client', function(msg){
    $('#messages').append($('<li class="client">').text(msg));
});
socket.on('chat message server', function(msg){
    $('#messages').append($('<li class="server">').text(msg));
});