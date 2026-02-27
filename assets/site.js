var currentAnchor 	= null;
var menu			= true;
var submenu			= false;
var bgMostrado		= 'bg1';
var coleccionTam	= [384,190,340,340];

Ext.onReady(function()
{
	
	//checkAnchor();
	//window.onhashchange = checkAnchor;
	
	
});

function ajaxRequest(div,url)
{
	Ext.Ajax.request({
        url: url,
        method: 'post',
        success: function(response, opts) 
        {
			Ext.get(div).update(response.responseText);
			AJAX_ParseRequestScript(response.responseText);
         },
         failure: function(response, opts) 
         {
            console.log('server-side failure with status code ' + response.status);
         }
    });
    
}

function AJAX_ParseRequestScript(response)
		{
			var source 	= response;
			var scripts = new Array();
	 
			// Separación del contenido de las etiquetas 'script'
			while(source.indexOf("<script") > -1 || source.indexOf("</script") > -1) 
			{
				var s 	= source.indexOf("<script");
				var s_e = source.indexOf(">", s);
				var e 	= source.indexOf("</script", s);
				var e_e = source.indexOf(">", e);
	 
				// Se agregan las etiquetas al arreglo de datos
				scripts.push(source.substring(s_e+1, e));
				// Se separan de la respuesta asíncrona
				source 	= source.substring(0, s) + source.substring(e_e+1);
			}
	 
			// 	Iteración de cada script obtenido para ejecutarlo
			for(var i = 0; i < scripts.length; i++) 
			{
				try {
					if (window.execScript)
					{        	
	        			window.execScript(scripts[i])
	        		}
	        		else
	        		{
						eval(scripts[i]);
					}
				}
				catch(ex) {
					// error
				}
			}
			// Se devuelve el código ya limpio del script
			return source;
		} // END AJAX_ParseRequestScript

function checkAnchor()
{
	//Check if it has changes
	if(currentAnchor != document.location.hash){
		currentAnchor = document.location.hash;
		
		
		if(!currentAnchor)
			query = "section=idioma";
		else
		{	
			var splits = currentAnchor.substring(1).split('&');			
			var section = splits[0];
			delete splits[0];
			
			
			var params = splits.join('&');
			var query = "section=" + section + params;
			
		}
		
		if(section!= undefined || section == 'idioma')
		{
			var task = new Ext.util.DelayedTask(function(){
		    	show('ft');
				show('logo');
				show('transicion');
				var bd = Ext.getBody();
				bd.setStyle('background','url("Themes/default/images/patron.png")');
				
				var doc  = Ext.get('doc');
				doc.setStyle('width','1280px');
				doc.setStyle('margin-left','-640px');
			});
			task.delay(500); 
		}
		
		switch(section)
		{
			case 'empresa':
				ajaxRequest("container",'assets/scripts/ajax.php?section=home');
				var task = new Ext.util.DelayedTask(function(){
			    	showSubmenu('submenu1');
				});
				task.delay(500); 
				Ext.get('logo').update('<a href="#home"><img src="Themes/default/images/blizzage.png"></a>');
			break;
			
			case 'campaña':
				ajaxRequest("container",'assets/scripts/ajax.php?section=home');
				var task = new Ext.util.DelayedTask(function(){
			    	showSubmenu('submenu2');
				});
				task.delay(500); 
				Ext.get('logo').update('<a href="#home"><img src="Themes/default/images/blizzage.png"></a>');
			break;
			
			case 'historia':
				Ext.get('logo').update('<a href="#home"><img src="Themes/default/images/logoNegro.png"></a>');
				ajaxRequest("container",'assets/scripts/ajax.php?'+query);
			break;
			
			default:
				Ext.get('logo').update('<a href="#home"><img src="Themes/default/images/blizzage.png"></a>');
				ajaxRequest("container",'assets/scripts/ajax.php?'+query);
			break;
		}
		
	}
}

function closeColeccionInfo(galeria,foto)
{
	var el = Ext.get('galeriaBoton'+foto);
	el.animate
		(
		    {
		    	width  : {to: 18,from: 308},
		    },
		    0.8
		);
	el.update('<a href="javascript:showColeccionInfo(\''+galeria +'\','+foto+');"><img src="Themes/default/images/btnMas.png" ></a>');
}

function coleccionMouseOver(hotspot)
{
	var col1	= Ext.get(hotspot);
	var tam1	= col1.getWidth(); 
	
	console.log(tam1);
	
	col1.animate
	(
	    {
	    	top  : {to: -35,			 from: 0},
	    	width: {to: tam1+(tam1 * 0.3), from:tam1}
	    },
	    0.5
	);	
	console.log(tam1+(tam1 * 0.3));
}

