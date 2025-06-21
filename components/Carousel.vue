<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps(['siteSettings'])
const siteSettings = props.siteSettings

const currentIndex = ref(0)
const itemsCount = siteSettings.carousel?.items?.length || 0
let timer = null

const goToNext = () => {
  currentIndex.value = (currentIndex.value + 1) % itemsCount
}

onMounted(() => {
  timer = setInterval(() => {
    goToNext()
  }, siteSettings.carousel.interval || 3000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div v-if="siteSettings.carousel && siteSettings.carousel.items.length" class="relative w-full">
    <div class="relative h-56 overflow-hidden rounded-lg md:h-80">
      <a
        :href="siteSettings.carousel.items[currentIndex].url"
        target="_blank"
        class="h-56 md:h-80 cursor-pointer block relative"
        style="display: block;"
      >
        <figure>
          <NuxtImg
            loading="lazy"
            format="webp"
            :src="siteSettings.carousel.items[currentIndex].cover"
            :alt="siteSettings.carousel.items[currentIndex].title"
            class="absolute block w-full h-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 object-cover brightness-75"
          />
        </figure>
      </a>
    </div>
  </div>
</template>

<style scoped>
/* 필요시 스타일 추가 가능 */
</style>
