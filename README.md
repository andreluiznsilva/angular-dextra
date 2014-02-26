angular-dextra
==============

Configuration
-------------

Para cada módulo desejado: 

Fazer os imports no HTML;

    <script type="text/javascript" charset="utf-8" src="js/lib/dextra/dextra.http.js"></script>
    <script type="text/javascript" charset="utf-8" src="js/lib/dextra/dextra.upload.js"></script>
    <script type="text/javascript" charset="utf-8" src="js/lib/dextra/dextra.i18n.js"></script>
    <script type="text/javascript" charset="utf-8" src="js/lib/dextra/dextra.mask.js"></script>
    <script type="text/javascript" charset="utf-8" src="js/lib/dextra/dextra.input.js"></script>

Importar como dependência do módulo da sua aplicação

    var app = angular.module('app', [ 'dextra.http', 'dextra.upload', 'dextra.i18n', 'dextra.mask', 'dextra.input' ]);


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
    
dextra.upload
-------------

Permite fazer uploads via ajax sem a necessidade de usar iframe (IE 10+)

 - HTML

	    <input type="file" data-dx-upload="file" accept=".csv,text/csv,text/comma-separated-values">
	    <button data-ng-click="upload()">
	    
 - Controller
 
 		function MyController($scope, dxUploader) {
 
	 		$scope.upload = function() {
				if ($scope.file) {
					dxUploader.upload('/upload', $scope.file).success(function(result) {
						console.log('ok');
					}).error(function(result, status, func, request) {
						console.log('error');
					});
				}
			}
			
		}
		
 - Check Browser support
 
	 	dxUploader.check(function() {
			console.log('not support');
		});
    
dextra.i18n
-------------

Permite internacionalizar textos

Configurando um ResourceBundle 

    mainModule.value("dxBundle", {
	    test1 : 'Test 1',
	    outher: {
		  test2: 'Test 2'
	    },
	    test3: 'Hello {0}'
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

Nas opções de Object e Filter é possível passar parâmetros para a internacionalização como:

  - Filter
 
	    <div>{{'test3' | dxI18n:'World'}}</div>
   
 - Object
 
	    function IndexController($scope, dxI18n){
	  
		var test3 = dxI18n('test3','World');
	  
	    }
	    
Converter data e hora em diversos formatos:

  - Date 
  
  		var date = dxI18n.parseDate('22/07/1984', 'dd/MM/yyyy'); 
  		var string = dxI18n.formatDate(new Date(), 'dd/MM/yyyy');
  		
  - Time 
  
  		var time = dxI18n.parseTime('07:03', 'HH:mm'); 
  		var string = dxI18n.formatTime(new Date(), 'HH:mm');

Pode-se recuperar os patterns de datas e horas já fornecidos pela internacionalização padrão do angular:

  - Patterns
  
  		var shortDatePattern = dxI18n.getPattern('short', 'date');
  		var mediumDatePattern = dxI18n.getPattern('medium', 'date');
  		var longDatePattern = dxI18n.getPattern('long', 'date');
  		var shortDatePattern = dxI18n.getPattern('short', 'time');
  		var mediumDatePattern = dxI18n.getPattern('medium', 'time');

Juntando os dois, pode-se internacionalizar datas e horas sem fixar nenhum pattern para formatação/converção.

	- i18n Date and Time

  		var datePattern = dxI18n.getPattern('medium', 'date');
  		var dateString = dxI18n.formatDate(new Date(), datePattern);
  		var timePattern = dxI18n.getPattern('medium', 'time');
  		var timeString = dxI18n.formatTime(new Date(), timePattern);
  		
  	- Shortcut
  	
  		var date = dxI18n.parseDate('22/07/1984', 'medium', 'date'); 
  		var time = dxI18n.parseDate('22/07/1984', 'medium', 'time'); 
 
 dextra.mask
-------------

Permite funções de mascaras de diversos formatos

 - Masks

	    <div>{{00000000191 | mask:'000.000.000-00'}}</div>
	    
 - Masks predefinidas

	    <div>{{00000000191 | cpf}}</div>
	    <div>{{08958412/000140 | cnpj}}</div>
	    <div>{{79020230 | cep}}</div>
	    <div>{{6733213661 | phone}}</div>
	    
 dextra.oauth
-------------

Permite autenticar as chamadas HTTP com OAuth e controlar o fluxo de autenticação. Por padrão o token é salvo em um cookie. 


 - Config (atualmente não tem como proteger o client Id e Secret)
 
 		myModule.value("dxOAuthConfig", {
			clientId : 'myClientID',
			clientSecret : '123',
			tokenEndpoint : 'http://localhost:8080/api/oauth/token'
		});
		
  - Expiration callback
 
 		myModule.factory("dxOAuthExpirationHandler", function() {
			console.log('Token expired');
		});
		
 - Login

	    dxOAuthService.login('username','password').then(function(response) {
			console.log('Logged In');
		}, function(response) {
			console.log('Login fails');
		});

 - Logout

	    dxOAuthService.logout();
	   
 - Is Logged In

	    if (dxOAuthService.isLoggedIn()) {
			console.log('Welcome');
		}
		
 - Get Token Info

		dxOAuthService.info().then(function(response) {
			console.log('Info success');
		}, function(response) {
			console.log('Info fails');
		});
		
 - Authenticate a URL
 
 		var securityUrl = service.addTokenToUrl('myUrl');
 		
 - Change Token Storage (session cookie by default)
 
 		$provide.factory("dxOAuthStorage", function() {
			return {
				get : function() {
					console.log('get token');
					return null;
				},
				set : function(oauth) {
					console.log('save token');
				},
				clear : function(oauth) {
					console.log('delete token');
				}
			};
		});
		
 dextra.test
-------------
 		
 Adiciona alguma função ao framework de testes do angular. 
 
 - waitFor
 
	 	waitFor("Title Change", function(doc, appWindow) {
				return appWindow.title == 'MyTitle';
		}, 1000);
	
 - waitForPageLoadComplete
 
 		waitForPageLoadComplete(1000);
	
 - waitForElementToBeSelected
 
	 	waitForElementToBeSelected('.myCss', 1000);
	 	waitForElementToBeSelected('#id', 1000);
	
 - waitForElementById
 
 		waitForElementById('myId', 1000);
