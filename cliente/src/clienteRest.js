function ClienteRest() {
    var cli = this;
    this.obtenerPartidas = function () {
        $.getJSON("/obtenerPartidas", function (data) {
            console.log(data);
            mostrarListaPartidas(data);
        });
    }
    this.agregarUsuario = function (nombre) {
        $.ajax({
            type: 'GET',
            url: '/agregarUsuario/' + nombre,
            success: function (data) {
                console.log("Usuario agregado con id: " + data.usr)
                com.ini(data.usr);
                mostrarCrearPartida();
            },
            contentType: 'application/json',
            dataType: 'json'
        });
    }
}