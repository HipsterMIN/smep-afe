import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const DateBarChart = ({ data,legend, height = 400 }) => {
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
    const margin = { top: 80, right: 30, bottom: 60, left: 50 }; // 툴팁 공간을 위해 top 마진 확보
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);
    
    svg.selectAll('*').remove();

    // 1. 툴팁 컨테이너 (부모 div 기준 절대 좌표)
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

    // 2. 스케일 설정
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.date))
      .range([0, innerWidth])
      .padding(0.2);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) * 1.1 || 60])
      .range([innerHeight, 0]);

    // 3. 축 및 배경선
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickValues(xScale.domain().filter((d, i) => i % Math.ceil(data.length / 12) === 0)))
      .style("font-size", "11px")
      .style("color", "#666");

    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(yScale).ticks(10).tickSize(-innerWidth).tickFormat(""))
      .selectAll(".tick line")
      .attr("stroke", "#eee")
      .attr("stroke-dasharray", "2,2");

    // 4. 막대 그리기
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

        // 툴팁 내용 및 화살표 레이아웃
        tooltip.style("visibility", "visible")
          .html(`
            <div style="background: #333; color: #fff; padding: 10px; border-radius: 4px; font-size: 12px; min-width: 160px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
              <div style="border-bottom: 1px solid #555; padding-bottom: 5px; margin-bottom: 5px; text-align: center; font-weight: bold;">${d.date}</div>
              <div style="display: flex; justify-content: space-between;">
                <span><span style="display:inline-block; width:8px; height:8px; background:#1C92FF; margin-right:5px;"></span>정색자금 상담 접수 건수</span>
                <span style="font-weight: bold; margin-left: 10px;">${d.value}</span>
              </div>
            </div>
            <div style="width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 8px solid #333; margin-top: -1px;"></div>
          `);

        // 툴팁 위치 계산 (막대 상단 중앙)
        const barWidth = xScale.bandwidth();
        const xPos = margin.left + xScale(d.date) + barWidth / 2;
        const yPos = margin.top + yScale(d.value);

        tooltip
          .style("left", `${xPos}px`)
          .style("top", `${yPos}px`)
          .style("transform", "translate(-50%, -110%)"); // 중앙 정렬 및 막대 위로 띄움
      })
      .on("mouseout", function() {
        d3.select(this).attr("fill", "#1C92FF");
        tooltip.style("visibility", "hidden");
      });

  }, [data, dimensions]);

  return (
    <div ref={containerRef} style={{ width: '100%', position: 'relative'}}>
      <svg ref={svgRef}></svg>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', fontSize: '12px', color: '#666' }}>
        <span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#1C92FF', marginRight: '5px' }}></span>
        {legend && legend}
      </div>
    </div>
  );
};

export default DateBarChart;