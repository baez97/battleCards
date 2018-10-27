function ClienteRest() {
    this.obtenerPartidas = function () {
        $.getJSON("/obtenerPartidas", function (data) {
            console.log(data);
        });
    }
    this.agregarUsuario = function (nombre) {
        $.ajax({
            type: 'GET',
            url: '/agregarUsuario/' + nombre,
            success: function (data) {
                console.log("Usuario agregado con id: " + data.usr)
            },
            contentType: 'application/json',
            dataType: 'json'
        });
    }
}