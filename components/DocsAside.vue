<script setup lang="ts">
const { tree } = useDocus();

const groupedLinks = computed(() => {
  if (!tree.value?.length) return null;
  const reversed = [...tree.value].reverse();
  const current = reversed.filter((item: any) => item.group === 'current');
  const past = reversed.filter((item: any) => item.group !== 'current');
  return { current, past };
});
</script>

<template>
  <nav>
    <template v-if="groupedLinks">
      <div v-if="groupedLinks.current.length" class="aside-group-divider">
        <span>2026讀書會</span>
      </div>
      <DocsAsideTree v-if="groupedLinks.current.length" :links="groupedLinks.current" />
      <div v-if="groupedLinks.past.length" class="aside-group-divider">
        <span>歷年讀書會</span>
      </div>
      <DocsAsideTree v-if="groupedLinks.past.length" :links="groupedLinks.past" />
    </template>
    <NuxtLink v-else to="/" class="go-back-link">
      <Icon name="heroicons-outline:arrow-left" class="icon" />
      <span class="text">Go back</span>
    </NuxtLink>
  </nav>
</template>

<style scoped lang="ts">
css({
  '.aside-group-divider': {
    display: 'flex',
    alignItems: 'center',
    margin: '{space.4} 0',
    fontSize: '{text.xs.fontSize}',
    lineHeight: '{text.xs.lineHeight}',
    color: '{color.gray.400}',
    'span': {
      flexShrink: '0',
      padding: '0 {space.2}',
    },
    '&::before, &::after': {
      content: '""',
      flexGrow: '1',
      height: '1px',
      backgroundColor: '{color.gray.200}',
    },
    '@dark': {
      color: '{color.gray.500}',
      '&::before, &::after': {
        backgroundColor: '{color.gray.700}',
      },
    },
  },
  '.go-back-link': {
    display: 'flex',
    alignItems: 'center',
    fontSize: '{text.sm.fontSize}',
    lineHeight: '{text.sm.lineHeight}',
    cursor: 'pointer',
    color: '{color.gray.500}',
    '&:hover': {
      color: '{color.gray.700}',
    },
    '.icon': {
      width: '{space.4}',
      height: '{space.4}'
    },
    '.text': {
      marginLeft: '{space.2}'
    }
  }
})
</style>
