<template>
  <div>
    <multiselect
      :v-model="selectedTags"
      :options="tags"
      :multiple="true"
      :taggable="true"
      :closeOnSelect="true"
      @tag="addTag"
      @input="updateTags"
      tag-placeholder="Add this as new tag"
      placeholder="Type to search or add tag"
      label="name"
      track-by="slug">
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import {mapState} from 'vuex'
export default {

  name: 'selector',
  components: { Multiselect },

  data () {
    return {
      selectedTags: null
    }
  },

  computed: {
    ...mapState([
      'tags'
    ])
  },

  methods: {

    updateTags (newTag) {
      this.selectedTags = newTag
      this.$store.commit('SET_ITEM_TAGS', this.selectedTags)
    },

    addTag (newTag) {
      console.log('addTag')
      const tag = {
        name: newTag,
        code: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
      }

      this.tags.push(tag)
      this.updateTags(tag)
    }
  }
}

</script>

<style scoped>

</style>
