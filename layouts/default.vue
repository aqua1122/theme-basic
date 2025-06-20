<script setup>
// https://i18n.nuxtjs.org/guide/seo
const head = useLocaleHead({
  addDirAttribute: true,
  identifierAttribute: 'id',
  addSeoAttributes: true,
})

useHead({
  meta: [
    { name: 'revisit-after', content: '1 days' },
  ],
})

useSeoMeta({
  robots: 'index, follow',
})
</script>

<style>
html, body {
  background: #1a110c !important; /* 진한 브라운 */
  color: #d4af37 !important;      /* 은은한 골드 텍스트 */
  min-height: 100vh;
  margin: 0;
}
</style>

<template>
  <div>
    <Html :lang="head.htmlAttrs.lang" :dir="head.htmlAttrs.dir">

      <Head>
        <template v-for="link in head.link" :key="link.id">
          <Link :id="link.id" :rel="link.rel" :href="link.href" :hreflang="link.hreflang" />
        </template>
        <template v-for="meta in head.meta" :key="meta.id">
          <Meta :id="meta.id" :property="meta.property" :content="meta.content" />
        </template>
      </Head>

      <Body>
        <slot />
        <Alert />
      </Body>

    </Html>
  </div>
</template>
