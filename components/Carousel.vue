<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps(['siteSettings'])
const siteSettings = props.siteSettings

const currentIndex = ref(0)
const itemsCount = siteSettings.carousel?.items?.length || 0
let timer = null

const showSlide = (index) => {
  const slides = document.querySelectorAll('[data-carousel-item]')
  slides.forEach((slide, i) => {
    slide.style.display = i === index ? 'block' : 'none'
  })

  // 버튼 활성화 표시
  const buttons = document.querySelectorAll('[data-carousel-slide-to]')
  buttons.forEach((btn, i) => {
    if(i === index){
      btn.classList.add('bg-yellow-400')
      btn.setAttribute('aria-current', 'true')
    } else {
      btn.classList.remove('bg-yellow-400')
      btn.removeAttribute('aria-current')
    }
  })
}

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % itemsCount
  showSlide(currentIndex.value)
}

const goToSlide = (index) => {
  currentIndex.value = index
  showSlide(index)
  // 자동 슬라이드 재시작
  if(timer){
    clearInterval(timer)
    timer = setInterval(nextSlide, siteSettings.carousel.interval || 3000)
  }
}

onMounted(() => {
  showSlide(currentIndex.value)

  if (siteSettings.carousel?.autoplay) {
    timer = setInterval(() => {
      nextSlide()
    }, siteSettings.carousel.interval || 3000)
  }
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div v-if="siteSettings.carousel && siteSettings.carousel.items" id="default-carousel" class="relative w-full"
    :data-carousel="siteSettings.carousel.status">
    <!-- Carousel wrapper -->
    <div class="relative h-56 overflow-hidden rounded-lg md:h-80">
      <template v-for="(item, index) in siteSettings.carousel.items" :key="index">
        <div data-carousel-item style="display:none" class="duration-700 ease-in-out">
          <a :href="item.url" target="_blank" class="h-56 md:h-80 cursor-pointer">
            <figure>
              <NuxtImg loading="lazy" format="webp" :src="item.cover" :alt="item.title"
                class="absolute block w-full h-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 object-cover brightness-75" />
            </figure>
            <div
              class="absolute top-4 md:top-6 lg:top-8 left-4 md:left-8 lg:left-16 py-5 text-left text-white space-y-4">
              <div class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium"
                :class="[item.titleClass ? item.titleClass : '']">
                {{ item.title }}
              </div>
              <div class="w-2/3" :class="[item.titleClass ? item.descClass : '']">
                {{ item.desc }}
              </div>
            </div>
          </a>
        </div>
      </template>
    </div>
    <!-- Slider indicators -->
    <div v-if="siteSettings.carousel.items.length > 1"
      class="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
      <template v-for="(item, index) in siteSettings.carousel.items" :key="'btn-' + index">
        <button
          type="button"
          class="w-3 h-3 rounded-full bg-gray-400"
          :aria-label="item.title"
          :data-carousel-slide-to="index"
          @click="goToSlide(index)"
        ></button>
      </template>
    </div>
  </div>
</template>
