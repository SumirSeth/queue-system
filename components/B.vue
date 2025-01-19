<template>
    <button :class="[props.bg, props.txt]" class="px-4 py-2 rounded-md">
      {{ props.text }}
    </button>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    text: string,
    bg?: string,
    txt?: string,
  }>(),
  {
    text: 'Button',
    bg: 'bg-white',
    txt: 'text-black'
  }
)
</script>

<style>

</style>