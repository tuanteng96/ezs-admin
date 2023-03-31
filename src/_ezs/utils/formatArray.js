export const formatArray = {
  useInfiniteQuery: (page, key = 'data') => {
    let newPages = []
    if (!page || !page[0]) return newPages
    for (let items of page) {
      for (let x of items[key]) {
        newPages.push(x)
      }
    }
    return newPages
  }
}
