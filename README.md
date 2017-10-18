# choo-stt [![stability][0]][1]
[![npm version][2]][3] [![build status][4]][5]
[![downloads][8]][9] [![js-standard-style][10]][11]

Simple speech-to-text in the browser for choo

## Usage

```js
var choo = require('choo')
var html = require('choo/html')

var app = choo()
app.use(require('choo-stt'))
app.route('/', mainView)
app.mount('body')

function mainView (state, emit) {
  return html`
    <body>
      <button onclick=${onclick}>Listen</button>
    </body>
  `

  function onclick () {
    emit('stt:start')
  }
}
function listen (state, emitter) {
  emitter.on('stt:result', function (result) {
    console.log(result[0][0].transcript)
  })
}
```

## Events
### `stt:error` | `stt.events.ERROR`
Fired whenever there is an error related to speech recognition.

### `stt:audio-start` | `stt.events.AUDIO_START`
Fired when the user agent has started to capture audio.

### `stt:audio-end` | `stt.events.AUDIO_END`
Fired when the user agent has finished capturing audio.

### `stt:start` | `stt.events.START`
Fired when the speech recognition service has begun listening to incoming audio.

### `stt:end` | `stt.events.END`
Fired when the speech recognition service has disconnected.

### `stt:stop` | `stt.events.STOP`
Emit this event to stops the speech recognition service from listening to 
incoming audio, and attempts to return a SpeechRecognitionResult using the 
audio captured so far.

### `stt:abort` | `stt.events.ABORT`
Stops the speech recognition service from listening to incoming audio.

### `stt:no-match` | `stt.events.NO_MATCH`
Fired when the speech recognition service returns a final result with no 
significant recognition. This may involve some degree of recognition, which 
doesn't meet or exceed the confidence threshold.

### `stt:result` | `stt.events.RESULT`
Fired when the speech recognition service returns a result — a word or phrase 
has been positively recognized and this has been communicated back to the app.

### `stt:sound-start` | `stt.events.SOUND_START`
Fired when any sound — recognisable speech or not — has been detected.

### `stt:sound-end` | `stt.events.SOUND_END`
Fired when any sound — recognisable speech or not — has stopped being detected.

### `stt:speech-start` | `stt.events.SPEECH_START`
Fired when sound that is recognised by the speech recognition service as speech 
has been detected.

### `stt:speech-end` | `stt.events.SPEECH_END`
Fired when speech recognised by the speech recognition service has stopped 
being detected.

## API
### stt = require('choo-stt')

- `state.stt.lang`: Returns or set the language of the current recognition. 
Defaults to Html lang element, or user agent lang if tag is not set.
- `state.stt.continuos`: Controls whether continuous results are returned for 
each recognition, or only a single result. Defaults `false`.
- `state.stt.interimResults`: Controls whether interim results should be 
returned `true` or not `false`. Interim results are results that are not yet 
final. Defaults `false`.
- `state.stt.maxAlternatives`: Sets the maximum number of 
SpeechRecognitionAlternatives provided per result. Defaults to 1.
- `state.stt.serviceURI`: Specifies the location of the speech recognition 
service used by the current SpeechRecognition to handle the actual recognition. 
The default is the user agent's default speech service.

## License
[MIT](/LICENSE)

[0]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/npm/v/choo-stt.svg?style=flat-square
[3]: https://npmjs.org/package/choo-stt
[4]: https://img.shields.io/travis/YerkoPalma/choo-stt/master.svg?style=flat-square
[5]: https://travis-ci.org/YerkoPalma/choo-stt
[6]: https://img.shields.io/codecov/c/github/YerkoPalma/choo-stt/master.svg?style=flat-square
[7]: https://codecov.io/github/YerkoPalma/choo-stt
[8]: http://img.shields.io/npm/dm/choo-stt.svg?style=flat-square
[9]: https://npmjs.org/package/choo-stt
[10]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[11]: https://github.com/feross/standard
