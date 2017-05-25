
var apiKey = 'AIzaSyBs10W58nWXHEjjHUDonElqqbDohnAKwZg';

//token github: 09845c7fb36a2c1487d339a5bb6a19d9a703ccdd

/////////////PESTAÑA PRINCIPAL///////////
function inicializo_mapa(){

	map = L.map('map').setView([40.4175, -3.708], 11);
	// Añado a map la capa de teselas extraida de OpenStreetMap
	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',maxZoom: 18}).addTo(map);
	L.control.scale().addTo(map);

}

function informacion_reducida (aparcamiento_actual){
	if (aparcamiento_actual != null){
		var nombre_completo = aparcamiento_actual.title;
		var aparca = nombre_completo.split(".");
		var nombre = aparca[1];
		var tipo_apar = aparca[0];
		var calle = aparcamiento_actual.address['street-address'];
		var cod_postal = aparcamiento_actual.address['postal-code'];
		var localidad = aparcamiento_actual.address['locality'];
		var info = '<br>' + '<h4 style="color:#088A29">' + nombre + '</h4>'
	                      + '<div class="col-md-7">'
	                      + tipo_apar + '<br>'
	                      + calle + '<br>'
				          + cod_postal + '<br>'
				          + localidad
	                      + '</div>'
    }else{
		var info = '<p>El aparcamiento seleccionado no existe</p>'
	}
	return info;
}

function informacion_completa (aparcamiento_actual){
	if (aparcamiento_actual != null){
		var nombre_completo = aparcamiento_actual.title;
		var aparca = nombre_completo.split(".");
		var nombre = aparca[1];
		var tipo_apar = aparca[0];
		var calle = aparcamiento_actual.address['street-address'];
		var cod_postal = aparcamiento_actual.address['postal-code'];
		var localidad = aparcamiento_actual.address['locality'];
		var descripcion = aparcamiento_actual.organization['organization-desc'];
		var info = '<br>' + '<h4 style="color:#088A29">' + nombre + '</h4>'
                      + '<div class="col-md-7">'
                      + tipo_apar + '<br>'
                      + calle + '<br>'
			          + cod_postal + '<br>'
			          + localidad + '<br>'
			          + descripcion
                      + '</div>'
	}else{
		var info = '<p>El aparcamiento seleccionado no existe</p>'
	}
	
	return info;
}

function mostrar_popup(aparcamiento_actual){

	var location = [aparcamiento_actual.location.latitude, aparcamiento_actual.location.longitude];
	var url = aparcamiento_actual['@id'];
	L.marker([location[0], location[1]]).addTo(map)
		 .bindPopup('<a href="' + url + '">' + aparcamiento_actual.title + '</a><br/>')
		 .openPopup();
	map.setView([location[0], location[1]], 15);

}

function comprobar_json(aparcamiento_actual){
	var vacio;
	if (aparcamiento_actual.title == null){
		vacio = "";
	}
	if (aparcamiento_actual.address['street-address'] == null){
		vacio = "";
	}
	if (aparcamiento_actual.address['postal-code'] == null){
		vacio = "";
	}
	if (aparcamiento_actual.address['locality'] == null){
		vacio = "";
	}
	if (aparcamiento_actual.organization['organization-desc'] == null){
		vacio = "";
	}

	return '<p>'+ vacio +'</p>'
}

function indicadores_carrusel(fotos){
	var carousel_fotos = '<ol class="carousel-indicators">';
    for (var i=0; i<fotos.length; i++) {
        carousel_fotos = carousel_fotos + '<li data-target=".carousel" data-slide-to="' + i.toString() + '"';
        if (i == 0) {
            carousel_fotos = carousel_fotos + ' class="active"';
        }
        carousel_fotos = carousel_fotos + '></li>';
    }
    return carousel_fotos + '</ol>';
}

function controles_carrusel(){
	return ('<a class="left carousel-control" href=".carousel" role="button" data-slide="prev"> \
        <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span> \
        <span class="sr-only">Previous</span> \
    </a> \
    <a class="right carousel-control" href=".carousel" role="button" data-slide="next"> \
        <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span> \
        <span class="sr-only">Next</span> \
    </a>');
}

