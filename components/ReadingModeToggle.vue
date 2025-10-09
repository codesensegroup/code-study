<template>
  <button
    class="reading-mode-toggle"
    :class="{ active: isReadingMode }"
    @click="toggleReadingMode"
    :aria-label="isReadingMode ? '退出閱讀模式' : '進入閱讀模式'"
    :title="isReadingMode ? '退出閱讀模式 (F)' : '進入閱讀模式 (F)'"
  >
    <Icon
      :name="isReadingMode ? 'heroicons-outline:eye-off' : 'heroicons-outline:book-open'"
      class="icon"
    />
  </button>
</template>

<script setup lang="ts">
const { isReadingMode, toggleReadingMode } = useReadingMode()
</script>

<style scoped lang="ts">
css({
  '.reading-mode-toggle': {
    position: 'fixed',
    bottom: '{space.8}',
    right: '{space.8}',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '{color.primary.500}',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(8px)',
    zIndex: 1000,
    '@dark': {
      backgroundColor: '{color.primary.600}',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
    },
    '&:hover': {
      transform: 'scale(1.1)',
      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
      '@dark': {
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.5)',
      }
    },
    '&:active': {
      transform: 'scale(0.95)',
    },
    '&.active': {
      backgroundColor: '{color.green.500}',
      transform: 'rotate(180deg)',
      '@dark': {
        backgroundColor: '{color.green.600}',
      },
      '&:hover': {
        transform: 'rotate(180deg) scale(1.1)',
      },
      '&:active': {
        transform: 'rotate(180deg) scale(0.95)',
      }
    },
    '.icon': {
      width: '28px',
      height: '28px',
      transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    },
    // Hide on mobile
    '@media (max-width: 1023px)': {
      display: 'none'
    }
  }
})
</style>
