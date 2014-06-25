appDev = angular.module('komAppDev', ['komApp', 'ngMockE2E']);

appDev.run ($httpBackend) ->

  $httpBackend.whenPOST(/api/).respond({});
  $httpBackend.whenPUT(/api/).respond (req, url, data, headers) ->
  $httpBackend.whenGET(/screen/).respond (req, url) ->
    debugger
  $httpBackend.whenGET(/.tpl.html/).passThrough();
