<template>
  <div class="buyer-dashboard">
    <main class="content" @scroll="handleScroll" ref="contentRef">
      <router-view />
    </main>

    <BottomNavBar :hidden="navHidden" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import BottomNavBar from "@/components/BottomNavBar.vue";

const contentRef = ref(null);
const lastScrollTop = ref(0);
const navHidden = ref(false);

function handleScroll() {
  const el = contentRef.value;
  if (!el) return;

  const scrollTop = el.scrollTop;

  if (scrollTop > lastScrollTop.value && scrollTop > 50) {
    navHidden.value = true;
  } else if (scrollTop < lastScrollTop.value) {
    navHidden.value = false;
  }
  lastScrollTop.value = scrollTop <= 0 ? 0 : scrollTop;
}
</script>

<style scoped>
.buyer-dashboard {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 56px; /* 底部导航栏高度 */
}
</style>