function coleccionMouseOut(hotspot)
{
	var col1	= Ext.get(hotspot);
	var tam1	= col1.getWidth() ; 
	
	col1.animate
	(
	    {
	    	top  : {to: 0	, from: -35},
	    	width: {to: coleccionTam[hotspot.substring(6)]	, from:tam1}
	    },
	    0.5
	);
}

function coleccion()
{
	var col		= Ext.get('coleccion');
	col.on({	   
	    'mousemove' : this.enMov,
	    scope: this
	});
	
}
	
function enMov(e,t)
{
	var bd		= Ext.getBody();
	var wd		= bd.getWidth();
	var col		= Ext.get('coleccion');
	var posX	= col.getX();
	var offset	= ( wd - 1024 )/ 2;
	
	if(wd <= 1024)
		offset=0;
	
	//console.log(wd+' '+offset+' '+e.getPageX()+' '+posX);
	
	if( e.getPageX() < (619+offset))
	{
		if( e.getPageX()  < (418+offset) )
		{
			//console.log('pos1');
		col.setX(( 215 + offset),true);
	}
	else
	{
		//console.log('pos2');
			col.setX(( 50 + offset),true);
		}
	}
	
	if(e.getPageX() > ( 620 +offset))
	{
		if(e.getPageX() < (823 +offset))
		{
			//console.log('pos3');
		col.setX((offset -150 ),true);
	}
	else
	{
		//console.log('pos4');
			col.setX( (offset-330),true);
		}
	}
	
	//console.log(' ');
	
	/*
	  
	 if(e.getPageX() > 760 + offset )
	{	
		if(e.getPageX() > 850 + offset)
		{
			//if(Ext.isChrome){
			 
				col.setX(-300 + offset,true);
			
		}
		else
			col.setX(-100 + offset,true);
	}
	
	if(e.getPageX() < 740 + offset)
	{	
		if(e.getPageX() < 600 + offset )
		{
			col.setX(300+ offset,true);
		}
		else	
			col.setX(100,true);
	}*/
}
	
function hideMenu()
{
	var el = Ext.get('menu');
	
	if(menu)
	{
		var toX=1280;
		
		if(submenu)
			toX	= 1400;
			
		el.animate
		(
		    {
		    	left  : {to: toX ,from: 880},
		    },
		    0.8
		);
		var task = new Ext.util.DelayedTask(function(){
	    	Ext.get('menuLink').setStyle('background-position','0 -88px');
		});
		task.delay(800); 
		menu=false;
		
		Ext.get('menuLink').hover(function(e, t) 
		{	
			Ext.get('menuLink').setStyle('background-position','0 -132px');
		},
		function(e, t) 
		{	
			Ext.get('menuLink').setStyle('background-position','0 -88px');
		});
		
		
	}
	else
	{
		el.animate
		(
		    {
		    	left  : {to: 880,from: toX},
		    },
		    0.8
		);
		var task = new Ext.util.DelayedTask(function(){
	    	Ext.get('menuLink').setStyle('background-position','0 0');
		});
		task.delay(800); 
		menu=true;
		Ext.get('menuLink').hover(function(e, t) 
		{	
			Ext.get('menuLink').setStyle('background-position','0 -44px');
		},
		function(e, t) 
		{	
			Ext.get('menuLink').setStyle('background-position','0 -0px');
		});
	}
}

function show(div)
{
	if(!Ext.get(div).isVisible())
	{
		Ext.get(div).fadeIn({
		    endOpacity: 1, 
		    easing: 	'easeOut',
		    duration: 	.5,
		    remove: 	false,
		    useDisplay: true
		});	
	}
}

function showSection(hash)
{
	var trans = Ext.get('transicion');
	trans.animate
		(
		    {
		    	height  : {to: 740 , from: 10},
		    },
		    0.5
		);
	
	var task = new Ext.util.DelayedTask(function(){
    	window.location.hash=hash;
	});
	task.delay(500); 
	
	var task = new Ext.util.DelayedTask(function(){
    	trans.animate
		(
		    {
		    	height  : {to: 10 , from: 740},
		    },
		    0.5
		);
	});
	task.delay(800); 
}

function showColeccion(galeria)
{
	location.hash = "#"+galeria;
}

