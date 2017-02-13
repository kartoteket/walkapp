export default {
  create: (store) => {
    const form = new FormData()

    form.append('action', 'entries/saveEntry')
    form.append('redirect', 'api/walks/items/{id}.json') // Craft autoinjects the entryID... nice, he ?
    form.append('locale', 'no')
    form.append('enabled', '1')

    form.append('sectionId', store.state.Xconfig.itemsSectionId)
    form.append('fields[walk_item_parent][]', this.walkId)
    form.append('fields[walk_item_priority]', 'high')

    // if (this.message) {
    //   form.append('fields[walk_item_description]', this.message)
    // }

    // if (this.position.address) {
    //   form.append('fields[walk_item_location][line1]', this.position.address)
    // }

    // if (this.position.lat && this.position.lng) {
    //   form.append('fields[walk_item_location][latitude]', this.position.lat)
    //   form.append('fields[walk_item_location][longitude]', this.position.lng)
    // }

    // if (this.image) {
    //   form.append('fields[walk_item_photo]', this.image)
    // }
    return form
  }
}
