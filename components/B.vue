<template>
    <button :class="[props.bg, props.txt,props.cls, 'px-4 py-2 rounded-md', ]">
      {{ props.text }}
    </button>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    text: string,
    bg?: string,
    txt?: string,
    cls?: string
  }>(),
  {
    text: 'Button',
    bg: 'bg-white',
    txt: 'text-black',
    cls: ''
  }
)
</script>

<style>

</style>