import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const DonutGraphChart = ({
  data = [],
  width = 980,
  height = 360,
  donutSize = 300,
  customColors,
  hoverExpand = 6,
  safePadding = 10,
}) => {
  const svgRef = useRef(null);
  const wrapRef = useRef(null);
  const tooltipRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);

  const defaultColors = ["#2B66E5", "#083B74", "#5A20C7", "#0C76C6", "#9AB6D8"];
  const colors = customColors?.length ? customColors : defaultColors;
  const colorScale = d3.scaleOrdinal().range(colors);

  useEffect(() => {
    if (!data?.length) return;

    let chartData = [...data];
    const isSingle = data.length === 1;

    if (isSingle) {
      const remainingValue = Math.max(0, 100 - (data[0]?.value ?? 0));
      chartData.push({ label: "_background", value: remainingValue, isBackground: true });
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const pad = Math.max(0, safePadding + hoverExpand);

    const baseSize = donutSize;
    const outerW = baseSize + pad * 2;
    const outerH = baseSize + pad * 2;

    svg.attr("width", outerW).attr("height", outerH);

    const radius = baseSize / 2;
    const innerRadius = radius * 0.58;

    const g = svg.append("g").attr("transform", `translate(${outerW / 2}, ${outerH / 2})`);

    const pie = d3
      .pie()
      .value((d) => d.value)
      .sort(null)
      .padAngle(0.01);

    const arc = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .cornerRadius(2);

    const arcHover = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(radius + hoverExpand)
      .cornerRadius(2);

    const arcs = g
      .selectAll("path")
      .data(pie(chartData))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => (d.data.isBackground ? "#F3F4F6" : colorScale(i)))
      .attr("stroke", "none")
      .style("cursor", (d) => (d.data.isBackground ? "default" : "pointer"));

    const formatPct = (v) => `${Math.round(v)}%`;

    const showTooltip = (d, idx) => {
      if (d.data.isBackground) return;

      setActiveIndex(idx);

      const wrap = wrapRef.current;
      const tip = tooltipRef.current;
      const svgEl = svgRef.current;
      if (!wrap || !tip || !svgEl) return;

      const rect = wrap.getBoundingClientRect();
      const svgRect = svgEl.getBoundingClientRect();

      const [cx, cy] = arc.centroid(d);

      const donutLeftInWrap = svgRect.left - rect.left;
      const donutTopInWrap = svgRect.top - rect.top;

      const x = donutLeftInWrap + outerW / 2 + cx;
      const y = donutTopInWrap + outerH / 2 + cy;

      tip.style.visibility = "visible";
      tip.style.left = `${x}px`;
      tip.style.top = `${y}px`;
      tip.style.transform = "translate(-50%, 18px)";
      tip.innerHTML = `
        <div style="
          background:#ffffff;
          border:1px solid #E5E7EB;
          border-radius:8px;
          box-shadow:0 10px 18px rgba(0,0,0,0.12);
          padding:12px 16px;
          display:flex;
          align-items:center;
          gap:12px;
          white-space:nowrap;
          font-size:15px;
          color:#111827;
        ">
          <div style="font-weight:600;">${d.data.label}</div>
          <div style="font-weight:800;color:#2563EB;">${formatPct(d.data.value)}</div>
        </div>
      `;
    };

    const hideTooltip = () => {
      setActiveIndex(null);
      const tip = tooltipRef.current;
      if (tip) tip.style.visibility = "hidden";
    };

    arcs
      .filter((d) => !d.data.isBackground)
      .on("mouseenter", function (event, d) {
        d3.select(this).attr("d", arcHover);
        showTooltip(d, d.index);
      })
      .on("mousemove", function (event, d) {
        showTooltip(d, d.index);
      })
      .on("mouseleave", function () {
        d3.select(this).attr("d", arc);
        hideTooltip();
      });

    return () => {
      hideTooltip();
    };
  }, [data, donutSize, customColors, hoverExpand, safePadding]);

  return (
    <div
      ref={wrapRef}
      style={{
        width: "100%",
        minHeight: height,
        borderRadius: 14,
        padding: 22,
        position: "relative",
        boxSizing: "border-box",
        overflow: "visible",
      }}
    >
      <div
        ref={tooltipRef}
        style={{
          position: "absolute",
          visibility: "hidden",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24 }}>
        <div style={{ minWidth: 220, paddingTop: 6 }}>
          {data.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 14,
                color: "#374151",
                fontSize: 15,
                fontWeight: 600,
                opacity: activeIndex === null || activeIndex === index ? 1 : 0.55,
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: colorScale(index),
                  display: "inline-block",
                }}
              />
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        <div style={{ flex: 1, display: "flex", justifyContent: "center", paddingTop: 4 }}>
          <svg ref={svgRef} style={{ display: "block", overflow: "visible" }} />
        </div>
      </div>
    </div>
  );
};

export default DonutGraphChart;