const bodyParser = require('body-parser');
var express = require("express");
var cors = require('cors');
var util = require("util");
const fs = require('fs');
const { domainToASCII } = require('url');
var app = express();


app.listen(3000, () => { console.log("Server running on port 3000"); });

app.use(cors({ origin: '*' }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());



app.post('/compile', (req, res) => {
    if(req.body.language === 'python'){

        fs.writeFileSync('./temp/exec_python.py', req.body.code);

        var spawn = require('child_process').spawn;
        var process = spawn('python',["./temp/exec_python.py"]);

        process.stdout.on('data', function(data) {
            res.json( { result: data.toString() } );
        });
    }
    else{
        res.json( {result: "Executando o código"} );
    }
});