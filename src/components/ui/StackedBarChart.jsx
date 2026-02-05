import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const StackedBarChart = ({ data, height = 400, colors = ["#1C92FF", "#FF8A00"], chartTitle, legend=[] }) => {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (!data || data.length === 0 || width === 0) return;

    const margin = { top: 20, right: 30, bottom: 40, left: 130 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);
    
    svg.selectAll('*').remove();

    // 툴팁 생성
    const tooltip = d3.select(containerRef.current)
      .append("div")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "#333")
      .style("color", "#fff")
      .style("padding", "10px")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("z-index", "100")
      .style("box-shadow", "0 4px 6px rgba(0,0,0,0.3)")
      .style("transition", "all 0.1s ease-out");

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const keys = ["visitor", "pageview"];
    const stack = d3.stack().keys(keys);
    const stackedData = stack(data);

    const yScale = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, innerHeight])
      .padding(0.4);

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(stackedData, d => d3.max(d, d => d[1]))])
      .nice()
      .range([0, innerWidth]);

    const colorScale = d3.scaleOrdinal().domain(keys).range(colors);

    g.append('g')
      .call(d3.axisLeft(yScale).tickSize(0))
      .selectAll('text')
      .style('font-size', '12px');

    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(Math.max(width / 100, 2)).tickFormat(d3.format(",")))
      .style('color', '#999');

    // 누적 막대 그리기 (호버 이벤트 추가)
    g.append('g')
      .selectAll('g')
      .data(stackedData)
      .enter().append('g')
        .attr('fill', d => colorScale(d.key))
      .selectAll('rect')
      .data(d => d)
      .enter().append('rect')
        .attr('y', d => yScale(d.data.label))
        .attr('x', d => xScale(d[0]))
        .attr('width', d => xScale(d[1]) - xScale(d[0]))
        .attr('height', yScale.bandwidth())
        .style('cursor', 'pointer')
        .on('mouseover', function(event, d) {
          const key = d3.select(this.parentNode).datum().key;
          const value = d.data[key];
          const labelName = legend[keys.indexOf(key)] || key;
          
          d3.select(this).style('opacity', 0.8);
          
          tooltip
            .style("visibility", "visible")
            .html(`
              <div style="border-bottom: 1px solid #555; padding-bottom: 5px; margin-bottom: 5px; font-weight: bold;">
                ${d.data.label}
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>
                  <span style="display:inline-block; width:8px; height:8px; background:${colorScale(key)}; margin-right:5px;"></span>
                  ${labelName}
                </span>
                <span style="font-weight: bold; margin-left: 15px;">${value.toLocaleString()}</span>
              </div>
            `);
        })
        .on('mousemove', function(event) {
          tooltip
            .style("left", `${event.pageX - containerRef.current.getBoundingClientRect().left + 10}px`)
            .style("top", `${event.pageY - containerRef.current.getBoundingClientRect().top - 10}px`);
        })
        .on('mouseout', function() {
          d3.select(this).style('opacity', 1);
          tooltip.style("visibility", "hidden");
        });

  }, [data, width, height, colors, legend]);

  return (
    <div ref={containerRef} className="onstackedchart" style={{ width: '100%', minWidth: '300px', position: 'relative' }}>
      {chartTitle && (
        <h4 style={{ marginLeft : '40px' }}>{chartTitle}</h4>
      )}
      <svg ref={svgRef}></svg>
      
      <div className="legend">
        {legend.map((label, i) => (
          <div key={label} className="legend-item" >
            <span className="dot" style={{ backgroundColor: colors[i] }}></span>
            <span className="text-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StackedBarChart;