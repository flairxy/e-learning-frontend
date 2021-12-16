<template>
  <div>
    <nuxt-child />
  </div>
</template>
<script>
export default {
  middleware: ['admin'],
  layout: 'admin'
}
</script>
