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
    autoplay: true,
    interval: 3000,
    items: [
      {
        title: "",
        desc: "",
        cover: "/images/tg.trx.jpeg",
        url: "https://t.me/aquabeta_bot",
        titleClass: "telegram-title",
        descClass: "telegram-desc"
      },
      {
        title: "",
        desc: "",
        cover: "/images/tg.ch.jpeg",
        url: "https://t.me/ch_aqua",
        titleClass: "telegram-title",
        descClass: "telegram-desc"
      }
    ]
  }
}

const projects = merchant.value.projects || []

projects.forEach((project) => {
  if (!['DIGITAL', 'MANUAL', 'LICENSE', 'GROUP', 'VPN'].includes(project.type)) return

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
  // 필요시 추가 로직
})
</script>

<template>
  <section class="flex justify-center bg-dark-brown text-gold min-h-screen px-4 py-6">
    <div v-if="merchant && Object.keys(merchant).length" class="w-full max-w-screen-lg space-y-6">
      <div class="flex items-center">
        <div>
          <BtnMerchantIntro :intro="descI18n(locale, merchant)" :siteSettings="siteSettings" />
        </div>
        <div class="flex-grow" />
        <div class="flex items-center gap-x-2">
          <BtnMerchantContact :contacts="merchant.contacts" :vertical="true" />
        </div>
      </div>

      <ClientOnly v-if="!selectedSKU || Object.keys(selectedSKU).length === 0">
        <div class="rounded-xl shadow-[0_6px_18px_rgba(191,165,89,0.6)] overflow-hidden mb-8 max-h-[320px]">
          <Carousel :siteSettings="siteSettings" />
        </div>
      </ClientOnly>

      <div v-if="!selectedSKU || Object.keys(selectedSKU).length === 0" id="projects" class="space-y-6">
        <div class="space-x-2 overflow-x-auto scrollbar-hide">
          <button
            v-for="cate in cates"
            :key="cate.code"
            @click="changeCate(cate.code)"
            class="btn btn-xs btn-outline rounded-md text-gold border-gold hover:bg-gold hover:text-dark-brown whitespace-nowrap"
            :class="{ 'btn-active bg-gold text-dark-brown': selectedCate.code === cate.code }"
          >
            {{ cate.name }}
          </button>
        </div>

        <div class="space-y-6">
          <template v-for="project in projects" :key="project.id">
            <template v-if="['DIGITAL', 'MANUAL', 'LICENSE', 'GROUP', 'VPN'].includes(project.type) && project.skus.length > 0 && ['all', project.slug].includes(selectedCate.code)">
              <details
                open
                class="group rounded-lg border border-gold bg-gradient-to-b from-dark-brown to-dark-brown-alt shadow-lg"
              >
                <summary
                  class="flex cursor-pointer items-center justify-between gap-2 p-4 text-gold font-semibold select-none"
                >
                  <div class="flex items-center gap-3">
                    <figure>
                      <NuxtImg
                        loading="lazy"
                        format="webp"
                        :src="project.cover"
                        :alt="project.name"
                        class="h-10 w-10 object-cover rounded-xl shadow-md"
                      />
                    </figure>
                    <h2 class="text-gold font-semibold text-lg truncate max-w-xs">{{ project.name }}</h2>
                  </div>

                  <svg
                    class="w-6 h-6 shrink-0 transition duration-300 group-open:-rotate-180 text-gold"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>

                <div class="mx-4 pb-6 leading-relaxed text-gold-light font-medium">
                  <EmptyContent v-if="project.skus.length === 0" class="pb-20">{{ $t('No_Skus') }}</EmptyContent>
                  <div
                    v-else
                    class="overflow-x-auto rounded-lg border border-gold bg-[#3a2d1a] shadow-inner"
                  >
                    <table class="table w-full text-gold-light">
                      <thead>
                        <tr class="border-b border-gold">
                          <th class="w-1/2">{{ $t('product_name') }}</th>
                          <th>{{ $t('Price') }}</th>
                          <th>{{ $t('stock') }}</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="sku in project.skus"
                          :key="sku.id"
                          :class="{ 'opacity-50 pointer-events-none': sku.stock === 0 }"
                          class="border-gold"
                        >
                          <td class="truncate max-w-[220px]" :title="sku.name">{{ sku.name }}</td>
                          <td>
                            <PriceTag
                              :key="'price-tag-' + sku.id"
                              :price-desc="sku.priceDesc"
                              price-class="text-md sm:text-lg font-bold text-gold"
                              class="flex items-center gap-x-1"
                            />
                          </td>
                          <td>{{ sku.stock }}</td>
                          <td
                            class="border-gold cursor-pointer"
                            :title="sku.stock === 0 ? '재고가 없습니다' : '주문하기'"
                            @click="sku.stock !== 0 && selectSKU(sku)"
                          >
                            <svg
                              class="w-6 h-6 hover:cursor-pointer"
                              :class="[sku.stock === 0 ? 'text-gray-600' : 'text-gold']"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7h-1M8 7h-.688M13 5v4m-2-2h4"
                              />
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
:root {
  --gold: #bfa559;
  --gold-light: #e6d8a8;
  --dark-brown: #1a1611;
  --dark-brown-alt: #2e2718;
  --dark-brown-gradient-from: #1a1611;
  --dark-brown-gradient-to: #2e2718;
}

