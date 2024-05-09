//weather weight
!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src='https://weatherwidget.io/js/widget.min.js';fjs.parentNode.insertBefore(js,fjs);}}(document,'script','weatherwidget-io-js');

//change time

var date = new Date();
var options = {
  hour: '2-digit',   //(e.g., 02)
  minute: '2-digit', //(e.g., 02)          
  hour12: false,     // 24 小時制
  timeZone: 'Asia/Taipei' // 美國/紐約
};
var wea=document.getElementsByClassName("weatherwidget-io")
options.timeZone='Asia/Taipei'
wea[0].setAttribute("data-label_1",date.toLocaleTimeString('en-GB', options));
options.timeZone='Asia/Tokyo'
wea[1].setAttribute("data-label_1",date.toLocaleTimeString('en-GB', options));
options.timeZone='Europe/London'
wea[2].setAttribute("data-label_1",date.toLocaleTimeString('en-GB', options));
options.timeZone='America/New_York'
wea[3].setAttribute("data-label_1",date.toLocaleTimeString('en-GB', options));

//Map drawing

let rwdSvgWidth = parseInt(d3.select('.RWDChart').style('width')),
    divh= document.getElementsByClassName('left');
    rwdSvgHeight= divh[0].clientHeight;

  const svg = d3.select('.RWDChart')
                .append('svg')
                .attr('width', rwdSvgWidth)
                .attr('height', rwdSvgHeight)
                //.attr("style", "outline: thin solid red;")
                //.style("background", "white");


    // Map and projection
  const sphere = {type: 'Sphere'};
  const projection = d3.geoPatterson()
                       //.scale(70)
                        .rotate([-150, 0])
                        .fitSize([rwdSvgWidth,rwdSvgHeight],sphere)                     
                        .translate([rwdSvgWidth / 2, rwdSvgHeight / 2]);
    
    // Data and color scale
  const data = d3.map();
  const colorScale = d3.scaleThreshold()
                       .domain([9, 99, 999])
                       .range(d3.schemeSpectral[4]);
    
    // Load external data and boot
  d3.queue()
    .defer(d3.json, "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
    .defer(d3.csv, "https://k1vink1vin.github.io/notion/map/economy_income.csv", function(d) { data.set(d.code, +d.income); })
    .await(ready);
  d3.select(window).on("resize",redraw);
    
  function ready(error, topo) {
    let mouseOver = function(d) {
      d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", .5)
      d3.select(this)
        .transition()
        .duration(200)
        .style("opacity", 1)
        .style("stroke", "black")
    }
    let mouseLeave = function(d) {
      d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", .8)
      d3.select(this)
        .transition()
        .duration(200)
        .style("stroke", "transparent")
    }
    // Draw the map
    svg.append("g")
      .selectAll("path")
      .data(topo.features)
      .enter()
      .append("path")
    // draw each country
      .attr("d", d3.geoPath().projection(projection))
    // set the color of each country
      .attr("fill", function (d) {d.total = data.get(d.id) || 0; return colorScale(d.total);})
      .style("stroke", "transparent")
      .attr("class", function(d){ return "Country" } )
      .style("opacity", .8)
      .on("mouseover", mouseOver )
      .on("mouseleave", mouseLeave )
  }
  
  function redraw() {
    rwdSvgWidth = parseInt(d3.select('.RWDChart').style('width'));
    divh= document.getElementsByClassName('left');
    rwdSvgHeight= divh[0].clientHeight;
    console.log("resize"+rwdSvgWidth+'x'+rwdSvgHeight);
    let divw = d3.select('.RWDChart')
                 .attr('height', rwdSvgHeight);
    projection.fitSize([rwdSvgWidth,rwdSvgHeight],sphere)
              .translate([rwdSvgWidth/2,rwdSvgHeight/2]);
    svg.transition()
       .attr('width', rwdSvgWidth)
       .attr('height', rwdSvgHeight)
       .selectAll("path")
    // draw each country
      .attr("d", d3.geoPath().projection(projection))
    // set the color of each country
      .attr("fill", function (d) {d.total = data.get(d.id) || 0; return colorScale(d.total);});
  }
