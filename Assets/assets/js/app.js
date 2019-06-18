// @TODO: YOUR CODE HERE!
var svgWidth = 1280;
var svgHeight = 1000;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//creating svg wrapper and appending group that will hold the chart
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .attr("overflow", "scroll");


var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Importing data for charts
d3.csv("data.csv")
    .then(function(stateData) {
        //making sure data loaded properly 
        console.log(stateData);
        //step 1: Parse/Cast as nunbers
        stateData.forEach(function(data) {
            data.income = +data.income;
            data.smokes = +data.smokes;
        });

        //step 2: create scale functions
        var xLinearScale = d3.scaleLinear()
            .domain([38000, d3.max(stateData, d => d.income)])
            .range([0, width]);

        var yLinearScale = d3.scaleLinear()
            .domain([8, d3.max(stateData, d => d.smokes)])
            .range([height, 0]);
    
        //step 3: create axis functions
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        //step 4: append axes to the chart
        chartGroup.append("g")
         .attr("transform", `translate(0, ${height})`)
         .call(bottomAxis);
    
        chartGroup.append("g")
         .call(leftAxis);
    
        //step 5: create circles
        var circlesGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.income))
        .attr("cy", d => yLinearScale(d.smokes))
        .attr("r", "15")
        .attr("fill", "pink")
        .attr("opacity", ".5");

        //append state abbreviations
        var textGroup = chartGroup.selectAll("text.state")
        .data(stateData)
        .enter()
        .append("text")
        .classed("state", true)
        .style("text-anchor","middle")
        .attr("dx", d => xLinearScale(d.income))
        .attr("dy", d => yLinearScale(d.smokes) + 5)
        .attr("stroke","black")
        .style("font", "10px times")
        .text(d => d.abbr);

        //step 6: initialize tool tip
        var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br>Number of Smokers (%): ${d.smokes}<br>Average Income ($): ${d.income}`);
        });

        //step 7: create tooltip in the chart
        chartGroup.call(toolTip);

        //step 8: create event listeners to display and hide the tooltip
        circlesGroup.on("mouseover", function(data) {
            toolTip.show(data, this);
          })

          //on mouseout event
          .on("mouseout", function(data, index) {
            toolTip.hide(data);
          });
        
        //Create axis labels
        chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left - 4)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Number of Smokers (%)");
        
        chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Average Income ($)");


    });


    


















       