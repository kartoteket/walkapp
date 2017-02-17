export default {
  create: (store) => {
    const form = new FormData()
    const item = store.state.newItem

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

    if (item.message) {
      form.append('fields[walk_item_description]', item.message)
    }

    if (item.position.address) {
      form.append('fields[walk_item_location][line1]', item.position.address)
    }

    if (item.position.lat && item.position.lng) {
      form.append('fields[walk_item_location][latitude]', item.position.lat)
      form.append('fields[walk_item_location][longitude]', item.position.lng)
    }

    if (item.image) {
      form.append('fields[walk_item_photo]', item.image)
    }
    }

    return form
  }
}
