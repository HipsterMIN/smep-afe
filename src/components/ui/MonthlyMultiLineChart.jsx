import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const MonthlyMultiLineChart = ({
  data,
  configurations,
  height = 320,
  xKey = "month",
  yDomain = [0, 100],
  showDots = true,
  dotRadius = 5,
}) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height });

  useEffect(() => {
    const observeTarget = containerRef.current;
    if (!observeTarget) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    ro.observe(observeTarget);
    return () => ro.disconnect();
  }, [height]);

  useEffect(() => {
    if (!data?.length || !configurations?.length || dimensions.width === 0) return;

    const { width } = dimensions;

    const margin = { top: 30, right: 24, bottom: 50, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove();

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

      const xDomain = data.map((d) => d[xKey]);

    const xScale = d3
      .scalePoint()
      .domain(xDomain)
      .range([0, innerWidth])
      .padding(0.5);

    const yScale = d3
      .scaleLinear()
      .domain(yDomain)
      .nice()
      .range([innerHeight, 0]);

    g.selectAll(".h-grid")
      .data(yScale.ticks(5))
      .enter()
      .append("line")
      .attr("class", "h-grid")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke", "#e5e7eb");

    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(xAxis)
      .call((ax) => ax.select(".domain").remove())
      .selectAll("text")
      .style("font-size", "12px")
      .style("fill", "#111827");

    const yAxis = d3.axisLeft(yScale).ticks(5).tickSizeOuter(0);

    g.append("g")
      .call(yAxis)
      .call((ax) => ax.select(".domain").remove())
      .selectAll("text")
      .style("font-size", "12px")
      .style("fill", "#6b7280");


    const makeLine = (key) =>
      d3
        .line()
        .defined((d) => d[key] != null)
        .x((d) => xScale(d[xKey]))
        .y((d) => yScale(d[key]));


    configurations.forEach((cfg) => {
      // line
      g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", cfg.color)
        .attr("stroke-width", 2.5)
        .attr("d", makeLine(cfg.key));

      if (showDots) {
        g.selectAll(`.dot-${cfg.key}`)
          .data(data.filter((d) => d[cfg.key] != null))
          .enter()
          .append("circle")
          .attr("class", `dot-${cfg.key}`)
          .attr("cx", (d) => xScale(d[xKey]))
          .attr("cy", (d) => yScale(d[cfg.key]))
          .attr("r", dotRadius)
          .attr("fill", cfg.color)
          .attr("stroke", "#fff")
          .attr("stroke-width", 2);
      }
    });

    const legend = g.append("g").attr("class", "legend");

    const legendY = -15;
    const itemGap = 18;
    const dotR = 5;

    const items = legend
      .attr("transform", `translate(0, ${legendY})`)
      .selectAll(".legend-item")
      .data(configurations)
      .enter()
      .append("g")
      .attr("class", "legend-item");

    items
      .append("circle")
      .attr("cx", dotR)
      .attr("cy", 0)
      .attr("r", dotR)
      .attr("fill", (d) => d.color);

    items
      .append("text")
      .attr("x", dotR * 2 + 6)
      .attr("y", 4)
      .text((d) => d.label)
      .style("font-size", "12px")
      .style("fill", "#111827");

    // 실제 폭 계산해서 우측 정렬
    let xCursor = 0;
    items.each(function () {
      const node = d3.select(this).node();
      const { width: w } = node.getBBox();

      d3.select(this).attr("transform", `translate(${xCursor}, 0)`);
      xCursor += w + itemGap;
    });

    const legendTotalWidth = Math.max(0, xCursor - itemGap);
    const legendX = Math.max(0, innerWidth - legendTotalWidth);

    legend.attr("transform", `translate(${legendX}, ${legendY})`);
  }, [data, configurations, dimensions.width, height, xKey, yDomain, showDots, dotRadius]);

  return (
    <div ref={containerRef} style={{ width: "100%", minHeight: height }}>
      <svg ref={svgRef} style={{ display: "block" }} />
    </div>
  );
};

export default MonthlyMultiLineChart;