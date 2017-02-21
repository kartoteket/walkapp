<template>
  <div>
    <multiselect
      v-model="selectedTags"
      :options="tags"
      :multiple="true"
      :taggable="true"
      :closeOnSelect="true"
      @tag="addTag"
      @input="updateTags"
      tag-placeholder="Legg til ny"
      placeholder="Søk eller legg til ny..."
      label="name"
      track-by="slug">
    </multiselect>
  </div>
</template>

<script>
import slug from 'slug'
import Multiselect from 'vue-multiselect'
import {mapState} from 'vuex'
export default {

  name: 'selector',
  components: { Multiselect },

  data () {
    return {
      selectedTags: []
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
      const tag = {
        name: newTag,
        slug: slug(newTag) // TODO.NB: Watch out for potential issues if not unique (shouldnt happen, but...)
      }

      this.tags.push(tag)
      this.selectedTags.push(tag)
      this.$store.commit('SET_ITEM_TAGS', this.selectedTags)
    }
  }
}

</script>
