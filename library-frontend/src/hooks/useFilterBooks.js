export const useFilterBooks = ({ books, filterFn }) => {
  const filteredBooks = books.filter(filterFn)
  return filteredBooks
}
