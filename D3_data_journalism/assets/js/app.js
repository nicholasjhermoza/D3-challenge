// @TODO: YOUR CODE HERE!
// Define SVG area dimensions
var svgWidth = 900;
var svgHeight = 700;

var margin = {
    top: 20,
    right: 40,
    bottom: 20,
    left: 60
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart and shift the latter by left and top margins
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgHeight)
    .attr("height", svgWidth);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Load data
d3.csv("assets/data/data.csv", function(data){
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    return data;
}).then(function(data) {
    console.log(data);


  // Create a scale for your independent (x) coordinates
  var xLinearScale = d3.scaleLinear()
    .domain([7, d3.max(data, d => d.poverty)])
    .range([0, width]);

  // Create a scale for your dependent (y) coordinates
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.healthcare)])
    .range([height, 0]);

      // Append a path element to the svg, make sure to set the stroke, stroke-width, and fill attributes.
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);
  
      // Step 4: Append Axes to the chart
      // ==============================
      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
  
      chartGroup.append("g")
        .call(leftAxis);
  
      // Step 5: Create Circles
      // ==============================
      var circlesGroup = chartGroup.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "15")
      .attr("fill", "pink")
      .attr("opacity", ".5");
      chartGroup.selectAll("null").data(data)
      .enter().append("text")
      .text(function(d){return d.abbr})
      .attr("x", d => xLinearScale(d.poverty))
      .attr("y", d => yLinearScale(d.healthcare))
      .attr("text-anchor", "middle")
  
      // Step 6: Initialize tool tip
      // ==============================
      var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
          return (`${d.abbr}<br>poverty: ${d.poverty}<br>healthcare: ${d.healthcare}`);
        });
  
      // Step 7: Create tooltip in the chart
      // ==============================
      chartGroup.call(toolTip);
  
      // Step 8: Create event listeners to display and hide the tooltip
      // ==============================
      circlesGroup.on("click", function(data) {
        toolTip.show(data, this);
      })
        // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });
  
      // Create axes labels
      chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 10)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Healthcare");
  
      chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("poverty");
    }).catch(function(error) {
      console.log(error);
    });
  