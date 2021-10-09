import React, { useRef, useEffect, useState } from "react";
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


function ZoomableLineChart({ data, id = "myZoomableLineChart" }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const [currentZoomState, setCurrentZoomState] = useState();

  //fixing raw stock data
  var prices = [];
  data[0]["values"].forEach((v) => {
    prices.push(Number(v["open"]));
  });
  prices = prices.reverse();

  var dates = [];
  data[0]["values"].forEach((v) => {
    dates.push(v["datetime"]);
  });
  dates = dates.reverse();

  useEffect(() => {
    const svg = select(svgRef.current);
    const svgContent = svg.select(".content");
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    // scales + line generator
    console.log(dates)
    console.log(Date(dates[0]));
    console.log(Date(dates[dates.length-1]));

    const xScale = scaleTime()
      .domain([Date.parse(dates[0]), Date.parse(dates[dates.length-1])])
      .range([10, width - 10]);

    if (currentZoomState) {
      const newXScale = currentZoomState.rescaleX(xScale);
      xScale.domain(newXScale.domain());
    }

    const yScale = scaleLinear()
      .domain([0, max(prices)])
      .range([height - 10, 10]);

    const lineGenerator = line()
      .x((d, index) => xScale(index))
      .y((d) => yScale(d))
      .curve(curveCardinal);

    // render the line
    svgContent
      .selectAll(".myLine")
      .data([prices])
      .join("path")
      .attr("class", "myLine")
      .attr("stroke", "black")
      .attr("fill", "none")
      .attr("d", lineGenerator);

    svgContent
      .selectAll(".myDot")
      .data(prices)
      .join("circle")
      .attr("class", "myDot")
      .attr("stroke", "black")
      .attr("r", 1)
      .attr("fill", "blue")
      .attr("cx", (value, index) => xScale(index))
      .attr("cy", yScale);

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

  return (
    <React.Fragment>
      <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
        <svg ref={svgRef}>
          <defs>
            <clipPath id={id}>
              <rect x="0" y="0" width="100%" height="100%" />
            </clipPath>
          </defs>
          <g className="content" clipPath={`url(#${id})`}></g>
          <g className="x-axis" />
          <g className="y-axis" />
        </svg>
      </div>
    </React.Fragment>

  );
}

export default ZoomableLineChart;