section {
  background-color: var(--dark-brown) !important;
  color: var(--gold) !important;
  min-height: 100vh;
  padding: 1.5rem 1rem;
}

/* 골드 텍스트 */
.text-gold {
  color: var(--gold) !important;
  text-shadow: 0 0 6px rgba(191, 165, 89, 0.7);
}

/* 골드 라이트 텍스트 */
.text-gold-light {
  color: var(--gold-light) !important;
  text-shadow: 0 0 4px rgba(230, 216, 168, 0.5);
}

/* 버튼 기본 스타일 */
.btn {
  border-radius: 0.375rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

/* 버튼 작은 사이즈 */
.btn-xs {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
}

/* 테두리만 있는 버튼 */
.btn-outline {
  border: 1.5px solid var(--gold) !important;
  background-color: transparent !important;
  color: var(--gold) !important;
}

/* 버튼 호버 */
.btn-outline:hover {
  background-color: var(--gold) !important;
  color: var(--dark-brown) !important;
  box-shadow: 0 6px 12px rgba(191, 165, 89, 0.5);
}

/* 활성화된 버튼 */
.btn-active {
  background-color: var(--gold) !important;
  color: var(--dark-brown) !important;
  box-shadow: 0 6px 15px rgba(191, 165, 89, 0.8);
}

/* details 스타일 */
details {
  border: 1.5px solid var(--gold) !important;
  border-radius: 1rem;
  background: linear-gradient(to bottom, var(--dark-brown-gradient-from), var(--dark-brown-gradient-to)) !important;
  box-shadow: 0 6px 15px rgba(191, 165, 89, 0.4);
  transition: all 0.3s ease;
}

/* summary 스타일 */
summary {
  padding: 1rem;
  cursor: pointer;
  color: var(--gold);
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  user-select: none;
}

/* summary hover */
summary:hover {
  color: var(--gold-light);
}

/* summary 내 이미지 */
summary > div > figure > img {
  border-radius: 0.75rem;
  box-shadow: 0 3px 12px rgba(191, 165, 89, 0.6);
}

/* h2 스타일 */
h2 {
  font-weight: 600;
  font-size: 1.125rem;
  max-width: 16rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* details 본문 */
details > div {
  padding: 1rem;
  color: var(--gold-light);
  font-weight: 500;
  line-height: 1.5;
}

/* 테이블 스타일 */
table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  color: var(--gold-light);
}

/* 테이블 헤더 */
thead tr {
  border-bottom: 2px solid var(--gold);
}

/* 테이블 셀 */
th, td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--gold);
  text-align: left;
}

/* td 내용 줄임 */
td {
  max-width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* tbody 행 트랜지션 */
tbody tr {
  transition: opacity 0.3s ease;
}

/* 재고 0일 때 흐리게 */
tbody tr.opacity-50 {
  opacity: 0.5;
  pointer-events: none;
}

/* 주문 가능 셀 마우스 포인터 */
td.cursor-pointer {
  cursor: pointer;
}

/* 주문 아이콘 트랜지션 */
td.cursor-pointer svg {
  transition: color 0.3s ease;
}

/* 주문 아이콘 호버 */
td.cursor-pointer svg:hover {
  color: #f2e6a7 !important;
}

/* 로딩 스피너 색상 */
.loading {
  color: var(--gold);
}

/* 가로스크롤 숨기기 (버튼 리스트) */
#projects > div.space-x-2 {
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none;  /* IE 10+ */
}
#projects > div.space-x-2::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

/* 버튼 리스트 줄바꿈 방지 */
#projects > div.space-x-2 > button {
  white-space: nowrap;
}
</style>
