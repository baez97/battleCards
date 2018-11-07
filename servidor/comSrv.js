function ComSrv() {
    
    this.enviarRemitente = function (socket, mens, datos) {
        socket.emit(mens, datos);
    }
    this.enviarATodos = function (io, nombre, mens, datos) {
        io.sockets.in(nombre).emit(mens, datos);
    }
    this.enviarATodosMenosRemitente = function (socket, nombre, mens, datos) {
        socket.broadcast.to(nombre).emit(mens, datos)
    };
    
    this.lanzarSocketSrv = function (io, juego) {
        var cli = this;
        io.on('connection', function (socket) {
            socket.on('crearPartida', function (usrid, nombrePartida) {
                console.log('nueva partida: ', usrid, nombrePartida);
                var usr = juego.usuarios[usrid];
                var partidaId;
                if (usr) {
                    console.log("usuario " + usrid + " crea partida " + nombrePartida);
                    partidaId = usr.crearPartida(nombrePartida);
                    socket.join(nombrePartida);
                    // io.sockets.in(nombrePartida).emit("partidaCreada", partidaId);
                    cli.enviarATodos(io, nombrePartida, "partidaCreada", partidaId);
                }
            });

            socket.on('obtenerDatosRival', function (usrid) {
                var usr = juego.usuarios[usrid];
                if ( usr ) {
                    console.log(usr);
                    cli.enviarRemitente(socket, "datosRival", usr.obtenerDatosRival());
                }
            });


            socket.on('elegirPartida', function (usrid, nombrePartida) {
                var usr = juego.usuarios[usrid];
                var partidaId;
                if (usr) {
                    partidaId = usr.eligePartida(nombrePartida);
                    if (partidaId < 0) {
                        console.log("usuario " + usrid + " NO se pudo unir a la partida " + nombrePartida);
                        //socket.emit("noUnido", partidaId);
                        cli.enviarRemitente(socket, "noUnido", partidaId);
                    }
                    else {
                        console.log("usuario " + usrid + " se une a la partida " + nombrePartida);
                        socket.join(nombrePartida);
                        //io.sockets.in(nombrePartida).emit("unidoAPartida", partidaId);
                        cli.enviarRemitente(socket, "unidoAPartida", partidaId);
                        cli.enviarATodos(io, nombrePartida, "aJugar", {});
                    }
                }
            });
            socket.on('pasarTurno', function(usrid, nombrePartida) {
                var usr = juego.usuarios[usrid];
                if ( usr ) {
                    usr.pasarTurno();
                    console.log(usr.nombre + " ha pasado el turno");
                    cli.enviarRemitente(socket, "pasaTurno", usr.meToca());
                    cli.enviarATodosMenosRemitente(socket, nombrePartida, "meToca", usr.rivalTeToca());
                }
            });
            
            socket.on('obtenerCartasMano', function(usrid) {
                var usr = juego.usuarios[usrid];
                if ( usr ) {
                    // socket.emit("mano", usr.obtenerCartasMano());
                    json = { mano: usr.obtenerCartasMano(),
                             elixir: usr.elixir};

                    cli.enviarRemitente(socket, "mano", json);
                } 
            });
            
            socket.on('obtenerCartasAtaque', function(usrid) {
                var usr = juego.usuarios[usrid];
                if ( usr ) {
                    cli.enviarRemitente(socket, "cartasAtaque", usr.obtenerCartasAtaque());
                } 
            });

            socket.on('meToca', function(usrid) {
                var usr = juego.usuarios[usrid];
                if ( usr ) {
                    cli.enviarRemitente(socket, "meToca", usr.meToca());
                }
            });

            socket.on('atacar', function(usrid, nombrePartida, idCarta1, idCarta2) {
                var usr = juego.usuarios[usrid];
                if ( usr ) {
                    var json = usr.ataqueConNombre(idCarta1, idCarta2);
                    cli.enviarATodos(io, nombrePartida, "respuestaAtaque", json);
                }
            });

            socket.on('atacarRival', function(usrid, nombrePartida, carta) {
                var usr = juego.usuarios[usrid];
                if ( usr ) {
                    var json = usr.atacarRival(carta);
                    cli.enviarATodos(io, nombrePartida, "respuestaAtaqueRival", json);
                }
            })

            socket.on('jugarCarta', function(usrid, nombrePartida, nombreCarta) { 
                var usr=juego.usuarios[usrid]; 
                var carta;
                if ( usr ){ 
                    carta=usr.obtenerCartaMano(nombreCarta);
                    if (carta.coste==undefined){
                        console.log("usuario "+usrid+" NO pudo jugar esta carta porque no estaba en su mano");
                        // socket.emit("noJugadaNoMano",carta);
                        cli.enviarRemitente(socket, "noJugadaNoMano", carta);
                    } else {
                        usr.jugarCarta(carta);
                        if ( carta.posicion=="ataque" ){
                            console.log("usuario "+usrid+" juega la carta con coste: "+carta.coste+", elixir: " + usr.elixir);
                            // io.sockets.in(nombrePartida).emit("juegaCarta",usr.nombre, usr.elixir,carta);
                            let data = {
                                nombre: usr.nombre,
                                elixir: usr.elixir,
                                carta:  carta
                            };
                            cli.enviarATodos(io, nombrePartida, "juegaCarta", data);
                        } else {
                            console.log("usuario "+usrid+" NO pudo jugar la carta con coste: "+carta.coste);
                            // socket.emit("noJugada",carta);
                            cli.enviarRemitente(socket, "noJugada", carta);
                        }
                    }
                } 
            });
                
        });
    };
}
module.exports.ComSrv = ComSrv;