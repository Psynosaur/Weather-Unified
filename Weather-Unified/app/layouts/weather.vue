<template>
  <div>
    <!-- Three column layout: CurrentConditions | TopBar + Charts | Stats -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left sidebar - Current Conditions -->
      <slot name="left-sidebar" />

      <!-- Middle section - Top Bar and Charts -->
      <div class="lg:col-span-8 space-y-6">
        <!-- Top Bar - Summary Cards -->
        <slot name="top-bar" />

        <!-- Charts Grid -->
        <slot name="charts" />
      </div>

      <!-- Right sidebar - Stats -->
      <slot name="right-sidebar" />
    </div>

    <!-- Footer content (record count, etc.) -->
    <slot name="footer" />
  </div>
</template>
