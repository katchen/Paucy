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
	d3.selectAll("svg").remove();

	var leg = d3.select("#legend").append("svg:svg")
		.attr("width", 400)
		.attr("height", 300)
		.append("svg:g");
	leg.append("svg:circle")
		.style("fill", colors["Pop"])
		.attr("r", 15)
		.attr("cx", 20)
		.attr("cy", 20);
	leg.append("svg:text")
		.text("Pop")
		.attr("x", 48)
		.attr("y", 25)
		.attr("font-family", "Myriad Pro");		
	leg.append("svg:circle")
		.style("fill", colors["Rock"])
		.attr("r", 15)
		.attr("cx", 20)
		.attr("cy", 60);
	leg.append("svg:text")
		.text("Rock")
		.attr("x", 48)
		.attr("y", 65)
		.attr("font-family", "Myriad Pro");
	leg.append("svg:circle")
		.style("fill", colors["Rhythm and blues (R&B)"])
		.attr("r", 15)
		.attr("cx", 20)
		.attr("cy", 100);
	leg.append("svg:text")
		.text("Rhythm & blues (R&B)")
		.attr("x", 48)
		.attr("y", 105)
		.attr("font-family", "Myriad Pro");
	leg.append("svg:circle")
		.style("fill", colors["Heavy metal"])
		.attr("r", 15)
		.attr("cx", 20)
		.attr("cy", 140);
	leg.append("svg:text")
		.text("Heavy metal")
		.attr("x", 48)
		.attr("y", 145)
		.attr("font-family", "Myriad Pro");			
	leg.append("svg:circle")
		.style("fill", colors["Dance"])
		.attr("r", 15)
		.attr("cx", 20)
		.attr("cy", 180);
	leg.append("svg:text")
		.text("Dance")
		.attr("x", 48)
		.attr("y", 185)
		.attr("font-family", "Myriad Pro");
	leg.append("svg:circle")
		.style("fill", colors["Alternative rock"])
		.attr("r", 15)
		.attr("cx", 20)
		.attr("cy", 220);
	leg.append("svg:text")
		.text("Alternative rock")
		.attr("x", 48)
		.attr("y", 225)
		.attr("font-family", "Myriad Pro");	
	leg.append("svg:circle")
		.style("fill", colors["Soul"])
		.attr("r", 15)
		.attr("cx", 225)
		.attr("cy", 20);
	leg.append("svg:text")
		.text("Soul")
		.attr("x", 253)
		.attr("y", 25)
		.attr("font-family", "Myriad Pro");
	leg.append("svg:circle")
		.style("fill", colors["Hip hop/Rap"])
		.attr("r", 15)
		.attr("cx", 225)
		.attr("cy", 60);
	leg.append("svg:text")
		.text("Hip hop/Rap")
		.attr("x", 253)
		.attr("y", 65)
		.attr("font-family", "Myriad Pro");
	leg.append("svg:circle")
		.style("fill", colors["Funk"])
		.attr("r", 15)
		.attr("cx", 225)
		.attr("cy", 100);
	leg.append("svg:text")
		.text("Funk")
		.attr("x", 253)
		.attr("y", 105)
		.attr("font-family", "Myriad Pro");
	leg.append("svg:circle")
		.style("fill", colors["Country"])
		.attr("r", 15)
		.attr("cx", 225)
		.attr("cy", 140);
	leg.append("svg:text")
		.text("Country")
		.attr("x", 253)
		.attr("y", 145)
		.attr("font-family", "Myriad Pro");
	leg.append("svg:circle")
		.style("fill", colors["Jazz"])
		.attr("r", 15)
		.attr("cx", 225)
		.attr("cy", 180);
	leg.append("svg:text")
		.text("Jazz")
		.attr("x", 253)
		.attr("y", 185)
		.attr("font-family", "Myriad Pro");
	leg.append("svg:circle")
		.style("fill", colors["Other"])
		.attr("r", 15)
		.attr("cx", 225)
		.attr("cy", 220);
	leg.append("svg:text")
		.text("Other")
		.attr("x", 253)
		.attr("y", 225)
		.attr("font-family", "Myriad Pro");

	document.getElementById("yearLabel").innerHTML = year;
	var vis = d3.select("#record").append("svg:svg")
		.attr("width", w)
		.attr("height", h)
		.append("svg:g")
		.attr("transform", "translate(" + w / 2 + "," + h / 2 +")");

	vis.append("svg:circle")
			.style("stroke", "black")
			.style("fill", "black")
			.attr("r", 375);
	var path = vis.data([data[year]]).selectAll("path") // Selects all elements that match selector string
		.data(partition.nodes)
		.enter().append("svg:path")
		//.attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
		.attr("d", arc)
		.attr("fill-rule", "evenodd")
		.attr("class", function(d) { return d.children ? (d.children.length == 0 || d.children[0].children ? "genre" : "artist") : "song"; })
		.style("stroke", "#fff")
		.style("fill", function(d) { 
			color = colors[d.parent ? (d.children ? (d.children.length == 0 || d.children[0].children ? d : d.parent) : d.parent.parent).name : "year"]; 
			return color;
		});
	vis.append("svg:circle")
		.style("stroke", "white")
		.style("fill", "white")
		.attr("r", 60);
	var paths = d3.selectAll("path").attr("opacity", 1);
	$("path").tipsy({ gravity: 's'});
	paths.on("mouseover", function(d) {
		paths.filter(function(d2) { if (!d.parent) return false; return d != d2 })
			.attr("opacity", 0.3);
			// If a genre
			if(d.children && d.children[0].children && d.children[0].children.length > 0)
			{
				$("#tooltip").html("Genre: " + d.name);
			} else if(d.children && d.children.length > 0) {
				$("#tooltip").html("Artist: " + d.name + "\n # songs on chart: " + d.children.length);
			} else if(!d.children) {
				 $("#tooltip").html("Song: " + d.name + "\nArtist: " + d.parent.name + "\nWeeks on Chart: " + d.weeks + "\nPeak Position: " + d.peak);
			}
			$("#tooltip").show();
			/*$("#popover #cause").html(d.cause);
			$("#popover #people").html(d.people);
			$("#popover #age").html(d.age);
			$("#popover #gender").html((d.gender == "1") ? "male" : "female");
			$("#popover").css("left", d3.event.x)
		                   .css("top", d3.event.y + 10)
		                   .show();*/
		     })
		.on("mouseout", function() { paths.attr("opacity", 1); $("#tooltip").hide(); })
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
								size: parseInt(cur.weeks)*WEIGHTS.WEEKS + (100 - parseInt(cur.peak))*WEIGHTS.PEAK,
								peak: cur.peak,
								weeks: cur.weeks
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
							size: parseInt(cur.weeks)*WEIGHTS.WEEKS + (100 - parseInt(cur.peak))*WEIGHTS.PEAK,
							peak: cur.peak,
							weeks: cur.weeks
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
				children: [{name: "Pop", children: []}, {name: "Rock", children: []}, {name: "Rhythm and blues (R&B)", children: []},
					{name: "Heavy metal", children: []}, {name: "Dance", children: []}, {name: "Alternative rock", children: []},
					{name: "Soul", children: []}, {name: "Hip hop/Rap", children: []}, {name: "Funk", children: []},
					{name: "Country", children: []}, {name: "Jazz", children: []}, {name: "Other", children: []}
				]
			}
			var gchildren = data[year].children 
			for (var ii = 0; ii < gchildren.length; ++ii)
			{
				if (gchildren[ii].name == cur.genre)
				{
					gchildren[ii].children.push({
						name: cur.artist,
						children: [{
							name: cur.song,
							size: parseInt(cur.weeks)*WEIGHTS.WEEKS + (100 - parseInt(cur.peak))*WEIGHTS.PEAK,
							peak: cur.peak,
							weeks: cur.weeks
						}]
					});
				}
			}
		}
	}
	redraw();
});

var playing = false;
var interval;

function playTick()
{
	if (year == '2010')
	{
		playing = false;
	}
	else
	{
		year = "" + (parseInt(year) + 1);
		$( "#slider" ).slider("value", parseInt(year) - 1980);
		redraw();
	}
}

function togglePlay()
{
	if (playing)
	{
		clearInterval(interval);
		playing = false;
	}
	else
	{
		interval = setInterval(playTick, 1000);
		playing = true;
	}
}

$(document).ready(function() {
	$( "#slider" ).slider({
		max: 30,
		value: 30,
		slide: function(event, ui) { year = "" + (1980 + ui.value); redraw(); return true;}
	});
});