export default {
  create: (store) => {
    const form = new FormData()

    /**
     * We don't have a very good API setup for authenticating users, so if (currently just a hypothetical)
     * posting fom another domain, and thus not being authenticated, we use the guest entries plugin endpoint
     * and set the author in an onSave-hook in the backend
     */
    form.append('action', 'GuestEntries/saveEntry') // For when not logged inn (on another domain)
    form.append('authorId', store.getters.userId)

    /** normal setup, we just post to the saveEntry */
    // form.append('action', 'entries/saveEntry')

    // form.append('redirect', 'api/walks/items/{id}.json') // Craft autoinjects the entryID.. nice, he ?
    form.append('locale', 'no')
    form.append('enabled', '1')
    form.append('sectionId', store.state.Xconfig.itemsSectionId)
    form.append('fields[walk_item_parent][]', store.getters.walkId)
    form.append('fields[walk_item_priority]', 'high')

    if (store.state.newItem.message) {
      form.append('fields[walk_item_description]', store.state.newItem.message)
    }

    if (store.state.newItem.position.address) {
      form.append('fields[walk_item_location][line1]', store.state.newItem.position.address)
    }

    if (store.state.newItem.position.lat && store.state.newItem.position.lng) {
      form.append('fields[walk_item_location][latitude]', store.state.newItem.position.lat)
      form.append('fields[walk_item_location][longitude]', store.state.newItem.position.lng)
    }

    if (store.state.newItem.image) {
      form.append('fields[walk_item_photo]', store.state.newItem.image)
    }

    return form
  }
}
