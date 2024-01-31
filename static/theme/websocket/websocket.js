

window.App = Object.assign(window.App || {}, {
    socket : {
        client : null,
        connect() {
            var socket = new SockJS('/ws');
            this.client = window.Stomp.over(socket);
        },
        subscribe(path, callback){
            var socObj = this;
            this.client.connect({}, function (frame) {
                socObj.client.subscribe(path, function (response) {
                    callback(response);
                },{'auto_delete' : true, durable : false, exclusive : false});
            });
        }
    }
});

window.App.socket.connect();