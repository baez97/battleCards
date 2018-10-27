function ComSrv() {
    this.lanzarSocketSrv = function (io, juego) {
        io.on('connection', function (socket) {
            socket.on('crearPartida', function (usrid, nombrePartida) {
                console.log('nueva partida: ', usrid, nombrePartida);
                var usr = juego.usuarios[usrid];
                var partidaId;
                if (usr) {
                    console.log("usuario " + usrid + " crea partida " + nombrePartida);
                    partidaId = usr.crearPartida(nombrePartida);
                    socket.join(nombrePartida);
                    io.sockets.in(nombrePartida).emit("partidaCreada", partidaId);
                }
            });
            socket.on('elegirPartida', function (usrid, nombrePartida) {
                var usr = juego.usuarios[usrid];
                var partidaId;
                if (usr) {
                    partidaId = usr.eligePartida(nombrePartida);
                    if (partidaId < 0) {
                        console.log("usuario " + usrid + " NO se pudo unir a la partida " + nombrePartida);
                        socket.emit("noUnido", partidaId);
                    }
                    else {
                        console.log("usuario " + usrid + " se une a la partida " + nombrePartida);
                        socket.join(nombrePartida);
                        io.sockets.in(nombrePartida).emit("unidoAPartida", partidaId);
                    }
                }
            });
            socket.on('pasarTurno', function(usrid, nombrePartida) {
                var usr = juego.usuarios[usrid];
                if (usr) {
                    usr.pasarTurno();
                    console.log(usr.nombre + " ha pasado el turno");
                    io.sockets.in(nombrePartida).emit("pasaTurno", usrid);
                } else {
                    console.log("usuario " + usrid + "NO puede pasar turno porque no existe");
                    socket.emit("noExiste", usrid);
                }
            })
        });
    };
}
module.exports.ComSrv = ComSrv;