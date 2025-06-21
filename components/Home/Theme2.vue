<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNuxtApp, useState } from '#app'
import { defineProps } from 'vue'

const { locale } = useI18n()
const translate = useNuxtApp().$i18n.t

const selectedCate = ref({ name: translate('All'), code: 'all' })
const cates = ref([{ name: translate('All'), code: 'all' }])
const selectedSKU = useState('SelectedSKU', () => ({}))
const props = defineProps(['merchant'])
const merchant = ref({})
merchant.value = props.merchant

const siteSettings = {
  carousel: {
    status: "active",
    items: [
      {
        title: "1",
        desc: "24시간 실시간 상담 및 올인원 봇",
        cover: "/resized-telegram-chch.png",
        url: "https://t.me/aquabeta_bot",
        titleClass: "telegram-title",
        descClass: "telegram-desc"
      },
      {
        title: "2",
        desc: "텔레그램 채널",
        cover: "/resized-telegram-ch.png",
        url: "https://t.me/ch_aqua",
        titleClass: "telegram-title",
        descClass: "telegram-desc"
      }
    ]
  }
}

const projects = merchant.value.projects || []

projects.forEach((project) => {
  if (!['DIGITAL', 'MANUAL', 'LICENSE', 'GROUP', 'VPN'].includes(project.type)) {
    return
  }
  cates.value.push({
    name: project.name,
    code: project.slug,
  })

  project.skus.forEach((sku) => {
    sku.projectSlug = project.slug
    sku.cover = project.cover
    sku.project = {
      id: project.id,
      type: project.type,
      name: project.name,
      nameI18n: project.nameI18n,
      desc: project.desc,
      descI18n: project.descI18n,
      hasCoupons: project.hasCoupons,
    }
    sku.order = sku.order || {}
    sku.order.affCode = project.aff
  })
})

watch(merchant, () => {
  const merchantInfo = merchant.value
  if (!merchantInfo || Object.keys(merchantInfo).length === 0) return
})

const changeCate = (code) => {
  cates.value.forEach((cate) => {
    if (cate.code === code) {
      selectedCate.value = cate
    }
  })
}

const selectSKU = (sku) => {
  selectedSKU.value = sku
}

onMounted(() => {
  // stateMerchant.info(false);
  // 필요하면 여기에 추가 로직 작성
})
</script>

<template>
  <section class="flex justify-center">
    <div v-if="merchant && Object.keys(merchant).length" class="w-full max-w-screen-lg space-y-4 px-4 my-2">
      <div class="mt-4 flex items-center">
        <div>
          <BtnMerchantIntro :intro="descI18n(locale, merchant)" :siteSettings="siteSettings" />
        </div>

        <div class="flex-grow" />

        <div class="flex items-center gap-x-2">
          <BtnMerchantContact :contacts="merchant.contacts" :vertical="true" />
        </div>
      </div>

      <ClientOnly v-if="!selectedSKU || Object.keys(selectedSKU).length === 0">
        <div style="max-height: 320px; overflow: hidden; border-radius: 16px; box-shadow: 0 6px 18px rgba(212, 175, 55, 0.6); margin-bottom: 1rem;">
          <Carousel :siteSettings="siteSettings" />
        </div>
      </ClientOnly>

      <div v-if="!selectedSKU || Object.keys(selectedSKU).length === 0" id="projects" class="space-y-4">
        <div class="space-y-2">
          <button v-for="cate in cates" :key="cate.code" @click="changeCate(cate.code)"
            class="mr-2 btn btn-xs btn-outline rounded-md"
            :class="{ 'btn-active': selectedCate.code === cate.code }">
            {{ cate.name }}
          </button>
        </div>

        <div class="space-y-4">
          <template v-for="project in projects" :key="project.id">
            <template v-if="['DIGITAL', 'MANUAL', 'LICENSE', 'GROUP', 'VPN'].includes(project.type) && project.skus.length > 0 && ['all', project.slug].includes(selectedCate.code)">
              <details
                class="group [&_summary::-webkit-details-marker]:hidden rounded-lg border border-gray-900 bg-gradient-to-b from-[#1a1611] to-[#2d2419] shadow-lg"
                open>
                <summary class="flex cursor-pointer items-center justify-between gap-1.5 p-4 text-yellow-400 font-semibold">
                  <div class="flex items-center gap-x-2">
                    <figure>
                      <NuxtImg loading="lazy" format="webp" :src="project.cover" :alt="project.name"
                        class="h-[40px] w-[40px] object-cover rounded-xl shadow-md" />
                    </figure>
                    <h2 class="font-semibold text-yellow-400">{{ project.name }}</h2>
                  </div>

                  <svg class="size-5 shrink-0 transition duration-300 group-open:-rotate-180 text-yellow-400"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div class="mx-4 pb-4 leading-relaxed text-yellow-300 font-medium">
                  <EmptyContent v-if="project.skus.length === 0" class="pb-20">{{ $t('No_Skus') }}</EmptyContent>
                  <div v-else class="overflow-x-auto rounded-lg border border-yellow-600 bg-[#3a2d1a] shadow-inner">
                    <table class="table w-full text-yellow-300">
                      <thead>
                        <tr class="border-b border-yellow-600">
                          <th class="w-1/2">{{ $t('product_name') }}</th>
                          <th>{{ $t('Price') }}</th>
                          <th>{{ $t('stock') }}</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="sku in project.skus" :key="sku.id"
                          :class="{ 'opacity-50 pointer-events-none': sku.stock === 0 }"
                          class="border-yellow-600">
                          <td>{{ sku.name }}</td>
                          <td>
                            <PriceTag :key="'price-tag-' + sku.id" :price-desc="sku.priceDesc"
                              price-class="text-md sm:text-lg font-bold text-yellow-400"
                              class="flex items-center gap-x-1" />
                          </td>
                          <td>{{ sku.stock }}</td>
                          <td class="border-yellow-600 cursor-pointer" :title="sku.stock === 0 ? '재고가 없습니다' : '주문하기'"
                            @click="sku.stock !== 0 && selectSKU(sku)">
                            <svg class="w-6 h-6 hover:cursor-pointer"
                              :class="[sku.stock === 0 ? 'text-gray-600' : 'text-yellow-400']" aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                              viewBox="0 0 24 24">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7h-1M8 7h-.688M13 5v4m-2-2h4" />
                            </svg>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </details>
            </template>
          </template>
        </div>
        <EmptyContent v-if="projects.length === 0" class="pt-40">{{ $t('No_Skus') }}</EmptyContent>
      </div>
      <div v-else>
        <PlaceOrder />
      </div>
    </div>
    <div v-else class="flex items-center justify-center pt-40">
      <span class="loading loading-infinity loading-lg mt-40"></span>
    </div>
  </section>
</template>

<style scoped>
.project-name {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
  font-size: 1.1rem;
  line-height: 1.3;
  color: #d4af37; /* 은은한 골드톤 */
  text-shadow: 0 0 6px rgba(212, 175, 55, 0.8);
}

.sku-name {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.95rem;
  line-height: 1.4;
  color: #e6d8a8; /* 부드러운 베이지 골드 톤 */
  text-shadow: 0 0 4px rgba(230, 216, 168, 0.5);
}
</style>
