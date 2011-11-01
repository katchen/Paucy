const WEIGHTS =
{
	PEAK: 5,
	WEEKS: 1
}

var data = {}
var year = '2010'

var w = 960,
	h = 750,
	r = Math.min(w, h) / 2 - 100, //radius
	colors = 
	{
		"Pop": "#DD2858",
		"Rock": "#328768", 
		"Rhythm and blues (R&B)":"#67A2C9", 
		"Heavy metal": "#204EE2", 
		"Dance": "#9C67C6", 
		"Alternative rock": "#9CD8BF", 
		"Soul": "#DB3BBD",
		"Hip hop/Rap": "#7E2230",
		"Funk": "#CC9BB2",
		"Country": "#CAC765",
		"Jazz": "#DCEBCC",
		"Other": "B7B2B5",
		"year": "#F69F13"
	}

var vis = d3.select("#record").append("svg:svg")
	.attr("width", w)
	.attr("height", h)
	.append("svg:g")
	.attr("transform", "translate(" + w / 2 + "," + h / 2 +")");

vis.append("svg:circle")
		.style("stroke", "black")
		.style("fill", "black")
		.attr("r", 375);

// Recursively partition node tree into sunburst
var partition = d3.layout.partition()
	.sort(null) // Default is descending order by associated input data's numeric value attribute
	.size([2 * Math.PI, r * r])
	.value(function(d) { return d.size; });
	
var arc = d3.svg.arc()
	.startAngle(function(d) { return d.x; })
	.endAngle(function(d) { return d.x+ d.dx; })
	.innerRadius(function(d) { return Math.sqrt(d.y); })
	.outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

// Stash the old values for transition.
function stash(d) {
  d.x0 = d.x;
  d.dx0 = d.dx;
}

// Interpolate the arcs in data space.
function arcTween(a) {
  var i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
  return function(t) {
    var b = i(t);
    a.x0 = b.x;
    a.dx0 = b.dx;
    return arc(b);
  };
}

function redraw()
{
	var path = vis.data([data[year]]).selectAll("path") // Selects all elements that match selector string
		.data(partition.nodes)
		.enter().append("svg:path")
		//.attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
		.attr("d", arc)
		.attr("fill-rule", "evenodd")
		.style("stroke", "#fff")
		.style("fill", function(d) { 
			color = colors[d.parent ? (d.children ? (d.children[0].children ? d : d.parent) : d.parent.parent).name : "year"]; 
			return color;
		});
	vis.exit().remove();
	vis.append("svg:circle")
		.style("stroke", "white")
		.style("fill", "white")
		.attr("r", 60);
}

// Get Data

d3.csv("billboardHot.csv", function(csvData) 
{
	var num = csvData.length;
	var cur, year, children, children2, found, found2;
	for (var i = 0; i < num; ++i)
	{
		cur = csvData[i];
		year = cur.year;
		if (data.hasOwnProperty(year))
		{
			children = data[year].children;
			found = false;
			for (var j = 0; j < children.length; ++j)
			{
				if (children[j].name == cur.genre)
				{
					found2 = false;
					children2 = children[j].children;
					for (var k = 0; k < children2.length; ++k)
					{
						if (children2[k].name == cur.artist)
						{
							children2[k].children.push({
								name: cur.song,
								size: cur.weeks*WEIGHTS.WEEKS + (100 - cur.peak)*WEIGHTS.PEAK
							});
							found2 = true;
							break;
						}
					}
					if (!found2)
					{
						children2.push({
							name: cur.artist,
							children: [{
								name: cur.song,
								size: cur.weeks*WEIGHTS.WEEKS + (100 - cur.peak)*WEIGHTS.PEAK
							}]
						});
					}
					found = true;
					break;
				}
			}
			if (!found)
			{
				children.push({
					name: cur.genre,
					children: [{
						name: cur.artist,
						children: [{
							name: cur.song,
							size: cur.weeks*WEIGHTS.WEEKS + (100 - cur.peak)*WEIGHTS.PEAK
						}]
					}]
				});
			}
		}
		else
		{
			data[year] = 
			{
				name: year,
				children: [{
					name: cur.genre,
					children: [{
						name: cur.artist,
						children: [{
							name: cur.song,
							size: "" + cur.weeks*WEIGHTS.WEEKS + (100 - cur.peak)*WEIGHTS.PEAK
						}]
					}]
				}]
			};
		}
	}
	redraw();
});

$( "#slider" ).slider({
	max: 30,
	value: 30,
	slide: function(event, ui) { year = "" + (1980 + ui.value); redraw(); }
});