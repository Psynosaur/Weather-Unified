<script setup lang="ts">
// Meta information
useHead({
  title: 'About',
  meta: [
    { name: 'description', content: 'About the weather station and author' }
  ]
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-center">
      <div class="max-w-md w-full">
        <UCard>
          <!-- Card Image -->
          <template #header>
            <div class="aspect-square w-full overflow-hidden">
              <img
                src="/img/FullSpectrumOhanssss.jpg"
                alt="Ohan Smit"
                class="w-full h-full object-cover"
              >
            </div>
          </template>

          <!-- Card Content -->
          <div class="space-y-4">
            <h1 class="text-2xl font-bold">
              The author -
              <a
                href="https://flickr.com/ohansmit"
                target="_blank"
                class="text-primary hover:underline"
              >
                Ohan Smit
              </a>
              -
              <a
                href="https://github.com/psynosaur"
                target="_blank"
                class="text-cyan-400 hover:underline"
              >
                Psynosaur
              </a>
            </h1>

            <div class="space-y-3">
              <p>
                This is my weather reporting site, it is built for speedy weather insights.
              </p>

              <p class="text-center">
                My Amateur Radio blog can be found at
                <a
                  href="https://zs1sci.com/"
                  target="_blank"
                  class="text-primary hover:underline"
                >
                  zs1sci.com
                </a>
              </p>

              <p class="text-center text-sm text-muted">
                I like the weather okay. . . ¯\_(ツ)_/¯
              </p>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>
