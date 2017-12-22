var express = require('express');
var app = express();
app.listen(process.env.PORT || 3000, function () {
    console.log('dfhaskjfn');
})
app.get('/', function (req, res) {
    return res.json({ 'hey': 'hello' })
})