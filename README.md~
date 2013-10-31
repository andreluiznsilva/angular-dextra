angular-dextra
==============

Configuration
-------------

Para cada módulo desejado: 

Fazer os imports no HTML;

    <script type="text/javascript" charset="utf-8" src="js/lib/dextra/dextra.http.js"></script>
    <script type="text/javascript" charset="utf-8" src="js/lib/dextra/dextra.upload.js"></script>
    <script type="text/javascript" charset="utf-8" src="js/lib/dextra/dextra.i18n.js"></script>
    <script type="text/javascript" charset="utf-8" src="js/lib/dextra/dextra.input.js"></script>

Importar como dependência do módulo da sua aplicação

    var appModule = angular.module('app', [ 'dextra.input', 'dextra.upload', 'dextra.http', 'dextra.i18n' ]);


dextra.http
-------------

Possui algumas funcionalidadades comuns ao uso de HTTP (objeto $http do angular)

Habilita DevMode (desabilita o cache de requisições HTTP)

    mainModule.value("dxDevMode", true);

Habilitar Callbacks para Loading em cada requisição HTTP

    mainModule.value("dxLoadingHideHandler", function() {
	    $('#loading').hide();
    });
    mainModule.value("dxLoadingShowHandler", function() {
	    $('#loading').show();
    });
    
Criar um Callback padrão para tratamento de erros

    $provide.factory("dxErrorHandler", function($log) {
	return function(response) {
		$log.error('Http Error ' + response.status + " : " + response.data);
	}
    });
    
dextra.i18n
-------------

Permite internacionalizar textos

Configurando um ResourceBundle 

    mainModule.value("dxBundle", {
	    test1 : 'Test1',
	    outher: {
		  test2: 'Test2'
	    }
    });

A partir do resource bundle configurado, pode-se utiliza-lo das seguintes formas:

 - Directive

	    <div dxI18n="test1"></div>
	    <div dxI18n="outher.test2"></div>
	
 - Filter
 
	    <div>{{'test1' | dxI18n}}</div>
	    <div>{{'outher.test2' | dxI18n}}</div>
   
 - Tag
 
	    <dx-i18n>test1</dx-i18n>
	    <dx-i18n>outher.test2</dx-i18n>
   
 - Object
 
	    function IndexController($scope, dxI18n){
	  
		var test1 = dxI18n('test1');
		var test2 = dxI18n('outher.test2');
	  
	    }
   