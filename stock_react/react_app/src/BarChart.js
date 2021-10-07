import React, {useRef, useEffect, useState} from 'react'
import {select, axisBottom, axisRight, scaleLinear, scaleBand, line, curveCardinal} from "d3"

const useResizeObserver = (ref) => {

  const [dimensions, setDimensions] = useState(null);

  useEffect(() => {
    const observeTarget = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach(entry => {
        setDimensions(entry.contentRect)
      })
    });

    resizeObserver.observe(observeTarget);
    return () => {
      resizeObserver.unobserve(observeTarget)
    }

  }, [ref]);
  return dimensions;
}

function BarChart({data}){

    var date_price = [];

    data[0]["values"].forEach((v) => {
      // date_price[v["datetime"]] = v["open"];
      date_price.push(v["open"]);
    });

    date_price = date_price.reverse();

    console.log(date_price);

    const svgRef = useRef();

    const wrapperRef = useRef();

    const dimensions = useResizeObserver(wrapperRef);

    useEffect(() => {
      const svg = select(svgRef.current);
      const myLine = line()
        .x((value, index) => index * 0.1)
        .y(value => 150 - value)
        .curve(curveCardinal);

    svg
      .selectAll("path")
      .data([date_price])
      .join("path")
      .attr("d", value => myLine(value))
      .attr("fill", "none")
      .attr("stroke", "blue");


    }, [data]);

    return(
      <div ref={wrapperRef} style={{marginBottom: "2rem"}}>
        <svg ref={svgRef}>
          <g className="x-axis"/>
          <g className="y-axis"/>
        </svg>
      </div>
    );
}

export default BarChart;
