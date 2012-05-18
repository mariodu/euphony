$(document)
  .on 'selectstart', ->
    false
  .on 'ready', ->

    # global loader to show progress
    window.loader = new LoaderWidget()

    #start app
    window.app = new Euphony()
    app.initScene()
    app.initMidi ->
      app.getBuiltinMidiIndex (index) ->
        window.player = new PlayerWidget('#player')
        player.setPlaylist(index)
        player.init()
        player.bind('pause', app.pause)
        player.bind('resume', app.resume)
        player.bind('stop', app.stop)
        player.bind('play', app.play)
        player.bind 'changetrack', (filename) ->
          player.stop()
          console.log(filename)
          app.setBuiltinMidi filename, ->
            player.play()
        player.changeTrack(index[10])
