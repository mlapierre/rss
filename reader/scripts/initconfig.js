var fs = require('fs');
var config = fs.readFileSync('scripts/config.tmpl', 'utf8');

config = config.replace(/%PORT%/g, process.env.API_PORT);
config = config.replace(/%ADDR%/g, process.env.API_ADDR);

fs.writeFile("app/js/config.js", config, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The config file was saved.");
}); 