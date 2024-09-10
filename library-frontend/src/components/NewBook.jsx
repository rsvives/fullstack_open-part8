import { useMutation } from '@apollo/client'
import { useEffect, useState } from 'react'
import { ADD_BOOK, ALL_AUTHORS, ALL_BOOKS, ALL_BOOKS_AND_GENRES } from '../queries'
import { useNavigate } from 'react-router-dom'
import { useField } from '../hooks/useField'

const NewBook = ({ token, user }) => {
  const title = useField('text')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [addBook] = useMutation(ADD_BOOK)

  const navigate = useNavigate()
  useEffect(() => {
    if (token === null) {
      navigate('/login')
    }
  }, [token])

  const submit = async (event) => {
    event.preventDefault()
    addBook({
      variables: { title: title.input.value, author, published: Number(published), genres },
      refetchQueries: [{ query: ALL_BOOKS_AND_GENRES, variables: { genre: null } }, { query: ALL_AUTHORS }, { query: ALL_BOOKS, variables: { genre: user.data.me.favoriteGenre } }]
    })
    console.log('add book...', { title, author, published })

    title.clear()
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            {...title.input}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
