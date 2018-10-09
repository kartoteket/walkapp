export default {
  create: (store) => {
    const form = new FormData()
    const item = store.state.newItem

    const priorityMap = ['low', 'middel', 'high']

    /**
     * We don't have a very good API setup for authenticating users, so if (currently just a hypothetical)
     * posting fom another domain, and thus not being authenticated, we use the guest entries plugin endpoint
     * and set the author in an onSave-hook in the backend
     */
    if (/* process.env.NODE_ENV === 'development' || */!store.state.user.isCurrent) {  // testing from localhost or not current user
      form.append('action', 'GuestEntries/saveEntry')
      // form.append('authorId', store.getters.userId)
      form.append('authorId', '1') // on localhost we fake it to make it
    } else {
      /* normal setup, we just post to the saveEntry */
      form.append('action', 'entries/saveEntry')
    }

    // form.append('redirect', 'api/walks/items/{id}.json') // Craft autoinjects the entryID.. nice, he ?
    form.append('locale', 'no')
    form.append('enabled', '1')
    form.append('sectionId', store.state.config.itemsSectionId)
    form.append('fields[walkItemParent][]', store.getters.walkId)

    form.append('fields[walkItemPriority]', priorityMap[item.priority - 1])

    if (item.message) {
      form.append('fields[walkItemDescription]', item.message)
    }

    if (item.position.address) {
      form.append('fields[walkItemLocation][line1]', item.position.address)
    }

    if (item.position.lat && item.position.lng) {
      form.append('fields[walkItemLocation][latitude]', item.position.lat)
      form.append('fields[walkItemLocation][longitude]', item.position.lng)
    }

    // In this app, the image is returned from the vue-image-upload-resize plugin.
    // This has three output formats: String, Blob(file) and Object
    // We use object, stringify it to json to pass along with the form and the decode the json in the Craft Plugin Sercvice
    if (item.image) {
      if (item.image instanceof File) {
        form.append('fields[walkItemPhoto]', item.image)
      } else {
        form.append('CustomWalkItemPhoto', JSON.stringify(item.image))
      }
    }

    if (item.tags.length) {
      const tagIds = item.tags.map(tag => tag.id)
      const newTags = item.tags.filter(tag => !tag.hasOwnProperty('id'))
      form.append('fields[walkItemTags][]', tagIds) // gets send as string but is transformed to Array backend
      form.append('newTags', JSON.stringify(newTags)) // stringify to send
    }

    return form
  }
}
