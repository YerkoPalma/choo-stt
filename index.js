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
  SPEECH_END: 'stt:speech-end'
}

function stt (state, emitter) {
  var SpeechRecognition = window.SpeechRecognition ||
                        window.webkitSpeechRecognition ||
                        window.mozSpeechRecognition ||
                        window.msSpeechRecognition ||
                        window.oSpeechRecognition
  try {
    if (!SpeechRecognition) throw new Error('stt: SpeechRecognition not supported')
    var recognition = new SpeechRecognition()
    state.stt = {}
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
    recognition.onend = function () {
      emitter.emit(events.END)
    }
    recognition.onresult = function (event) {
      var last = event.results.length - 1
      // always send the first alternative of the las result
      emitter.emit(events.RESULT, event.results[last][0].transcript, event)
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
