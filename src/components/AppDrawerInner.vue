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
      :style="{
        'z-index': $attrs.index + 1008,
        width: mWidth,
        'background-color': isDark ? 'rgb(30, 30, 30)' : '#ffffff',
        color: isDark ? 'rgba(255, 255, 255, 0.87)' : 'rgba(0, 0, 0, 0.87)',
        'border-color': isDark ? 'rgb(30, 30, 30)' : '#ffffff'
      }"
      class="drawer"
      :class="{
        'drawer--dark': isDark,
        'drawer--light': !isDark
      }"
    >
      <slot />
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue'

export default {
  data() {
    return {
      breakPoint: 959,
      animationDelay: 200,
      mWidth: 0,
      isDark: false,
      themeObserver: null,
      mediaQuery: null,
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
    // Detect theme from Vuetify if available
    this.detectTheme()

    // Watch for theme changes
    this.watchTheme()

    // Re-detect theme after a short delay to ensure DOM is ready
    setTimeout(() => {
      this.detectTheme()
    }, 100)

    await setTimeout(() => {
      this.mWidth = this.width
    }, this.animationDelay)

    this.$emit('pushed', this)

    window.addEventListener('resize', this.handleWindowResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize)

    // Clean up observers
    if (this.themeObserver) {
      this.themeObserver.disconnect()
    }
    if (this.mediaQuery) {
      if (this.mediaQuery.removeEventListener) {
        this.mediaQuery.removeEventListener('change', this.detectTheme)
      } else if (this.mediaQuery.removeListener) {
        this.mediaQuery.removeListener(this.detectTheme)
      }
    }
  },
  methods: {
    detectTheme() {
      try {
        if (typeof window === 'undefined') return

        const oldIsDark = this.isDark

        // Method 1: Check .v-application element (Vuetify's main container) - Most reliable
        const vApplication = document.querySelector('.v-application')
        if (vApplication) {
          if (vApplication.classList.contains('v-theme--dark')) {
            this.isDark = true
          } else if (vApplication.classList.contains('v-theme--light')) {
            this.isDark = false
          }
        }

        // Method 2: Check documentElement class (fallback)
        if (this.isDark === oldIsDark) {
          const html = document.documentElement
          if (html.classList.contains('v-theme--dark')) {
            this.isDark = true
          } else if (html.classList.contains('v-theme--light')) {
            this.isDark = false
          }
        }

        // Method 3: Check data attribute
        if (this.isDark === oldIsDark) {
          const html = document.documentElement
          const themeAttr = html.getAttribute('data-v-theme')
          if (themeAttr === 'dark') {
            this.isDark = true
          } else if (themeAttr === 'light') {
            this.isDark = false
          }
        }

        // Method 4: Try to get from Vuetify instance
        if (this.isDark === oldIsDark) {
          try {
            const instance = getCurrentInstance()
            if (instance) {
              const vuetify = instance.appContext?.config?.globalProperties?.$vuetify
              if (vuetify?.theme?.global?.name) {
                const themeName = typeof vuetify.theme.global.name === 'object'
                  ? vuetify.theme.global.name.value
                  : vuetify.theme.global.name
                this.isDark = themeName === 'dark'
              }
            }
          } catch (e) {
            // Continue to next method
          }
        }

        // Method 5: Check prefers-color-scheme (last resort, only if not set)
        if (this.isDark === oldIsDark) {
          if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.isDark = true
          } else {
            this.isDark = false
          }
        }

        // Force reactivity update if changed
        if (oldIsDark !== this.isDark) {
          this.$forceUpdate()
        }
      } catch (e) {
        // Silently fail and use default
        console.debug('Could not detect theme:', e)
        this.isDark = false
      }
    },
    watchTheme() {
      if (typeof window === 'undefined') return

      // Watch for Vuetify theme changes via MutationObserver
      this.themeObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' &&
              (mutation.attributeName === 'class' || mutation.attributeName === 'data-v-theme')) {
            this.detectTheme()
          }
        })
      })

      // Observe .v-application element for class changes (primary method)
      const vApplication = document.querySelector('.v-application')
      if (vApplication) {
        this.themeObserver.observe(vApplication, {
          attributes: true,
          attributeFilter: ['class', 'data-v-theme'],
          subtree: false
        })
      }

      // Observe html element for class changes (fallback)
      if (document.documentElement) {
        this.themeObserver.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ['class', 'data-v-theme'],
          subtree: false
        })
      }

      // Watch for prefers-color-scheme changes
      if (window.matchMedia) {
        this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        if (this.mediaQuery.addEventListener) {
          this.mediaQuery.addEventListener('change', this.detectTheme)
        } else if (this.mediaQuery.addListener) {
          // Fallback for older browsers
          this.mediaQuery.addListener(this.detectTheme)
        }
      }
    },
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
}

.drawer--dark {
  background-color: rgb(30, 30, 30);
  border-color: rgb(30, 30, 30);
  color: rgba(255, 255, 255, 0.87);
  box-shadow: 0px 9px 11px -5px rgb(0 0 0 / 40%),
    0px 18px 28px 2px rgb(0 0 0 / 30%), 0px 7px 34px 6px rgb(0 0 0 / 25%) !important;
}

.drawer--light {
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
