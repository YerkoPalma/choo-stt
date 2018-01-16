module.exports = stt

var events = stt.events = {
  ERROR: 'stt:error',
  AUDIO_START: 'stt:audio-start',
  AUDIO_END: 'stt:audio-end',
  START: 'stt:start',
  END: 'stt:end',
  STOP: 'stt:stop',
  ABORT: 'stt:abort',
  NO_MATCH: 'stt:no-match',
  RESULT: 'stt:result',
  SOUND_START: 'stt:sound-start',
  SOUND_END: 'stt:sound-end',
  SPEECH_START: 'stt:speech-start',
  SPEECH_END: 'stt:speech-end',
  SET_COMMAND: 'stt:set-command'
}

function stt () {
  return function (state, emitter) {
    var SpeechRecognition = window.SpeechRecognition ||
                          window.webkitSpeechRecognition ||
                          window.mozSpeechRecognition ||
                          window.msSpeechRecognition ||
                          window.oSpeechRecognition
    try {
      if (!SpeechRecognition) throw new Error('stt: SpeechRecognition not supported')
      var recognition = new SpeechRecognition()
      state.stt = {}
      state.stt.commands = {}
      var optionalParam = /\s*\((.*?)\)\s*/g
      var optionalRegex = /(\(\?:[^)]+\))\?/g
      var namedParam = /(\(\?)?:\w+/g
      var escapeRegExp = /[-{}[\]+?.,\\^$|#]/g
      var commandToRegExp = function (command) {
        command = command.replace(escapeRegExp, '\\$&')
                  .replace(optionalParam, '(?:$1)?')
                  .replace(namedParam, function (match, optional) {
                    return optional ? match : '([^\\s]+)'
                  })
                  .replace(optionalRegex, '\\s*$1?\\s*')
        return new RegExp('^' + command + '$', 'i')
      }
      // define custom getters and setters to keep in sync with recognition object
      Object.defineProperties(state.stt, {
        lang: {
          get: () => recognition.lang,
          set: (lang) => { recognition.lang = lang }
        },
        continuous: {
          get: () => recognition.continuous,
          set: (continuous) => { recognition.continuous = continuous }
        },
        interimResults: {
          get: () => recognition.interimResults,
          set: (interimResults) => { recognition.interimResults = interimResults }
        },
        maxAlternatives: {
          get: () => recognition.maxAlternatives,
          set: (maxAlternatives) => { recognition.maxAlternatives = maxAlternatives }
        },
        serviceURI: {
          get: () => recognition.serviceURI,
          set: (serviceURI) => { recognition.serviceURI = serviceURI }
        }
      })
      emitter.on(events.START, function () {
        recognition.start()
      })
      emitter.on(events.STOP, function () {
        recognition.stop()
      })
      emitter.on(events.ABORT, function () {
        recognition.abort()
      })
      emitter.on(events.SET_COMMAND, function (name, cb) {
        state.stt.commands[name] = cb
      })
      recognition.onend = function () {
        emitter.emit(events.END)
      }
      recognition.onresult = function (event) {
        var text = event.results[event.resultIndex][0].transcript.trim()
        emitter.emit(events.RESULT, text, event)
        var limit = state.stt.maxAlternatives > 5 ? 5 : state.stt.maxAlternatives
        for (var i = 0; i < limit; i++) {
          for (var command in state.stt.commands) {
            var result = commandToRegExp(command).exec(text)
            if (result) {
              var parameters = result.slice(1)
              if (typeof state.stt.commands[command] === 'function') {
                state.stt.commands[command].apply(this, parameters)
                break
              }
            }
          }
        }
      }
      recognition.onnomatch = function (event) {
        emitter.emit(events.NO_MATCH, event)
      }
      recognition.onaudiostart = function (event) {
        emitter.emit(events.AUDIO_START, event)
      }
      recognition.onaudioend = function (event) {
        emitter.emit(events.AUDIO_END, event)
      }
      recognition.onsoundstart = function (event) {
        emitter.emit(events.SOUND_START, event)
      }
      recognition.onsoundend = function (event) {
        emitter.emit(events.SOUND_END, event)
      }
      recognition.onspeechstart = function (event) {
        emitter.emit(events.SPEECH_START, event)
      }
      recognition.onspeechend = function (event) {
        emitter.emit(events.SPEECH_END, event)
      }
    } catch (e) {
      emitter.emit(events.ERROR, e)
    }
  }
}