function fotos_carrusel(fotos){
	var carousel_fotos = '<div class="carousel-inner" role="listbox">';
	for(i=0; i<fotos.length; i++){
		carousel_fotos = carousel_fotos + '<div class="item';
        if (i == 0) {
            carousel_fotos = carousel_fotos + ' active';
        }
        carousel_fotos = carousel_fotos + '">'
              + '<img class="img-responsive center-block" src="' + fotos[i] 
              + '" alt="' + i.toString() + '">' + '</div>';
	}
	return  carousel_fotos + "</div>";
}

//crear carousel
function crearCarousel(fotos){
	var carousel = "<div id='carousel-example-generic' class='carousel slide' data-ride='carousel'>";
	carousel = carousel + '<div class="carousel" class="carousel slide" data-ride="carousel"' 
                  + 'data-interval="5000">' + indicadores_carrusel(fotos) + fotos_carrusel(fotos) 
	               + controles_carrusel() + '</div>';
  	$("#fotos").html(carousel);
}

function mostrar_fotos(aparcamiento_actual){
	var lati = aparcamiento_actual.location.latitude;
	var longi = aparcamiento_actual.location.longitude;
	
	$.ajax({
		dataType: "jsonp",
	    jsonp : "callback",
	    url : "https://commons.wikimedia.org/w/api.php?format=json&action=query&generator=geosearch&ggsprimary=all&ggsnamespace=6&ggsradius=500&ggscoord="+lati +"|"+longi + "&ggslimit=10&prop=imageinfo&iilimit=1&iiprop=url&iiurlwidth=200&iiurlheight=200&callback=?",


	    success: function(response) {
	       	var x;
	       	var fotos =  [];
	        var contador = 1;
	    	for (x in response.query.pages){
	    		if (response.query.pages[x].imageinfo[0].url != null){
	    			fotos.push(response.query.pages[x].imageinfo[0].url);
	    		}else{
	    			break;
	    		}
	    		contador = contador +1;
	    		if (contador == 4){
	    			break;
	    		}
          	}
   			crearCarousel(fotos);
        }
   	});
}
function handleClientLoad(userid) {
	var usersNorep = [];

	if (usersNorep == 0){
		usersNorep.push(userid);
	}else{
		for(var i=0; i<usersNorep.length; i++){
			if (usersNorep[i] != userid){
				usersNorep.push(userid);
			}
		}
	}
    gapi.client.setApiKey(apiKey);
    makeApiCall(userid);
}
function makeApiCall(userid) {
    gapi.client.load('plus', 'v1', function() {
	      var request = gapi.client.plus.people.get({
	        'userId': userid,
	    });
	    request.execute(function(resp) {
	        var nombre = resp["displayName"];
	        var content = '<li class="list-group-item draggable" data-id='+ userid +'>'+ nombre +'</li>';
	    	$(".usu_lista").append(content);
	    	$(function(){
	        	$("li.list-group-item.draggable").draggable({
	        		helper: "clone",
	        		revert: true,
	        		appendTo: "body",

	        	});
	        });
	    });
	});
}
$(document).ready(function() {

	var colecciones = [];
	var tot_aparca = [];
	var index_tab = 0;
	var btn_addColeccion = $("#añadir_coleccion");
	var input_coleccion = $("#coleccion");

	inicializo_mapa();
	var btn_cargar = $("#btn_cargar_aparcamientos"); 
	var ul_aparcamientos = $(".ul_aparcamientos");
	var contador_aparcamientos = $(".contador_aparcamientos");

	var index_tab;
	$('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
		var tab = $(e.target).attr("href");
		switch(tab){
			case "#principal":
				index_tab = 1;
				break;
			case "#colecciones":
				index_tab = 2;
				break;
			case "#aparcamientos":
				index_tab = 3;
				break;
			default: 
				index_tab = 0;
				break;
		}
	});
	$('#boton-guardar').click(function (e) {
      $("#modalGuardar").modal()
      e.preventDefault();
    });

    $('#boton-cargar').click(function (e) {
      $("#modalCargar").modal()
      e.preventDefault();
    });

	$("#btn_cargar_usuarios").click(function(){
		var userid = [];
		try{
			var host = "ws://127.0.0.1:80";
			var s = new WebSocket(host);
			s.onopen = function(e){
				console.log("conexion del socket abierta");
			};
			s.onmessage = function(e){
				if (userid.length == 0){
					userid.push(e.data);
				}else{
					var encontrado = false;
					for(var i=0; i<userid.length; i++){
						if(userid[i] == e.data){
							encontrado = true;
						}
					}
					if (!encontrado){
						userid.push(e.data);
						handleClientLoad(e.data);
					}
				}
			}
			s.onclose = function(e){
				console.log("socket close: ", e);
			};
			s.onerror = function(e){
				console.log("socket error: ", e);
			}
		}catch(ex){
			console.log("Socket exception: ", ex);
		}

	});

	btn_cargar.click(function(){
		$.getJSON( "./data/aparcamientos.json", function( data ) {
  			ul_aparcamientos.empty();
  			contador_aparcamientos.empty();
  			for (var i=0; i<data['@graph'].length; i++){
				var nombre_completo = data['@graph'][i].title
				var nombre_apar = nombre_completo.split(".");
				ul_aparcamientos.append('<li class="list-group-item draggable"><a id="cargar_aparcamiento_'+i+'">'+nombre_apar[1]+'</a></li>');
				nueva_usu = {id: i, users:[]};
				tot_aparca.push(nueva_usu);
				$("#cargar_aparcamiento_"+i).bind('click', function(){
					var pos = parseInt($(this).attr('id').split('_')[2]);
					if ( (index_tab == 1) || (index_tab == 0) ){
						var aparcamiento_actual = false;
						if(pos >= 0 && pos < data['@graph'].length){ 
							aparcamiento_actual = data['@graph'][pos]; 
							mostrar_popup(aparcamiento_actual, nombre_apar);
							$('.info-aparcamiento').html(informacion_reducida(aparcamiento_actual));
							$('.desc-aparcamiento').html(informacion_completa(aparcamiento_actual));
							$('.carousel-inner').html(mostrar_fotos(aparcamiento_actual));
							$('#id_pos_aparca').html(pos);
						}
					}
				});

				$(function(){
					$(".desc-aparcamiento").droppable({
						activeClass: "ui-state-default",
						hoverClass: "ui-state-hover",
						accept: ":not(.ui-sortable-helper)",
	  					drop: function( event, ui ) {
	  						pos = parseInt($('#id_pos_aparca').html());
	  					   	tot_aparca[pos].users.push(ui.draggable.text());
	        				$(".usuariosGoogle").append('<a href="#" class="list-group-item">' + ui.draggable.text() + '</a>');
	    				}
	    			});
					$("#cargar_aparcamiento_"+i).bind('click', function(){
						var pos = parseInt($(this).attr('id').split('_')[2]);
						$(".usuariosGoogle").html("");
						for(var i=0;i<tot_aparca[pos].users.length;i++){
							$(".usuariosGoogle").append('<a href="#" class="list-group-item">' + tot_aparca[pos].users[i] + '</a>');
						}
			        });
				});
			}
  			contador_aparcamientos.append('<p style="color:#FE2E64; text-align:left;">Se han encontrado ' + data['@graph'].length + ' aparcamientos disponibles</p>');

			btn_addColeccion.click(function(){
				var encontrado = false;
				for (var i = 0; i < colecciones.length; i++) {
					if(colecciones[i].nombre == input_coleccion.val()){
						encontrado = true; 
					}
				}
				if (encontrado){
					alert("Ese nombre ya existe. Intente con otro.")
				}else{
					nueva = {nombre: input_coleccion.val(), aparcamientos:[]};
					colecciones.push(nueva);
				}
				$("#coleccion").val("");
				contenedor = "";
				if(colecciones.length > 0){
					contenedor = '<div class="list-group">';
					contenedor = contenedor + '</br> <p>Selecciona una colección haciendo click en ella</p> <ul class="tot_colecciones">';
	    			for (var i = 0; i < colecciones.length; i++) {
	      				contenedor += '<li style="color:#088A4B" class="list-group-item" num='+ i +'>' + colecciones[i].nombre + '</li>';
	    			}
	    			contenedor += '</ul></div>';
				}else{
					contenedor = contenedor + "<p>No existen colecciones.</p>";
				}

				$('#coleccion-aparcamientos').html(contenedor);

				if (colecciones != null) {
					$('.tot_colecciones li').hover(function() {
            			$(this).css({'cursor': 'pointer', 'background': '#E8E8E8'});
        			}, function() {
            			$(this).css('background', 'white');
        			});

			        $('.tot_colecciones li').click(function(){
			       		$(".ul_aparcamientos a").draggable({revert: true, helper: "clone", opacity: 0.35, revertDuration: 100});
			       		$("#todos_aparca").droppable({ width: 150, height: 150, padding: 0.5, float: "left", margin: 10});
			       		id=$(this).attr('num');
			       		$("#todos_aparca").droppable({
  							drop: function( event, ui ) {
   								//aparca = {aparcaid: ui.draggable.attr('id').split('_')[2], aparcanombre: ui.draggable.text()};   								
   								colecciones[id].aparcamientos.push(ui.draggable.text());
        						$("#todos_aparca").append('<a href="#" class="list-group-item">' + ui.draggable.text() + '</a>');
    						}
    					});
			       		$("#todos_aparca").html('<p style="background-color: #d8da3d">Arrastre hasta aquí los aparcamientos para añadirlos a la lista: ' + $(this).text() + '</p>');
			       		if (colecciones[$(this).attr('num')].aparcamientos.length > 0){
			       			$("#todos_aparca").append('<li style="color:#088A4B" class="list-group-item">' +colecciones[$(this).attr('num')].aparcamientos + '</li>');

			       		}
			       		$("#colecc_principal").html('<p style="background-color: #d8da3d">Coleccion selecionada: ' + $(this).text() + '</p>' + '<li class="list-group-item" style="color:#088A4B">' + colecciones[$(this).attr('num')].aparcamientos + '</li>');
    				});
				}
			});
	
    	});
	});
//////////////GITHUB//////////////
	$("#guardarForm").submit(function(e) {
		token = $("#tokenGithubDestino").val();
		repositorio = $("#repositorioDestino").val();
		ficheroColeccion = $("#nombreFicheroDestino").val();
		var github = new Github({token:token,auth:"oauth"});
		contenidoColeccion = JSON.stringify(colecciones);
		gitRepositorio = github.getRepo("storresb", repositorio);
		gitRepositorio.write("master", ficheroColeccion, contenidoColeccion, "file", function(err){});
		alert("Guardado con éxito");
		$("#modalGuardar").modal('toggle');
		e.preventDefault();
	});
//c721de6930612debcdd195d595c0f4d2dd8f72eb
	$("#cargarForm").submit(function(e) {
		var rep = 'ATprueba2';
		var fichero =  $("#nombreFicheroOrigen").val();
    	var github = new Github({token:"c721de6930612debcdd195d595c0f4d2dd8f72eb",auth:"oauth"});
		repositorio = github.getRepo("storresb", rep);
		repositorio.show(function (error, repo) {
			if (error) {
				alert(error);
	        } else {
				repositorio.read('master', fichero, function(err, data) {
					colecciones = JSON.parse(data);
					datos = '<ul>' + colecciones[0].nombre + colecciones[0].aparcamientos + '</ul>';
					$("#colecc_principal").html(datos)
					alert("Cargado con éxito");
	            });
	        } 
			$("#modalCargar").modal('toggle');                
		   	e.preventDefault(); 
  		});
  	});
});