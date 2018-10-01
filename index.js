var fs=require("fs");
var config=JSON.parse(fs.readFileSync("config.json"));
var host=config.host;
var port=config.port;
var exp=require("express");
var app=exp(); 
var modelo=require("./servidor/modelo.js")

var juego=new modelo.Juego();

app.get("/",function(request,response){
	var json={};
	response.send(json);
});


console.log("Servidor escuchando en "+host+":"+port);
app.listen(port,host);