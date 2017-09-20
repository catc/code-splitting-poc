const express = require('express')
const app = express()
const {resolve, join} = require('path');

app.use('/assets', express.static(join(__dirname, 'assets')));

app.get('/', function (req, res) {
	res.sendFile(resolve(__dirname, 'assets/index.html'))
})

app.get('*', (req, res) => {
	res.sendFile(resolve(__dirname, 'assets/index.html'))
})

const PORT = 8100
app.listen(PORT, function () {
	console.log(`Example app listening on port ${PORT}!`)
})