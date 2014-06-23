describe('EventService', function () {
  var $httpBackend, SERVER_URL, scope;
  beforeEach(module('komApp'));

  beforeEach(inject(function($injector){

    var $rootScope = $injector.get('$rootScope');
    var $controller = $injector.get('$controller');
    var $service = $injector.get('$service');

    $httpBackend = $injector.get('$httpBackend');
    SERVER_URL = $injector.get('SERVER_URL');
    scope = $rootScope.$new();

  }));

  it('should exist', function () {
    var service = $service('EventService', {$scope: scope});
    expect(service).to.exist;
  });
  
});