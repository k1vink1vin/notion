var margin = { top: 10, right: 5, bottom: 10, left: 100 },
  width = 600,
  height = 400;


d3.csv("https://k1vink1vin.github.io/notion/Nrelation/nodes.csv").then(function(nodes) {
  d3.csv("https://k1vink1vin.github.io/notion/Nrelation/links.csv").then(function(links) {

  const link_types = Array.from(new Set(links.map((d) => d.value)));
  const colorlink = d3.scaleOrdinal(link_types, ["red", "blue", "blue", "grey", "green", "gold"]);

  const simulation = d3
    .forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(30))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().strength(0.1).radius(40))
    .force(
      "link",
      d3.forceLink(links).id((d) => d.id).distance((d) => d.value)
    )
    .on("tick", ticked);

  const svg = d3.select("svg");
  var tooltip = d3
    .select("body")
    .append("div")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background-color", "white") // 背景改為黑色
    .style("color", "black") // 字體顏色改為白色
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");

  const link = svg
    .selectAll("line")
    .data(links)
    .join("line")
    .style("stroke", (d) => colorlink(d.value));

  const node = svg
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", 3)
    .call(drag(simulation))
    .on("mouseover", (event, d) => mouseoverHandler(event, d)) // 傳遞 event 參數
    .on("mousemove", (event, d) => mouseMoving(event, d)) // 傳遞 event 參數
    .on("mouseout", (event, d) => mouseoutHandler(event, d)); // 傳遞 event 參數

  function ticked(d) {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);
    123

    node.attr("cx", (d) => Math.max(3, Math.min(width - 3, d.x))).attr("cy", (d) => Math.max(3, Math.min(height - 3, d.y)));
  }

  function drag(simulation) {
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(1).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }

  function mouseoverHandler(event, d) {
    tooltip.style("visibility", "visible");
    tooltip.html("<p>" + d["cn"] + "</p>");
  }

  function mouseoutHandler(event, d) {
    tooltip.style("visibility", "hidden");
  }

  function mouseMoving(event, d) {
    tooltip
      .style("top", event.pageY - 10 + "px")
      .style("left", event.pageX + 10 + "px")
      .style("color", "white");
  };
    
  });});
