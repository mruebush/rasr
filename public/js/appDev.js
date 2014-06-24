(function() {
  var appDev;

  appDev = angular.module('komAppDev', ['komApp', 'ngMockE2E']);

  appDev.run(function($httpBackend) {
    $httpBackend.whenPOST(/api/).respond({});
    $httpBackend.whenPUT(/api/).respond(function(req, url, data, headers) {});
    $httpBackend.whenGET(/screen/).respond(function(req, url) {
      debugger;
    });
    return $httpBackend.whenGET(/.tpl.html/).passThrough();
  });

}).call(this);
