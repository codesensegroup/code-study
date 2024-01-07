<template>
  <NuxtLink
    rel="noopener noreferrer"
    title="github"
    href="https://github.com/codesensegroup/code-study"
    target="_blank"
  >
    <Icon name="mdi:github" />
  </NuxtLink>
</template>

<style lang="ts" scoped>
css({
  a: {
    display: 'flex',
    color: '{color.gray.500}',
    padding: '{space.4}',

    '@dark': {
      color: '{color.gray.400}'
    },

    '&:hover': {
      color: '{color.gray.700}',
      '@dark': {
        color: '{color.gray.200}',
      }
    },
  }
})
</style>
