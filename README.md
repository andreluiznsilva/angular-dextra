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

Habilita DevMode (desabilita o cache de requisições HTTP)

  mainModule.value("dxDevMode", true);

Habilitar Callbacks para Loading em cada requisição HTTP

  mainModule.value("dxLoadingHideHandler", function() {
	  $('#loading').hide();
  });
  mainModule.value("dxLoadingShowHandler", function() {
	  $('#loading').show();
  });