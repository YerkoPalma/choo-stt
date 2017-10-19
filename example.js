var choo = require('choo')
var html = require('choo/html')

var app = choo()
app.use(require('.'))
app.use(listen)
app.route('/', mainView)
app.mount('body')

function mainView (state, emit) {
  return html`
    <body>
      <p>you said: <span id="result"></span></p>
      <button onclick=${onclick}>Listen</button>
    </body>
  `

  function onclick () {
    emit('stt:start')
  }
}

function listen (state, emitter) {
  emitter.on('stt:result', function (result) {
    var span = document.getElementById('result')
    span.textContent += result
  })
  emitter.on('stt:error', function (e) {
    console.error(e)
  })
}
