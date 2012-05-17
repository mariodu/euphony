class Euphony
  constructor: ->

  initScene: ->
    @design = new PianoKeyboardDesign()
    @keyboard = new PianoKeyboard(@design)
    @rain = new NoteRain(@design)

    @scene = new Scene('#canvas')
    @scene.add(@keyboard.model)
    @scene.add(@rain.model)
    @scene.animate =>
      @keyboard.update()

    @player = MIDI.Player
    @player.addListener (data) =>
      NOTE_OFF = 128
      NOTE_ON  = 144
      {note, message} = data
      if message is NOTE_ON
        @keyboard.press(note)
      else if message is NOTE_OFF
        @keyboard.release(note)
    @player.setAnimation
      delay: 30
      callback: (data) =>
        if @playing
          @rain.update(data.now * 1000)

  initMidi: (callback) ->
    MIDI.loadPlugin(callback)

  getBuiltinMidiIndex: (callback) ->
    return callback(@midiIndex) if @midiIndex
    $.getJSON 'tracks/index.json', (index) =>
      @midiIndex = index
      callback(@midiIndex)

  setBuiltinMidi: (filename, callback) ->
    DOMLoader.sendRequest
      url: "tracks/#{filename}"
      progress: (event) ->
        loader.message('loading MIDI ' + Math.round(event.loaded / event.total * 100) + '%')
      callback: (response) =>
        @setMidiFile(response.responseText,callback)

  setMidiFile: (midiFile, callback) ->
    # load tracks
    @started = false
    @player.loadFile midiFile, =>
      loader.stop()
      @rain.setMidiData(@player.data, callback)

  playTrack: (id) ->
    @setMidiFile MIDIFiles[Object.keys(MIDIFiles)[id]], =>
      @play()

  play: =>
    if @started then @resume() else @start()

  start: =>
    @player.start()
    @playing = true
    @started = true

  resume: =>
    @player.start()
    setTimeout (=>
      @playing = true
    ), 500

  stop: =>
    @player.stop()
    @playing = false

  pause: =>
    @player.pause()
    @playing = false

@Euphony = Euphony
