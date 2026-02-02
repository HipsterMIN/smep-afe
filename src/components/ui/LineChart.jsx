import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const LineChart = ({ 
  data, 
  configurations, 
  height = 400, 
  showDots = true 
}) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null); // 부모 크기 감지용
  const [dimensions, setDimensions] = useState({ width: 0, height: height });

  //  부모 컨테이너의 크기 변화 감지 
  useEffect(() => {
    const observeTarget = containerRef.current;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    if (observeTarget) resizeObserver.observe(observeTarget);
    return () => resizeObserver.disconnect();
  }, [height]);

  // 차트 그리기 로직 (dimensions.width가 바뀔 때마다 재실행)
  useEffect(() => {
    if (!data || data.length === 0 || !configurations || dimensions.width === 0) return;

    const { width, height } = dimensions;
    const margin = { top: 30, right: 30, bottom: 60, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);
    
    svg.selectAll('*').remove();

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 스케일 및 축 설정
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => new Date(d.date)))
      .range([0, innerWidth]);

    const allValues = data.flatMap(d => configurations.map(c => d[c.key]));
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(allValues) || 10])
      .nice()
      .range([innerHeight, 0]);

    // 배경 세로 점선
    g.selectAll(".v-grid")
      .data(data)
      .enter()
      .append("line")
      .attr("x1", d => xScale(new Date(d.date)))
      .attr("x2", d => xScale(new Date(d.date)))
      .attr("y1", 0)
      .attr("y2", innerHeight)
      .attr("stroke", "#e5e7eb")
      .attr("stroke-dasharray", "3,3");

    // X축
    const xAxis = d3.axisBottom(xScale)
      .ticks(Math.max(2, Math.floor(width / 100))) // 너비에 따라 tick 개수 조절
      .tickFormat(d3.timeFormat("%Y-%m-%d"));

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "translate(-15,10)rotate(-35)")
      .style("font-size", "11px")
      .style("fill", "#6B7280");

    // Y축
    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .call(g => g.select(".domain").remove())
      .style("font-size", "11px");

    // 라인 생성 및 그리기
    const lineGenerator = (key) => d3.line()
      .x(d => xScale(new Date(d.date)))
      .y(d => yScale(d[key]))
      .curve(d3.curveMonotoneX);

    configurations.forEach((config) => {
      g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', config.color)
        .attr('stroke-width', 2)
        .attr('d', lineGenerator(config.key));

      if (showDots) {
        g.selectAll(`.dot-${config.key}`)
          .data(data)
          .enter()
          .append('circle')
          .attr('cx', d => xScale(new Date(d.date)))
          .attr('cy', d => yScale(d[config.key]))
          .attr('r', 3)
          .attr('fill', config.color)
          .attr('stroke', '#fff');
      }
    });

  }, [data, configurations, dimensions, showDots]);

  return (
    <div ref={containerRef} style={{ width: '100%', minHeight: height }}>
      <svg ref={svgRef} style={{ display: 'block' }}></svg>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '15px' }}>
        {configurations.map((config, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', fontSize: '12px' }}>
            <span style={{ width: '10px', height: '10px', backgroundColor: config.color, marginRight: '5px' }}></span>
            {config.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LineChart;