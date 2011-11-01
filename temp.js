<div id="record" class="gallery">
</div>
// Dimensions of svg canvas
var w = 960,
	h = 800,
	r = Math.min(w, h) / 2, //radius
	color = d3.scale.ordinal()
		.range(["#DD2858", "#328768", "#67A2C9", "#204EE2", "#9C67C6", "#9CD8BF", "#DB3BBD", "#7E2230", "#CC9BB2", "#CAC765", "#DCEBCC", "B7B2B5"]);
		
var vis = d3.select("#record").append("svg:svg")
	.attr("width", w)
	.attr("height", h)
	.append("svg:g")
	.attr("transform", "translate(" + w / 2 + "," + h / 2 +")");

// Recursively partition node tree into sunburst
var partition = d3.layout.partition()
	.sort(null) // Default is descending order by associated input data's numeric value attribute
	.size([2 * Math.PI, r * r])
	.value(function(d) { return 1; });
	
var arc = d3.svg.arc()
	.startAngle(function(d) { return d.x; })
	.endAngle(function(d) { return d.x+ d.dx; })
	.innerRadius(function(d) { return Math.sqrt(d.y); })
	.outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

// d3.json(url, callback) issues GET request for JSON file at url
 d3.json(".......", function(json) {
	var path = vis.data([json]).selectAll("path") // Selects all elements that match selector string
		.data(partition.nodes)
		.enter().append("svg:path")
		.attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
		.attr("d", arc)
		.attr("fill-rule", "evenodd")
		.style("stroke", "#fff")
		.style("fill", function(d) { return color((d.children ? d : d.parent).name); });	
	
});