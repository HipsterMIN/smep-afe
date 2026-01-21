import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const BarChart = ({ data, height = 300, color = "#1C92FF" }) => {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const [width, setWidth] = useState(0);

  // 부모 컨테이너 너비 감지 (반응형)
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

    // 1. 여백 설정 (X축 라벨이 기울어지므로 하단 여백을 넉넉히 잡음)
    const margin = { top: 20, right: 20, bottom: 50, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);
    
    svg.selectAll('*').remove();

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // 2. 스케일 설정
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.date))
      .range([0, innerWidth])
      .padding(0.3); // 막대 사이 간격

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .nice()
      .range([innerHeight, 0]);

    // 3. 축 그리기
    // Y축
    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .style('color', '#999')
      .selectAll('text')
      .style('font-size', '11px');

    // X축 (날짜 라벨 사선 처리)
    const xAxis = g.append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale));

    xAxis.selectAll('text')
      .attr('transform', 'rotate(-45)') // 45도 회전
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .style('font-size', '10px')
      .style('color', '#666');

    // 4. 막대 그리기
    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.date))
      .attr('y', d => yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', d => innerHeight - yScale(d.value))
      .attr('fill', color)
      .style('cursor', 'pointer')
      .on('mouseover', function() { d3.select(this).attr('opacity', 0.7); })
      .on('mouseout', function() { d3.select(this).attr('opacity', 1); });

  }, [data, width, height, color]);

  return (
    <div ref={containerRef} style={{ width: '100%', overflow: 'hidden' }}>
      <h4 style={{ fontSize: '14px', marginBottom: '10px', color: '#333' }}>일별 방문자(최근 30일)</h4>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default BarChart;