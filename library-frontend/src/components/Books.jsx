import { useState } from 'react'
import Select from 'react-select'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS_AND_GENRES } from '../queries'
// import { useFilterBooks } from '../hooks/useFilterBooks'

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState({ value: null, label: null })
  const query = useQuery(ALL_BOOKS_AND_GENRES, { variables: { genre: selectedGenre.value } })

  if (query.loading) return <div>...loading</div>

  const books = query.data.allBooks
  const genres = query.data.genres

  const genresSet = new Set(genres.map(b => b.genres).flat())
  const selectionOfGenres = Array.from(genresSet).map(e => ({ value: e, label: e }))
  selectionOfGenres.unshift({ value: null, label: 'All' })

  return (
      <div>
        <h2>books</h2>

      <Select defaultValue={selectedGenre} onChange={setSelectedGenre} options={selectionOfGenres}/>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>author</th>
              <th>published</th>
            </tr>
            {books.map((a) => (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  )
}

export default Books
