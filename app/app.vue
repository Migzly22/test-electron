<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtWelcome />
    <Button @click="a">qweqwe</Button>
  </div>
</template>
<script setup lang="ts">
  const a = async () => {
    try {
      const b = await $fetch(`/api/data`)
      console.log("dAta", b)
    } catch (error) {
          console.log("dAta error")
    }

  }
</script>