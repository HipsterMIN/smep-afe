import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const DateBarChart = ({ data, legend, height = 500 }) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: height });

  useEffect(() => {
    const observeTarget = containerRef.current;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({ width: entry.contentRect.width, height });
      }
    });
    if (observeTarget) resizeObserver.observe(observeTarget);
    return () => resizeObserver.disconnect();
  }, [height]);

  useEffect(() => {
    if (!data || data.length === 0 || dimensions.width === 0) return;

    const { width, height } = dimensions;
    const margin = { top: 80, right: 30, bottom: 60, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);
    
    svg.selectAll('*').remove();

    const tooltip = d3.select(containerRef.current)
      .append("div")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("display", "flex")
      .style("flex-direction", "column")
      .style("align-items", "center")
      .style("pointer-events", "none")
      .style("z-index", "100")
      .style("transition", "all 0.1s ease-out");

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.date))
      .range([0, innerWidth])
      .padding(0.6); // 0.2에서 0.6으로 증가 (막대가 더 얇아짐)

    const maxValue = d3.max(data, d => d.value) || 60;
    const yScale = d3.scaleLinear()
      .domain([0, maxValue * 1.1])
      .range([innerHeight, 0]);

    // X축 (년도 레이블 간격 자동 조정)
    const tickInterval = Math.max(1, Math.ceil(data.length / 8));
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickValues(
        xScale.domain().filter((d, i) => i % tickInterval === 0)
      ))
      .style("font-size", "11px")
      .style("color", "#666")
      .select(".domain")
      .remove();

    // Y축 (눈금값 표시)
    g.append('g')
      .call(d3.axisLeft(yScale)
        .ticks(5)
        .tickSize(0)
        .tickPadding(8)
      )
      .style("font-size", "11px")
      .style("color", "#666")
      .select(".domain")
      .remove();

    // 그리드 라인
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(yScale).ticks(5).tickSize(-innerWidth).tickFormat(""))
      .select(".domain")
      .remove();
    
    g.selectAll(".grid .tick line")
      .attr("stroke", "#eee")
      .attr("stroke-dasharray", "2,2");

    // 막대 그리기
    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", d => xScale(d.date))
      .attr("y", d => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("height", d => innerHeight - yScale(d.value))
      .attr("fill", "#1C92FF")
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this).attr("fill", "#0078D4");

        tooltip.style("visibility", "visible")
          .html(`
            <div style="background: #333; color: #fff; padding: 10px; border-radius: 4px; font-size: 12px; min-width: 160px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
              <div style="border-bottom: 1px solid #555; padding-bottom: 5px; margin-bottom: 5px; text-align: center; font-weight: bold;">${d.date}</div>
              <div style="display: flex; justify-content: space-between;">
                <span><span style="display:inline-block; width:8px; height:8px; background:#1C92FF; margin-right:5px;"></span>${legend}</span>
                <span style="font-weight: bold; margin-left: 10px;">${d.value}</span>
              </div>
            </div>
            <div style="width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 8px solid #333; margin-top: -1px;"></div>
          `);

        const barWidth = xScale.bandwidth();
        const xPos = margin.left + xScale(d.date) + barWidth / 2;
        const yPos = margin.top + yScale(d.value);

        tooltip
          .style("left", `${xPos}px`)
          .style("top", `${yPos}px`)
          .style("transform", "translate(-50%, -110%)");
      })
      .on("mouseout", function() {
        d3.select(this).attr("fill", "#1C92FF");
        tooltip.style("visibility", "hidden");
      });

  }, [data, dimensions]);

  return (
    <div ref={containerRef} className="ondatechart" style={{ width: '100%', position: 'relative'}}>
      <svg ref={svgRef}></svg>
      {legend && (
        <div className="legend-item">
          <span className="dot" style={{ background: '#1C92FF'}}></span>
          <span className="text-label">{legend}</span>
        </div>
      )}
    </div>
  );
};

export default DateBarChart;