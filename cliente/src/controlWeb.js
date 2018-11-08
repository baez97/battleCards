function limpiar() {
    // elimina todo lo que sobra (inicializa)
    $('#formInicio').remove();
}

function mostrarFormularioNombre() {
    var cadena = '<div id="formInicio" style="text-align: center">';
    cadena = cadena + '<input id="nombre" type="text" class="form-control" name="nombre" placeholder="Nombre usuario"/>';
    cadena = cadena + '<button type="button" id="inicioBtn" class="btn btn-md" style="background-color: #47260d; color: white">Aceptar</button>';
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
        <div class="contenedor">
            <h2>O bien creala tú mismo</h2>
            <div id="formCrearPartida">
                <input id="nombrePartida" type="text" class="form-control" name="nombrePartida" placeholder="Nombre partida">
                <button type="button" id="crearPartidaBtn" class="btn btn-primary btn-md">Crear Partida</button>
            </div>
        </div>
    `;

    $('#RowCrearPartida').empty();
    $('#RowCrearPartida').append(cadena);

    $('#crearPartidaBtn').on('click', function () {
        var nombre = $('#nombrePartida').val();

        if ( nombre == "") {
            nombre = "Lucha";
        }

        $('#RowCrearPartida').remove();
        com.crearPartida(nombre);
        unirseAPartida(nombre);
    });
}

function mostrarListaPartidas(data) {

    $('#listGroupPartidas').remove();
    var lista = $('#listaPartidas');
    lista.empty();
    

    var cadena = '<div class="contenedor"><h2>Elige una partida<h2><h4>Lista de Partidas</h4><div class="list-group" id="listGroupPartidas">';
    data.forEach( partida => {
        cadena += `<a href="#" class="list-group-item clickablePartida">${partida.nombre}</a>`;
    });
    cadena += '</div></div>';
    lista.append(cadena);
    $('.clickablePartida').on('click', function () {
        let nombre = $(this).text();
        unirseAPartida(nombre);
    });
}

function unirseAPartida(nombre) {
    mostrarPreloader();
    let cadena = `Conectado a ${nombre}, esperando a otro jugador...`;
    $('#Descripcion').remove();
    $('#TituloPartida').text(cadena);
}

function mostrarDescripcion() {
    var cadena = `<h1>Battle Cards</h1>`;
    $("#Descripcion").append(cadena);
}

function mostrarPreloader() {
    $('#spinner').empty();
    $('#spinner').removeClass('spinner');

    $('#spinner').addClass('spinner');
    $('#spinner').append(` 
        <div class="dot1"></div>
        <div class="dot2"></div>
    `);

}