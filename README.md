## Installtion

for vue 2: `npm install vuetify-drawer`
for vue 3: `npm install digitspark-drawer`

# Local Dev

npm run dev

# Publish

npm publish

# Usages

in your global layout add the component `AppDrawer`

```
<script setup>
import { AppDrawer } from 'digitspark-drawer'
</script>
```

```
<template>
  <AppDrawer />
</template>
```

in other component import the useAppDrawer composable

```
<script setup>
import { useAppDrawer } from 'digitspark-drawer'

const $drawer = useAppDrawer()

function doPush() {
  $drawer.push({
    component: defineAsyncComponent(() => import('~/components/DrawerContent.vue'))
  })
}
</script>
```