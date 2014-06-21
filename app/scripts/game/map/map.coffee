define([], ->
  class Map
    constructor: (@game, @Phaser, @mapId, @$) ->
      @layers = []
      @oldBorders = null
      @tiles = []
      @borders = 
        upScreen: true
        rightScreen: true
        downScreen: true
        leftScreen: true
      @game.physics.arcade.checkCollision.up = false
      @game.physics.arcade.checkCollision.right = false
      @game.physics.arcade.checkCollision.down = false
      @game.physics.arcade.checkCollision.left = false
      @game.on('changeMap', (direction) =>
        @game.changingScreen = true;
        @reload(direction)
      )
      @$up = @$(".up")
      @$up.click =>
        @_makeMap('up', @mapId)
      @$down = @$(".down")
      @$down.click =>
        @_makeMap('down', @mapId)
      @$right = @$(".right")
      @$right.click =>
        @_makeMap('right', @mapId)
      @$left = @$(".left")
      @$left.click =>
        @_makeMap('left', @mapId)

    preload: (direction, data, callback) ->
      that = @
      url = "#{@game.rootUrl}/move/#{direction}/#{@mapId}"
      if !data
        @$.ajax({
          url: url
          success: (data) =>
            @$('#map-id').attr('href', '/edit/' + @mapId);
            that._loadAssets.call(that, data, callback)
            console.log "Trigerring enterMap"
            # @game.mapData = data
            # @game.trigger 'enterMap'
        })
      else
        @_loadAssets.call(@, data, callback)

    _loadAssets: (data, loader = @game.load) ->
      @mapId = data._id
      @game.mapId = @mapId
      @mapData = data
      loader.tilemap('map', null, data, @Phaser.Tilemap.TILED_JSON)

      for tileset in data.tilesets
        @tiles[tileset.name] = loader.image(tileset.name, "assets/tilemaps/tiles/" + tileset.image, 32, 32)

      loader.start();
      loader.onLoadComplete.add =>
        do @create

    create: ->
      map = @game.add.tilemap('map')
      for tileset in @mapData.tilesets
          map.addTilesetImage(tileset.name)

      for layer in @mapData.layers
        layer = map.createLayer(layer.name)
        @layers.push(layer)
        layer.resizeWorld()

      @trigger 'finishLoad'

    reloadMap: (loader, direction) ->
      that = @
      url = "#{@game.rootUrl}/move/#{direction}/#{@mapId}"
      $.ajax({
        url: url
        success: (data) =>
          that._createCtrls(data)      
          that._loadAssets.call(that, data, loader)
          that.game.mapData = data
          that.game.trigger "enterMap"
      })

    reload: (direction) ->
      layer.destroy() for layer in @layers
      @layers = []
      loader = new @Phaser.Loader(@game)
      @reloadMap(loader, direction)

    update: ->

    _createCtrls: (data) ->
      $('#map-id').attr('href', '/edit/' + @mapId);
      @oldBorders = @borders
      @borders = 
        upScreen: data.upScreen
        rightScreen: data.rightScreen
        downScreen: data.downScreen
        leftScreen: data.leftScreen

      for border, value of @borders
        if !!value != !!@oldBorders[border]
          borderDirection = border.split('Screen')[0]
          @$(".#{borderDirection}").toggleClass('hidden')
          @game.physics.arcade.checkCollision[borderDirection] = !value
          
    _makeMap: (direction, mapId) ->
      @$.ajax({
        url: "/make/#{direction}/#{mapId}"
        type: "GET",
        success: ->
        error: ->
      });

  return Map
)