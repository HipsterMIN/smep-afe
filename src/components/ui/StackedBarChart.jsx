import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const StackedBarChart = ({ data, height = 400, colors = ["#1C92FF", "#FF8A00"], chartTitle }) => {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const [width, setWidth] = useState(0);

  // 1. 부모 컨테이너의 너비를 실시간으로 감지
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

    // 2. 마진 및 내부 너비 계산
    const margin = { top: 20, right: 30, bottom: 40, left: 130 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);
    
    svg.selectAll('*').remove();

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // 3. 누적 데이터 설정
    const keys = ["visitor", "pageview"];
    const stack = d3.stack().keys(keys);
    const stackedData = stack(data);

    // 4. 스케일 설정 (width에 반응함)
    const yScale = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, innerHeight])
      .padding(0.4);

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(stackedData, d => d3.max(d, d => d[1]))])
      .nice()
      .range([0, innerWidth]);

    const colorScale = d3.scaleOrdinal().domain(keys).range(colors);

    // 5. 축 그리기
    g.append('g')
      .call(d3.axisLeft(yScale).tickSize(0))
      .selectAll('text')
      .style('font-size', '12px');

    g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(Math.max(width / 100, 2)).tickFormat(d3.format(",")))
      .style('color', '#999');

    // 6. 누적 막대 그리기
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
        .attr('height', yScale.bandwidth());

  }, [data, width, height, colors]);

  return (
    <div ref={containerRef} className="onstackedchart" style={{ width: '100%', minWidth: '300px' }}>
      {chartTitle && (
        <h4 style={{ marginLeft : '40px' }}>{chartTitle}</h4>
      )}
      <svg ref={svgRef}></svg>
      
      <div className="legend">
        {["방문자수", "페이지뷰"].map((label, i) => (
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