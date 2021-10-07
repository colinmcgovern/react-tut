import React, {useRef, useEffect} from "react"
import {select, min, max, scaleTime, axisBottom, scaleLinear} from "d3"
import useResizeObserver from "./useResizeObserver"

const getDate = dateString => {
  const date = dateString.split("-");
  return new Date(date[2],date[0]-1,date[1]);
};

function days_between(date1, date2) {

    // The number of milliseconds in one day
    const ONE_DAY = 1000 * 60 * 60 * 24;

    // Calculate the difference in milliseconds
    const differenceMs = Math.abs(date1 - date2);

    // Convert back to days and return
    return Math.round(differenceMs / ONE_DAY);

}

function AddOrSubractDays(startingDate, number, add) {
  if (add) {
    return new Date(startingDate + 24 * number);
  } else {
    return new Date(startingDate - 24 * number);
  }
}

function BBTimeline({data, highlight, zoom_percent}) {

  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  useEffect(() => {

    const svg = select(svgRef.current);
    if(!dimensions) return;

    const minDate = min(data, episode => getDate(episode.air_date));
    const maxDate = max(data, episode => getDate(episode.air_date));

    if(!minDate || !maxDate) return;

    console.log("zoom_percent",zoom_percent)
    console.log("minDate",minDate)
    console.log("maxDate",maxDate,typeof(maxDate))

    if(zoom_percent < 1){
      zoom_percent = 1
    }

    let day_range = days_between(minDate,maxDate) * zoom_percent
    console.log("day_range",day_range)

    // let leftDate = minDate + ((day_range - days_between(minDate,maxDate)) / 2.0)
    // let rightDate = maxDate + ((day_range - days_between(minDate,maxDate)) / 2.0)

    let crop_days = (day_range - days_between(minDate,maxDate)) / 2.0;
    console.log(parseInt(crop_days))

    let leftDate = AddOrSubractDays(minDate,crop_days,1)
    let rightDate = AddOrSubractDays(maxDate,crop_days,0)

    console.log("leftDate",leftDate)
    console.log("rightDate",rightDate)

    const xScale = scaleTime()
      .domain([leftDate, rightDate])
      .range([0,dimensions.width]);

    const yScale = scaleLinear()
      .domain([max(data, episode => episode.characters.length), 0])
      .range([0,dimensions.height])

    svg.selectAll(".episode")
      .data(data)
      .join("line")
      .attr("class", "episode")
      .attr("stroke", episode =>
        episode.characters.includes(highlight) ? "blue" : "black")
      .attr("x1", episode => xScale(getDate(episode.air_date)))
      .attr("x2", episode => xScale(getDate(episode.air_date)))
      .attr("y1", dimensions.height)
      .attr("y2", episode => yScale(episode.characters.length));

    const xAxis = axisBottom(xScale);
    svg
    .select(".x-axis")
    .style("transform",`translateY(${dimensions.height}px)`)
    .call(xAxis);

  }, [data,dimensions,highlight,zoom_percent])

  return (
      <div ref={wrapperRef} style={{marginBottom: "2rem"}}>
        <svg ref={svgRef}>
            <g className="x-axis"/>
        </svg>
      </div>
  );

}

export default BBTimeline
