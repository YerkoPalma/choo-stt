var choo = require('choo')
var html = require('choo/html')

var app = choo()
app.use(require('.'))
app.use(require('choo-devtools')())
app.use(listen)
app.route('/', mainView)
app.mount('body')

function mainView (state, emit) {
  return html`
    <body>
      <p>you said: </p>
      <pre id="result"></pre>
      <button onclick=${onclick}>start</button>
    </body>
  `

  function onclick () {
    if (state.listening) emit('stt:stop')
    else emit('stt:start')
    var button = document.querySelector('button')
    button.textContent = state.listening ? 'start' : 'stop'
    state.listening = !state.listening
  }
}

function listen (state, emitter) {
  state.listening = false
  state.stt.continuous = true
  emitter.on('stt:result', function (result) {
    var span = document.getElementById('result')
    span.textContent += '\n' + result.trim()
  })
  emitter.emit('stt:set-command', ':color background', function (color) {
    document.body.style.backgroundColor = color
  })
  emitter.on('stt:error', function (e) {
    console.error(e)
  })
}
