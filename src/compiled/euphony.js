// Generated by CoffeeScript 1.3.1
(function() {
  var Euphony,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Euphony = (function() {

    Euphony.name = 'Euphony';

    function Euphony() {
      this.pause = __bind(this.pause, this);

      this.stop = __bind(this.stop, this);

      this.resume = __bind(this.resume, this);

      this.start = __bind(this.start, this);

      this.play = __bind(this.play, this);

    }

    Euphony.prototype.initScene = function() {
      var _this = this;
      this.design = new PianoKeyboardDesign();
      this.keyboard = new PianoKeyboard(this.design);
      this.rain = new NoteRain(this.design);
      this.scene = new Scene('#canvas');
      this.scene.add(this.keyboard.model);
      this.scene.add(this.rain.model);
      this.scene.animate(function() {
        return _this.keyboard.update();
      });
      this.player = MIDI.Player;
      this.player.addListener(function(data) {
        var NOTE_OFF, NOTE_ON, message, note;
        NOTE_OFF = 128;
        NOTE_ON = 144;
        note = data.note, message = data.message;
        if (message === NOTE_ON) {
          return _this.keyboard.press(note);
        } else if (message === NOTE_OFF) {
          return _this.keyboard.release(note);
        }
      });
      return this.player.setAnimation({
        delay: 30,
        callback: function(data) {
          if (_this.playing) {
            return _this.rain.update(data.now * 1000);
          }
        }
      });
    };

    Euphony.prototype.initMidi = function(callback) {
      return MIDI.loadPlugin(callback);
    };

    Euphony.prototype.getBuiltinMidiIndex = function(callback) {
      var _this = this;
      if (this.midiIndex) {
        return callback(this.midiIndex);
      }
      return $.getJSON('tracks/index.json', function(index) {
        _this.midiIndex = index;
        return callback(_this.midiIndex);
      });
    };

    Euphony.prototype.setBuiltinMidi = function(filename, callback) {
      var _this = this;
      return DOMLoader.sendRequest({
        url: "tracks/" + filename,
        progress: function(event) {
          return loader.message('loading MIDI ' + Math.round(event.loaded / event.total * 100) + '%');
        },
        callback: function(response) {
          return _this.setMidiFile(response.responseText, callback);
        }
      });
    };

    Euphony.prototype.setMidiFile = function(midiFile, callback) {
      var _this = this;
      this.started = false;
      return this.player.loadFile(midiFile, function() {
        loader.stop();
        return _this.rain.setMidiData(_this.player.data, callback);
      });
    };

    Euphony.prototype.playTrack = function(id) {
      var _this = this;
      return this.setMidiFile(MIDIFiles[Object.keys(MIDIFiles)[id]], function() {
        return _this.play();
      });
    };

    Euphony.prototype.play = function() {
      if (this.started) {
        return this.resume();
      } else {
        return this.start();
      }
    };

    Euphony.prototype.start = function() {
      this.player.start();
      this.playing = true;
      return this.started = true;
    };

    Euphony.prototype.resume = function() {
      var _this = this;
      this.player.start();
      return setTimeout((function() {
        return _this.playing = true;
      }), 500);
    };

    Euphony.prototype.stop = function() {
      this.player.stop();
      return this.playing = false;
    };

    Euphony.prototype.pause = function() {
      this.player.pause();
      return this.playing = false;
    };

    return Euphony;

  })();

  this.Euphony = Euphony;

}).call(this);
