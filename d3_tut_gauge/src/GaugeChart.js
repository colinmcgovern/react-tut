import React, {useRef, useEffect} from "react"
import {select, arc, pie} from "d3"
import useResizeObserver from "./useResizeObserver"

function GaugeChart({data}) {

  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  useEffect(() => {

    const svg = select(svgRef.current);
    if(!dimensions) return;

    const arcGenerator = arc().innerRadius(75).outerRadius(150);

    const pieGenerator = pie();
    const instructions = pieGenerator(data);

    svg
      .selectAll(".slice")
      .data(data)
      .join("path")
      .attr("class","slice")
      .attr("stroke","black")
      .attr("fill","none")
      .attr("d", instruction=>arcGenerator(instruction))

  }, [data,dimensions])

  return (
    <div ref={wrapperRef} style={{marginBottom: "2rem"}}>
      <svg ref={svgRef}></svg>
    </div>
  );

}

export default GaugeChart
