define(->
  return (obj) ->
    obj._listeners = {}
    obj.on = (key, callback) ->
      if obj._listeners[key]
        obj._listeners[key].push callback
      else
        obj._listeners[key] = [callback]
      return

    obj.trigger = (key, data...) ->
      if obj._listeners[key]
        callbacks = obj._listeners[key]
        i = 0

        while i < callbacks.length
          callback = callbacks[i]
          callback.apply null, data
          i++
      return

    obj
)
