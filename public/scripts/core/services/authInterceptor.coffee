app.factory 'authInterceptor', ($q, $location, $window) ->
  return {
    request: (config) ->
      config.headers ||= {}
      if $window.localStorage.token
        config.headers.Authorization = 'Bearer ' + $window.localStorage.token
        config.params =
          name: $window.localStorage.currentUser
      return config
    ,
    response: (response) ->
      # handles the case where the user is not authenticated
      $location.path '/login' if response.status is 401
      return response || $q.when response
  }


app.config ($httpProvider) ->
  $httpProvider.interceptors.push 'authInterceptor'
