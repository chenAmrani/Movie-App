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
    width = 500 - margin.left - margin.right,
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


//end create first graph - average amount of purchases per month


//start create second graph - number of purchases per month
// function fetchCumulativeAmountOfPurchasesPerMonth() {
//   $.ajax({
//     url: "http://localhost:1113/cumulativeAmountOfPurchasesPerMonth",
//     dataType: "json",
//     success: function (data) {
//       drawSecondChart(data.months, data.averages);
//     },
//     error: function (xhr, status, error) {
//       console.error(error);
//     },
//   });
// }

// function drawSecondChart(months, averages) {
//   var margin = { top: 20, right: 20, bottom: 30, left: 50 },
//     width = 800 - margin.left - margin.right,
//     height = 400 - margin.top - margin.bottom;

//   var parseDate = d3.timeParse("%Y-%m");

//   var x = d3.scaleTime().range([0, width]);

//   var y = d3.scaleLinear().range([height, 0]);

//   var xAxis = d3.axisBottom(x);

//   var yAxis = d3.axisLeft(y);

//   var line = d3
//     .line()
//     .x(function (d) {
//       return x(d.date);
//     })
//     .y(function (d) {
//       return y(d.averageAmount);
//     });

//   var svg = d3
//     .select("#secondChart")
//     .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//   var data = months.map(function (month, index) {
//     return {
//       date: parseDate(month),
//       averageAmount: averages[index],
//     };
//   });

//   x.domain(
//     d3.extent(data, function (d) {
//       return d.date;
//     })
//   );
//   y.domain([
//     0,
//     d3.max(data, function (d) {
//       return d.averageAmount;
//     }),
//   ]);

//   svg.append("path").datum(data).attr("class", "line").attr("d", line);

//   svg
//     .append("g")
//     .attr("class", "x axis")
//     .attr("transform", "translate(0," + height + ")")
//     .call(xAxis);

//   svg.append("g").attr("class", "y axis").call(yAxis);

//   // Add a circle for the current data point
//   var currentData = data[data.length - 1];

//   svg
//     .append("circle")
//     .attr("class", "current-point")
//     .attr("cx", x(currentData.date))
//     .attr("cy", y(currentData.averageAmount))
//     .attr("r", 6);
// }

$(document).ready(function () {
  fetchTotalNumberOfPurchase(); // Fetch and draw the first chart
  // fetchCumulativeAmountOfPurchasesPerMonth(); // Fetch and draw the second chart
});