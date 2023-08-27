function fetchTotalNumberOfPurchase() {
$(document).ready(function () {
    $.ajax({
      url: "http://localhost:1113/totalNumberOfPurchasesPerMonth",
      dataType: "json",
      success: function (data) {
        drawChart(data.months, data.totals); //actually drawing it 
      },
      error: function (xhr, status, error) {
        console.error(error);
      },
    });
  });
}

var color = d3.scaleOrdinal(d3.schemeCategory10);

function drawChart(months, totals) {
  var margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  var x = d3.scaleBand().range([0, width]).padding(0.1);

  var y = d3.scaleLinear().range([height, 0]);

  var xAxis = d3.axisBottom(x);

  var yAxis = d3.axisLeft(y);

  var svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 
    
  

  var data = months.map(function (month, index) {
    return {
      month: month,
      total: totals[index],
    };
    
  });

  x.domain(
    data.map(function (d) {
      return d.month;
    })
  );
  y.domain([
    0,
    d3.max(data, function (d) {
      return d.total;
    }),
  ]);


  svg
  .selectAll(".bar")
  .data(data)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("x", function (d) {
    return x(d.month);
  })
  .attr("width", x.bandwidth())
  .attr("y", function (d) {
    return y(d.total);
  })
  .attr("height", function (d) {
    return height - y(d.total);
  })
  .attr("fill", function (d) {
    return color(d.month);
  });



  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g").attr("class", "y axis").call(yAxis);
}

//----------------------------------------------------------------------------

// second graph:
function fetchMostGenrePerMonth() {
  $.ajax({
    url: "http://localhost:1113/genreChart",
    dataType: "json",
    success: function (data) {
      if (data) {
        const genres = data.map((item) => item.genre);
        const totalPurchases = data.map((item) => item.totalPurchases);
          drawPieChart(genres, totalPurchases);
      } else {
        console.error("Invalid or empty response from the server");
      }
    },
  });
}


function drawPieChart(genres, totalPurchases) {
  console.log(genres,totalPurchases);
  // Define the dimensions of the pie chart
  const width = 400;
  const height = 400;
  const radius = Math.min(width, height) / 2;

  // Create an SVG element for the pie chart
  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  // Create a color scale
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // Define the pie function
  const pie = d3.pie().value((d) => d);

  // Create the pie slices
  const slices = svg.selectAll("arc").data(pie(totalPurchases)).enter();

  // Draw the pie chart
  slices
    .append("path")
    .attr("d", d3.arc().innerRadius(0).outerRadius(radius))
    .attr("fill", (d, i) => color(i));

  // Add labels
  slices
    .append("text")
    .attr("transform", (d) => {
      // Calculate the centroid of the arc for positioning the text
      const centroid = d3.arc().centroid(d);
      return `translate(${centroid[0]}, ${centroid[1]})`;
    })
    .attr("dy", "0.35em")
    .text((d, i) => `${genres[i]} (${totalPurchases[i]})`);

  // Add title
  svg
    .append("text")
    .attr("class", "chart-title")
    .attr("x", 0)
    .attr("y", -height / 2 - 10)
    .attr("text-anchor", "middle")
    .text("Most Bought Genre per Month");
}

$(document).ready(function () {
  fetchTotalNumberOfPurchase(); // Fetch and draw the first chart
  fetchMostGenrePerMonth(); // Fetch and draw the second chart
});