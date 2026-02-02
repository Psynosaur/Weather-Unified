<template>
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns:svgjs="http://svgjs.dev/svgjs" viewBox="0 0 800 800">
    <defs>
      <linearGradient id="cccloud-grad" x1="50%" y1="0%" x2="50%" y2="100%">
        <stop stop-color="hsl(205, 69%, 60%)" stop-opacity="1" offset="0%" data-darkreader-inline-stopcolor=""
          style="--darkreader-inline-stopcolor: var(--darkreader-background-53a5df, #2688cc);" />
        <stop stop-color="hsl(205, 69%, 80%)" stop-opacity="1" offset="100%" data-darkreader-inline-stopcolor=""
          style="--darkreader-inline-stopcolor: var(--darkreader-background-a9d2ef, #195885);" />
      </linearGradient>
    </defs>

    <g id="cloud" fill="url(#cccloud-grad)" stroke-width="13" stroke="hsl(230, 55%, 40%)"
      style="--darkreader-inline-stroke: var(--darkreader-text-2e419e, #a9e1ff);" data-darkreader-inline-stroke=""
      opacity="0.42">
      <path
        d="M 300 600 A  39 39 0 1 1 200 400 A  39 39 0 1 1 200 250 A  39 39 0 1 1 350 200 A  39 39 0 1 1 500 250 A  39 39 0 1 1 650 400 A  39 39 0 1 1 550 500 A  39 39 0 1 1 450 550 A  39 39 0 1 1 300 600 Z"
        stroke-linecap="round" stroke-linejoin="round" />
    </g>
    <text x="30" y="800" font-size="20em">
      <tspan fill="url(#cccloud-grad)">WU</tspan>
    </text>
  </svg>
</template>
