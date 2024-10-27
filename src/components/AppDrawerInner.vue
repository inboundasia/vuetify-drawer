<template>
  <div>
    <div
      :style="{ 'z-index': $attrs.index + 1007 }"
      class="overlay"
      @click="onOverlayClicked"
    />
    <div
      :width="mWidth"
      :elevation="18"
      :style="{ 'z-index': $attrs.index + 1008, width: mWidth }"
      class="drawer"
    >
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      breakPoint: 959,
      animationDelay: 200,
      mWidth: 0,
    }
  },
  computed: {
    width() {
      return window.innerWidth <= this.breakPoint ? '100%' : this.$attrs.width
    },
  },
  watch: {
    '$attrs.width'(width) {
      setTimeout(() => {
        this.mWidth = this.width
      }, this.animationDelay)
    },
  },
  async mounted() {
    await setTimeout(() => {
      this.mWidth = this.width
    }, this.animationDelay)

    this.$emit('pushed', this)

    window.addEventListener('resize', this.handleWindowResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize)
  },
  methods: {
    handleWindowResize() {
      this.mWidth = window.innerWidth <= this.breakPoint ? '100%' : this.width
    },
    onOverlayClicked() {
      if (!this.$attrs.persistent) {
        this.close()
      }
    },
    async close() {
      this.mWidth = 0
      await setTimeout(() => {
        this.$emit('closed', this)
      }, this.animationDelay)
    },
  },
}
</script>

<style scoped>
.drawer {
  position: fixed;
  display: block;
  height: 100%;
  left: auto;
  right: 0;
  max-width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  pointer-events: auto;
  top: 0;
  will-change: transform;
  margin-top: 0px;
  transform: translateX(0px);
  transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transition-property: transform, width, -webkit-transform;

  /** Porting Vuetify Styles */
  box-shadow: 0px 9px 11px -5px rgb(0 0 0 / 20%),
    0px 18px 28px 2px rgb(0 0 0 / 14%), 0px 7px 34px 6px rgb(0 0 0 / 12%) !important;
  background-color: #ffffff;
  border-color: #ffffff;
  color: rgba(0, 0, 0, 0.87);
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  z-index: 7;
}

.overlay:before {
  background-color: rgba(0, 0, 0, 0.5);
  bottom: 0;
  content: '';
  height: 100%;
  left: 0;
  opacity: 0.5;
  position: absolute;
  right: 0;
  top: 0;
  transition: inherit;
  transition-delay: 150ms;
  width: 100%;
}
</style>