function showColeccionInfo(galeria,foto)
{
	var bd		= Ext.getBody();
	var wd 		= bd.getWidth();
	var offset	= (wd - 1024) / 2 ;
	
	var el = Ext.get('galeriaBoton'+foto);
	//console.log(el.getX()+' '+offset);
	if(el.getX() > (700 + offset))
	{	
		var galCont = Ext.get('galeriaContainer');
		galCont.animate
			(
			    {
			    	left  : {by: -390 , units: 'px'},
			    },
			    0.5
			);
	}
	
	el.animate
		(
		    {
		    	width  : {to: 308,from: 18},
		    },
		    0.5
		);
	var task = new Ext.util.DelayedTask(function(){
    	ajaxRequest("galeriaBoton"+foto,'assets/scripts/ajax.php?section=coleccionInfo&galeria='+galeria+'&foto='+foto);
	});
	task.delay(500); 
	
}

function showColeccionAnt(galeria,foto)
{
	var bd		= Ext.getBody();
	var wd 		= bd.getWidth();
	var offset	= (wd - 1024) / 2 ;
	var el 		= Ext.get('galeriaContainer');
	
	
	//console.log(el.getX() + offset);
	if(el.getX() < (200 + offset))
	{	
		var galCont = Ext.get('galeriaContainer');
		galCont.animate
			(
			    {
			    	left  : {by: 390 , units: 'px'},
			    },
			    0.5
			);
	}
}

function showColeccionSig(galeria,foto)
{
	var el = Ext.get('galeriaContainer');
	el.animate
		(
		    {
		    	left  : {by: -390 , units: 'px'},
		    },
		    0.5
		);
}

function closeSubMenu()
{
	Ext.get('submenu1').setHeight(0);
	Ext.get('submenu2').setHeight(0);
	
	//Ext.get('link2').setStyle('color','#FFFFFF');
	//Ext.get('link3').setStyle('color','#FFFFFF');
}

function showSubmenu(div)
{
	closeSubMenu();
	
	submenu 	= true;
	var subMenu = Ext.get(div);
	
	switch(div)
	{
		case 'submenu1':
			subMenu.animate
			(
			    {
			    	height  : {to:50 ,  from:0},
			    },
			    0.5
			);
			
			var menuBG = Ext.get('menuBG');
			menuBG.animate
				(
				    {
				    	height  : {to:  305, from: 255},
				    	left	: {to: -50, from: 0}
				    },
				    0.5
				);	
			//Ext.get('link2').setStyle('color','#c0b296');
			
			var bdBg1 = Ext.get('bdBg1');
			var bdBg2 = Ext.get('bdBg2');
			
			bdBg2.setStyle('background','url(Themes/default/images/bg2.jpg) no-repeat');
			//bdBg2.setX(87);
			
			bdBg1.animate
				(
				    {
				    	left	: {to: -1280, from: 0}
				    },
				    0.5
				);	
			bgMostrado = 	'bg2';
			var task = new Ext.util.DelayedTask(function(){
		    	bdBg1.setStyle('background','url(Themes/default/images/bg2.jpg) no-repeat');
			});
			task.delay(500); 
		break;
		
		case 'submenu2':
			subMenu.animate
			(
			    {
			    	height  : {to:50 ,  from:0},
			    },
			    0.5
			);
			
			var menuBG = Ext.get('menuBG');
			menuBG.animate
				(
				    {
				    	height  : {to:  305, from: 255},
				    	left	: {to: -130, from: 0}
				    },
				    0.5
				);	
			//Ext.get('link3').setStyle('color','#c0b296');
			
			var bdBg1 = Ext.get('bdBg1');
			var bdBg2 = Ext.get('bdBg2');
			
				
			bdBg2.setStyle('background','url(Themes/default/images/bg3.jpg) no-repeat');
			//bdBg2.setX(87);
			
			bdBg1.animate
				(
				    {
				    	left	: {to: -1280, from: 0}
				    },
				    0.5
				);
				
			var task = new Ext.util.DelayedTask(function(){
		    	bdBg1.setStyle('background','url(Themes/default/images/bg3.jpg) no-repeat');
			});
			task.delay(500); 
			
		break;
	}
	
	
}

function showSubseccion(subseccion)
{
	var trans = Ext.get('transicion');
	trans.animate
		(
		    {
		    	height  : {to: 740 , from: 10},
		    },
		    0.5
		);
	
	var task = new Ext.util.DelayedTask(function(){
    	window.location.hash='#'+subseccion;
	});
	task.delay(500); 
	
	var task = new Ext.util.DelayedTask(function(){
    	Ext.get('logo').update('<a href="#home"><img src="Themes/default/images/logoNegro.png"></a>');
    	trans.animate
		(
		    {
		    	height  : {to: 10 , from: 740},
		    },
		    0.5
		);
	});
	task.delay(800); 
	
}