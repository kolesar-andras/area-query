var http = require('http');
var url = require("url");

var pg = require('pg');
var conString = "postgres://localhost:5432/osm";
var client = new pg.Client(conString);
client.connect();

http.createServer(function (req, res) {
    var headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
    }
    var parsedUrl = url.parse(req.url, true);
    console.log(parsedUrl);
    var sql = "SELECT ST_AsGeoJSON(ST_Transform(way, 4236), 7) AS geojson, name FROM planet_osm_polygon WHERE admin_level='8' AND ST_Intersects(way, ST_Transform(ST_SetSRID(ST_MakePoint($1, $2), 4326), 900913)) LIMIT 1";
    var params = [
        parsedUrl.query.lon,
        parsedUrl.query.lat
    ];
    console.log(params);
    var query = client.query(sql, params, function (error, result) {
        var response = {};
        if (error) {
            console.log(error);
            res.writeHead(500, headers);
            response = {
                'success': false,
                'code': error.code
            };
        } else {
            console.log(result);
            res.writeHead(200, headers);
            response = {
                type: "Feature",
            }
            if (result.rows.length) {
                response.geometry = JSON.parse(result.rows[0].geojson);
                response.properties = {
                    'name': result.rows[0].name
                }
            }
        }
        console.log(response);
        res.end(JSON.stringify(response));
    });
}).listen(8000);
