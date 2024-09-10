import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

export const Recommendations = ({ user }) => {
  if (!user.loading) {
    const myFavoriteBooks = useQuery(ALL_BOOKS, { variables: { genre: user.data.me.favoriteGenre } })

    if (myFavoriteBooks.loading) return (<div>loading recommendations...</div>)
    return (
        <>
            <h1>My Recommendations</h1>
            <p>Your favourite genre: <b>{user.data.me.favoriteGenre}</b></p>
            <ul>
                {myFavoriteBooks.data.allBooks.map(b => <li key={b.id}>{b.title}   by {b.author.name} | {b.published}</li>)}
            </ul>
        </>
    )
  } else {
    return (<div>loading recommendations...</div>)
  }
}
