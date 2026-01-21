import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const DonutChart = ({ data, width = 250, height = 250, legendType, customColors }) => {
  const svgRef = useRef(null);

  const colorScale = d3.scaleOrdinal()
    .range(customColors || ["#1C92FF", "#00DB99", "#FFB119", "#FF4560", "#775DD0", "#008FFB"]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', width);
    svg.selectAll('*').remove();

    const radius = width / 2 - 40;
    
    // 1. 차트 그룹 
    const chartGroup = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${width / 2})`);

    // 2. 툴팁 그룹 
    const tooltipLayer = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${width / 2})`)
      .style('pointer-events', 'none'); // 마우스 이벤트 방해 금지

    const pie = d3.pie().value(d => d.value).sort(null);
    const arc = d3.arc().innerRadius(radius * 0.6).outerRadius(radius);
    
    // 툴팁 위치용 arc 
    const labelArc = d3.arc()
      .innerRadius(radius * 0.85)
      .outerRadius(radius * 0.85);

    // 차트 조각 그리기
    const arcs = chartGroup.selectAll('path')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => colorScale(i))
      .attr('stroke', '#fff')
      .style('stroke-width', '2px')
      .style('cursor', 'pointer');

    // 툴팁 생성 로직
    arcs.on('mouseover', function(event, d) {
      // 마우스 올린 조각 투명도 조절
      d3.select(this).attr('opacity', 0.8);

      // 툴팁 레이어에 동적으로 추가 (이 시점에 그려지므로 무조건 최상단)
      const [x, y] = labelArc.centroid(d);
      
      const tooltip = tooltipLayer.append('g')
        .attr('class', 'active-tooltip')
        .attr('transform', `translate(${x}, ${y})`);

      // 툴팁 박스
      tooltip.append('rect')
        .attr('x', -45)
        .attr('y', -25)
        .attr('width', 90)
        .attr('height', 28)
        .attr('rx', 4)
        .attr('fill', '#1C92FF');

      // 툴팁 텍스트 추가
      tooltip.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '-7px')
        .style('fill', 'white')
        .style('font-size', '11px')
        .style('font-weight', 'bold')
        .text(`${d.data.label}: ${d.data.value}`);
    })
    .on('mouseout', function() {
      d3.select(this).attr('opacity', 1);
      // 생성된 툴팁 즉시 제거
      tooltipLayer.selectAll('.active-tooltip').remove();
    });

  }, [data, width, customColors]);

  return (
    <div className={`ondonutchart ${legendType ? legendType : ''}`}>
      <svg ref={svgRef}></svg>
      {/* 라벨 영역 */}
      <div className="legend" style={{ maxWidth: width }}>
        {data.map((item, index) => (
          <div key={index} className="legend-item">
            <span className="dot" style={{ backgroundColor: colorScale(index) }}></span>
            <span className="text-label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;