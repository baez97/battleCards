function limpiar() {
    // elimina todo lo que sobra (inicializa)
    $('#formInicio').remove();
}

function mostrarFormularioNombre() {
    var cadena = '<div id="formInicio">';
    cadena = cadena + '<input id="nombre" type="text" class="form-control" name="nombre" placeholder="Nombre usuario">';
    cadena = cadena + '<button type="button" id="inicioBtn" class="btn btn-primary btn-md">Iniciar Usuario</button>';
    cadena = cadena + '</div>';
    $('#inicio').append(cadena);
    $('#inicioBtn').on('click', function () {
        var nombre = $('#nombre').val();

        if ( nombre == "") {
            nombre = "Loli";
        }

        $('#formInicio').remove();
        rest.agregarUsuario(nombre);
    });
}

function mostrarCrearPartida() {
    var cadena = `
        <div id="formCrearPartida">
            <input id="nombrePartida" type="text" class="form-control" name="nombrePartida" placeholder="Nombre partida">
            <button type="button" id="crearPartidaBtn" class="btn btn-primary btn-md">Crear Partida</button>
        </div>
    `;

    $('#inicio').append(cadena);
    $('#crearPartidaBtn').on('click', function () {
        var nombre = $('#nombrePartida').val();

        if ( nombre == "") {
            nombre = "Lucha";
        }

        $('#formCrearPartida').remove();
        com.crearPartida(nombre);
    });
}

function mostrarListaPartidas(data) {

    $('#listGroupPartidas').remove();
    var lista = $('#listaPartidas');

    var cadena = '<div class="list-group" id="listGroupPartidas">';
    data.forEach( partida => {
        cadena += `<a href="#" class="list-group-item">${partida.nombre}</a>`;
    })
    cadena += '</div>';
    lista.append(cadena);
}
