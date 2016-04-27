var selected;

function initMap () {
	console.log(ol);

	selected = new ol.layer.Vector({
		source: getSource(),
		style: (function() {
			var stroke = new ol.style.Stroke({
				color: 'black'
			});
			var textStroke = new ol.style.Stroke({
				color: '#fff',
				width: 3
			});
			var textFill = new ol.style.Fill({
				color: '#000'
			});
			return function(feature, resolution) {
				return [new ol.style.Style({
					stroke: stroke,
					text: new ol.style.Text({
						font: '12px Calibri,sans-serif',
						text: feature.get('name'),
						fill: textFill,
						stroke: textStroke
					})
				})];
			};
		 })()

	});

	var map = new ol.Map({
		target: 'map',
		layers: [
			new ol.layer.Tile({
				source: new ol.source.OSM(),
				type: 'base',
				title: 'OpenStreetMap'
			}),
			selected
		],
		view: new ol.View({
          center: ol.proj.fromLonLat([19, 47]),
          zoom: 7
        })
	});


	map.on('click', function(evt) {
		var lonlat = ol.proj.toLonLat(evt.coordinate);
		selected.setSource(getSource(lonlat[1], lonlat[0]));
	});

};

function getSource(lat, lon) {
	return new ol.source.Vector({
		url: 'http://localhost:8000/?lat=' + lat + '&lon=' + lon,
		format: new ol.format.GeoJSON()
	});
}
