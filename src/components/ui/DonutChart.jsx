import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const DonutChart = ({ data = [], width = 250, height = 250, legendType, customColors }) => {
  const svgRef = useRef(null);

  // 기본 컬러 팔레트
  const defaultColors = ["#1C92FF", "#00DB99", "#FFB119", "#FF4560", "#775DD0", "#008FFB"];
  const colorScale = d3.scaleOrdinal().range(customColors || defaultColors);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // 데이터가 1개일 경우(Single), 100%를 채우기 위한 배경 데이터 추가
    let chartData = [...data];
    const isSingle = data.length === 1;
    
    if (isSingle) {
      const remainingValue = Math.max(0, 100 - data[0].value);
      chartData.push({ 
        label: '_background', 
        value: remainingValue, 
        isBackground: true 
      });
    }

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height); // height 값 적용
    
    svg.selectAll('*').remove();

    const radius = Math.min(width, height) / 2 - 40;
    
    const chartGroup = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const tooltipLayer = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`)
      .style('pointer-events', 'none');

    const pie = d3.pie()
      .value(d => d.value)
      .sort(null); // 데이터 순서 유지

    const arc = d3.arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius);
    
    const labelArc = d3.arc()
      .innerRadius(radius * 0.85)
      .outerRadius(radius * 0.85);

    // 차트 조각 그리기
    const arcs = chartGroup.selectAll('path')
      .data(pie(chartData))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => {
        // 배경 데이터면 회색, 아니면 컬러 스케일 적용
        if (d.data.isBackground) return "#F3F4F6"; 
        return colorScale(i);
      })
      .attr('stroke', '#fff')
      .style('stroke-width', '2px')
      .style('cursor', d => d.data.isBackground ? 'default' : 'pointer');

    // 툴팁 로직 (배경 데이터는 제외)
    arcs.filter(d => !d.data.isBackground)
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 0.8);

        const [x, y] = labelArc.centroid(d);
        const tooltip = tooltipLayer.append('g')
          .attr('class', 'active-tooltip')
          .attr('transform', `translate(${x}, ${y})`);

        tooltip.append('rect')
          .attr('x', -45)
          .attr('y', -25)
          .attr('width', 90)
          .attr('height', 28)
          .attr('rx', 4)
          .attr('fill', '#333'); // 툴팁 배경색 수정

        tooltip.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '-7px')
          .style('fill', 'white')
          .style('font-size', '11px')
          .style('font-weight', 'bold')
          .text(`${d.data.label}: ${d.data.value}%`);
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 1);
        tooltipLayer.selectAll('.active-tooltip').remove();
      });

  }, [data, width, height, customColors]);

  return (
    <div className={`ondonutchart ${legendType || ''}`}>
      <svg ref={svgRef}></svg>
      {/* 라벨 영역: 실제 데이터(isBackground가 아닌 것)만 출력 */}
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