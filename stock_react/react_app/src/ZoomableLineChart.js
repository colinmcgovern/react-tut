import React, {
  useRef,
  useEffect,
  useState
} from "react";
import {
  select,
  scaleLinear,
  line,
  max,
  curveCardinal,
  axisBottom,
  axisLeft,
  zoom,
  scaleTime
} from "d3";
import useResizeObserver from "./useResizeObserver";

function max_price(prices) {
  let max_price = -1;
  prices.forEach((price) => {
    if (price.value > max_price) {
      max_price = price.value;
    }
  });
  return max_price;
}

function ZoomableLineChart({
  data,
  id = "myZoomableLineChart"
}) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [currentZoomState, setCurrentZoomState] = useState();

  //fixing raw stock data
  var prices = [];
  data[0]["values"].forEach((v) => {
    prices.push({
      datetime: Date.parse(v["datetime"]),
      value: Number(v["open"])
    });
  });
  prices = prices.reverse();

  useEffect(() => {
    const svg = select(svgRef.current);
    const svgContent = svg.select(".content");
    const {
      width,
      height
    } =
    dimensions || wrapperRef.current.getBoundingClientRect();

    // scales + line generator

    const xScale = scaleTime()
      .domain([prices.at(0).datetime, prices.at(-1).datetime])
      .range([0, width]);

    if (currentZoomState) {
      const newXScale = currentZoomState.rescaleX(xScale);
      xScale.domain(newXScale.domain());
    }

    const yScale = scaleLinear()
      .domain([0, max_price(prices)])
      .range([height, 0]);

    //Lines
    svgContent.selectAll("path").remove();

    svgContent.append("path")
      .datum(prices)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", line()
        .x(function(d) {
          return xScale(d.datetime)
        })
        .y(function(d) {
          return yScale(d.value)
        })
      );

    //Hover info
    svg
      .on("mousemove", function(event) {

        let bbox = svg.node().getBoundingClientRect();
        let x = event.clientX - bbox.left;
        let y = event.clientY - bbox.top;

        let price = prices.find(e => e.datetime == xScale.invert(x));

        let closest_date_dist = 1E8;
        let closest_price = new Date();

        prices.forEach((e) => {
          let dist = Math.abs(e.datetime - Number(xScale.invert(x)));
          if (dist < closest_date_dist) {
            closest_date_dist = dist;
            closest_price = e;
          }
        });

        if (closest_price === undefined) return;

        svgContent.selectAll("circle").remove();
        svgContent.selectAll("line").remove();
        svgContent.selectAll("tooltip").remove();

        let date = new Date(closest_price.datetime);

        svgContent.append("circle")
          .attr("r", 4.5)
          .attr("cx", function(d) {
            return xScale(date);
          })
          .attr("cy", function(d) {
            return yScale(closest_price.value);
          });

        svgContent.append("line")
          .style("stroke", "steelblue")
          .style("stroke-dasharray", "3,3")
          .style("opacity", 1)
          .attr("x1", function(d) {
            return xScale(date);
          })
          .attr("y1", function(d) {
            return yScale(yScale.domain()[0]);
          })
          .attr("x2", function(d) {
            return xScale(date);
          })
          .attr("y2", function(d) {
            return yScale(closest_price.value);
          });

        svgContent.append("line")
          .style("stroke", "steelblue")
          .style("stroke-dasharray", "3,3")
          .style("opacity", 1)
          .attr("x1", function(d) {
            return xScale(xScale.domain()[0]);
          })
          .attr("y1", function(d) {
            return yScale(closest_price.value);
          })
          .attr("x2", function(d) {
            return xScale(date);
          })
          .attr("y2", function(d) {
            return yScale(closest_price.value);
          });

      });

    //svgContent.datum(prices).attr("d", line().x(function(d) { console.log(d.datetime); return xScale(d.datetime) }));

    //   svgContent.selectAll("path")
    // .on("mouseover", function(d) {
    //       div.transition()
    //          .duration(200)
    //          .style("opacity", .9);
    //       div.html(formatCount(d.total_km) + " km" + "<br/>" + formatTime(d.date))
    //          .style("left", (d3.event.pageX - 20) + "px")
    // 		     .style("top", (d3.event.pageY + 6) + "px");
    //       //selects the horizontal dashed line in the group
    //       d3.select(this.nextElementSibling).transition()
    //           .duration(200)
    //           .style("opacity", .9);
    //       //selects the vertical dashed line in the group
    //       d3.select(this.nextElementSibling.nextElementSibling).transition()
    //           .duration(200)
    //           .style("opacity", .9);
    //       })

    // axes
    const xAxis = axisBottom(xScale);
    svg
      .select(".x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    const yAxis = axisLeft(yScale);
    svg.select(".y-axis").call(yAxis);

    // zoom
    const zoomBehavior = zoom()
      .scaleExtent([1, 500])
      .translateExtent([
        [0, 0],
        [width, height],
      ])
      .on("zoom", (event) => {
        const zoomState = event.transform;
        setCurrentZoomState(zoomState);
      });

    svg.call(zoomBehavior);

  }, [currentZoomState, data, dimensions]);

  return ( <
    React.Fragment >
    <
    h1 > APPL < /h1> <
    div ref = {
      wrapperRef
    }
    style = {
      {
        marginBottom: "2rem"
      }
    } >
    <
    svg ref = {
      svgRef
    } >
    <
    defs >
    <
    clipPath id = {
      id
    } >
    <
    rect x = "0"
    y = "0"
    width = "100%"
    height = "100%" / >
    <
    /clipPath> < /
    defs > <
    g className = "content"
    clipPath = {
      `url(#${id})`
    } > < /g> <
    g className = "x-axis" / >
    <
    g className = "y-axis" / >
    <
    /svg> < /
    div > <
    /React.Fragment>

  );
}

export default ZoomableLineChart;