var os = require('os')
var express = require('express')
var pretty = require('express-prettify')
var bodyParser = require('body-parser');
var url = require('url');
var app = express();

app.use(pretty({ query: 'pretty' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

app.all("/*", function (req, res, next) {
    console.log("%s request for %s", req.method, req.originalUrl)
    return next();
});

router.use(function (req, res, next) {
    req.prefix = req.protocol + '://' + req.get('host') + url.parse(req.originalUrl).pathname;
    console.log(req.prefix);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    next();
});


router.get('/', function (req, res) {
    apis = [
        {
            method: "GET, POST",
            desc: "GET demo",
            url: req.prefix + '/demo/headers'
        },
        {
            method: "GET",
            desc: "GET demo",
            url: req.prefix + '/demo/demo'
        },
        {
            method: "PUT",
            desc: "PUT demo",
            url: req.prefix + '/demo/demo'
        },
        {
            method: "DELETE",
            desc: "DELETE demo",
            url: req.prefix + '/demo/demo'
        },
        {
            method: "POST",
            desc: "POST demo",
            url: req.prefix + '/demo/demo'
        },
    ]
    res.json({ api: apis });
});

function headers(req, res) {
    res.json({
        result: true,
        hostname: os.hostname(),
        headers: req.headers,
        query: req.query,
        body: req.body,
    });
};

router.route('/demo/headers')
    .get(headers)
    .post(headers)

router.route('/demo/demo')
    // curl -H "Content-Type: application/json" -X PUT -d '{}' http://localhost:1234/api/demo/demo
    .get(function (req, res) {
        res.json({ result: true });
    })

    // curl -X PUT -d '{}' http://localhost:1234/api/demo/demo
    .put(function (req, res) {
        res.json({ result: true });
    })

    // curl -X DELETE http://localhost:1234/api/demo/demo
    .delete(function (req, res) {
        res.json({ result: true });
    })

    // curl -H "Content-Type: application/json" -X POST -d '{}' http://localhost:1234/api/demo/demo
    .post(function (req, res) {

        res.json({ result: true });
    });

app.use('/api', router);

app.use(express.static('static'));
//app.use(express.static('web'));

app.listen(port);