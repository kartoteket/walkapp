<template>
  <div id="welcome">
      <header-component></header-component>

      <div role="main" class="webapp__content center-content">
          <div>
              <label>Hei</label>
              <h2>{{user.name}}</h2>
              <p>&nbsp;</p>
              <label>Velkommen til vandringen</label>
              <h1>{{walk.title}}</h1>
              <br>
          </div>
      </div>

      <footer-component v-if="walk.id"></footer-component>

  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'welcome',

  computed: mapState([
    'user',
    'walk'
  ])
}
</script>

