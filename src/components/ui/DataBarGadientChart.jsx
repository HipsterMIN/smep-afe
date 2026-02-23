import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const DataBarGadientChart = ({
  data,
  height = 360,
  valueSuffix = "건",
  tooltipDateFormatter,
}) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height });

  useEffect(() => {
    const observeTarget = containerRef.current;
    if (!observeTarget) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({ width: entry.contentRect.width, height });
      }
    });
    resizeObserver.observe(observeTarget);
    return () => resizeObserver.disconnect();
  }, [height]);

  useEffect(() => {
    if (!data?.length || dimensions.width === 0) return;

    const { width } = dimensions;

    const margin = { top: 34, right: 22, bottom: 52, left: 54 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);
    svg.selectAll("*").remove();

    d3.select(containerRef.current).selectAll(".d3-tooltip").remove();

    const tooltip = d3
      .select(containerRef.current)
      .append("div")
      .attr("class", "d3-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("pointer-events", "none")
      .style("z-index", "9999");

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const defs = svg.append("defs");

    const gradient = defs
      .append("linearGradient")
      .attr("id", "barGradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "0%")
      .attr("y2", "0%");

    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#2563eb");
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "#10b981");

    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.date))
      .range([0, innerWidth])
      .padding(0.6);

    const yScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([innerHeight, 0]);

    g.append("g")
      .call(d3.axisLeft(yScale).tickValues([0, 20, 40, 60, 80, 100]).tickSize(0).tickPadding(10))
      .call((gg) => gg.select(".domain").remove())
      .selectAll("text")
      .style("font-size", "12px")
      .style("fill", "#6b7280");

    g.append("g")
      .attr("class", "grid")
      .call(
        d3.axisLeft(yScale)
          .tickValues([0, 20, 40, 60, 80, 100])
          .tickSize(-innerWidth)
          .tickFormat("")
      )
      .call((gg) => gg.select(".domain").remove());

    g.selectAll(".grid .tick line").attr("stroke", "#eef2f7");

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickSize(0))
      .call((gg) => gg.select(".domain").remove())
      .selectAll("text")
      .style("font-size", "12px")
      .style("fill", "#111827")
      .attr("dy", "1.3em");

    const roundedTopRectPath = (x, y, w, h, r) => {
      const rr = Math.max(0, Math.min(r, w / 2, h));
      const p = d3.path();
      p.moveTo(x, y + rr);
      p.arcTo(x, y, x + rr, y, rr);
      p.lineTo(x + w - rr, y);
      p.arcTo(x + w, y, x + w, y + rr, rr);
      p.lineTo(x + w, y + h);
      p.lineTo(x, y + h);
      p.closePath();
      return p.toString();
    };

    const barRadius = 8;

    const bars = g
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("path")
      .attr("class", "bar")
      .attr("fill", "url(#barGradient)")
      .style("cursor", "pointer")
      .attr("d", (d) => {
        const x = xScale(d.date);
        const y = yScale(d.value);
        const w = xScale.bandwidth();
        const h = innerHeight - y;
        return roundedTopRectPath(x, y, w, h, barRadius);
      });

    const formatValue = d3.format(",");

    const defaultDateFormatter = (dateStr) => {
      const m = parseInt(dateStr.slice(0, 2), 10);
      const dd = parseInt(dateStr.slice(3, 5), 10);
      return `${m}월${dd}일`;
    };

    const dateLabel = (d) =>
      typeof tooltipDateFormatter === "function"
        ? tooltipDateFormatter(d.date)
        : defaultDateFormatter(d.date);

    bars
      .on("mousemove", function (event, d) {
        const xBand = xScale(d.date);
        const barW = xScale.bandwidth();
        const xPos = margin.left + xBand + barW / 2;
        const yPos = margin.top + yScale(d.value);

        tooltip
          .style("visibility", "visible")
          .html(`
            <div style="
              background:#ffffff;
              border:1px solid #eef2f7;
              border-radius:8px;
              box-shadow:0 8px 18px rgba(0,0,0,0.12);
              padding:10px 14px;
              display:flex;
              gap:12px;
              align-items:center;
              font-size:14px;
              white-space:nowrap;
            ">
              <div style="font-weight:600;">${dateLabel(d)}</div>
              <div style="font-weight:800;color:#2563eb;">${formatValue(d.value)}${valueSuffix}</div>
            </div>
          `)
          .style("left", `${xPos}px`)
          .style("top", `${yPos}px`)
          .style("transform", "translate(-50%, -130%)");
      })
      .on("mouseleave", function () {
        tooltip.style("visibility", "hidden");
      });

    return () => {
      d3.select(containerRef.current).selectAll(".d3-tooltip").remove();
    };
  }, [data, dimensions.width, height, valueSuffix, tooltipDateFormatter]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        position: "relative",
        borderRadius: 16,
        background: "#fff",
      }}
    >
      <svg ref={svgRef} style={{ display: "block" }} />
    </div>
  );
};

export default DataBarGadientChart;