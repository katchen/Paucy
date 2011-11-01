const WEIGHTS =
{
	PEAK: 5,
	WEEKS: 1
}

var data = {}

/*var w = 960,
    h = 700,
    r = Math.min(w, h) / 2,
    color = d3.scale.category20c();

var vis = d3.select("#chart").append("svg:svg")
	.attr("class" "sunburst")
    .attr("width", w)
    .attr("height", h)
  .append("svg:g")
    .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

var partition = d3.layout.partition()
    .sort(null)
    .size([2 * Math.PI, r * r])
    .value(function(d) { return 1; });

var arc = d3.svg.arc()
    .startAngle(function(d) { return d.x; })
    .endAngle(function(d) { return d.x + d.dx; })
    .innerRadius(function(d) { return Math.sqrt(d.y); })
    .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

d3.json("../data/flare.json", function(json) {
  var path = vis.data([json]).selectAll("path")
      .data(partition.nodes)
    .enter().append("svg:path")
      .attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
      .attr("d", arc)
      .attr("fill-rule", "evenodd")
      .style("stroke", "#fff")
      .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
      .each(stash);

  d3.select("#size").on("click", function() {
    path
        .data(partition.value(function(d) { return d.size; }))
      .transition()
        .duration(1500)
        .attrTween("d", arcTween);

    d3.select("#size").classed("active", true);
    d3.select("#count").classed("active", false);
  });

  d3.select("#count").on("click", function() {
    path
        .data(partition.value(function(d) { return 1; }))
      .transition()
        .duration(1500)
        .attrTween("d", arcTween);

    d3.select("#size").classed("active", false);
    d3.select("#count").classed("active", true);
  });
});

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
}*/

// Get Data

d3.csv("billboardHot.csv", function(csvData) 
{
	var num = csvData.length;
	var cur, year, children, found, found2;
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
				if (children[j] == cur.genre)
				{
					found2 = false;
					children = children[j].children;
					for (var k = 0; k < children.length; ++k)
					{
						if (children[k] == cur.artist)
						{
							children[k].children.push([{
								name: cur.song,
								size: cur.weeks*WEIGHTS.WEEKS + (100 - cur.peak)*WEIGHTS.PEAK
							}]);
						}
					}
					if (!found2)
					{
						children.push([{
							name: cur.artist,
							children: [{
								name: cur.song,
								size: cur.weeks*WEIGHTS.WEEKS + (100 - cur.peak)*WEIGHTS.PEAK
							}]
						}]);
					}
				}
			}
			if (!found)
			{
				children.push([{
					name: cur.genre,
					children: [{
						name: cur.artist,
						children: [{
							name: cur.song,
							size: cur.weeks*WEIGHTS.WEEKS + (100 - cur.peak)*WEIGHTS.PEAK
						}]
					}]
				}]);
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
						name: cur.song,
						size: cur.weeks*WEIGHTS.WEEKS + (100 - cur.peak)*WEIGHTS.PEAK
					}]
				}]
			};
		}
	}
	console.log(tree['2010']);
});

