import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import { Routes, Route, Link } from 'react-router-dom'
import { useApolloClient, useQuery, useSubscription } from '@apollo/client'
import { Recommendations } from './components/Recommendations'
import { ALL_BOOKS, BOOK_ADDED, ME } from './queries'


// export const updateCache = (cache, query, addedBook) => {
//   // helper that is used to eliminate saving same person twice
//   // const uniqByTitle = (a) => {
//   //   let seen = new Set()
//   //   return a.filter((item) => {
//   //     let k = item.title
//   //     return seen.has(k) ? false : seen.add(k)
//   //   })
//   // }

//   // cache.updateQuery(query, ({ allBooks }) => {
//   //   return {
//   //     allBooks: allBooks.concat(addedBook),
//   //   }
//   // })
// }

const App = () => {
  const navStyle = {
    nav: {
      display: 'flex',
      gap: 12,
      paddingBottom: 8,
      borderBottom: '1px solid gray'
    },
    link: {
      textDecoration: 'none',
      border: '1px solid gray',
      color: 'black',
      padding: 8,
      borderRadius: 4
    }
  }
  const me = useQuery(ME)
  const client = useApolloClient()
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))
  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }
  useSubscription(BOOK_ADDED, {
    onError: (error) => { console.log(error) },
    onData: ({ data,client }) => {
      console.log(data)
      alert(`The book ${data.data.bookAdded.title} was added`)

      console.log(client)

      client.cache.updateQuery({ query: ALL_BOOKS }, ({allBooks} ) => {
        console.log('updating cache',allBooks)
        return {
          allBooks: allBooks.concat(data.data.bookAdded)
        }
      })
    }
  })

  const menu = !token
    ? (<nav style={navStyle.nav}>
          <Link style={navStyle.link} to={'/authors'}>authors</Link>
          <Link style={navStyle.link} to={'/books'}>books</Link>
          <Link style={navStyle.link} to={'/login'}>login</Link>
        </nav>)

    : (<nav style={navStyle.nav}>
          <Link style={navStyle.link} to={'/authors'}>authors</Link>
          <Link style={navStyle.link} to={'/books'}>books</Link>
          <Link style={navStyle.link} to={'/newBook'}>add book</Link>
          <Link style={navStyle.link} to={'/recommendations'}>recommendations</Link>
          <button style={navStyle.link} onClick={logout} >logout</button>
    </nav>)
  return (
    <div>
      <header>
        {menu}
      </header>

    <Routes>
      <Route path='/authors' element={<Authors/>}/>
      <Route path='/books' element={<Books/>}/>
      <Route path='/login' element={<Login setToken={setToken}/>}/>
      <Route path='/newBook' element={<NewBook token={token} user={me}/>}/>
      <Route path='/recommendations' element={<Recommendations user={me}/>}/>
      <Route path='/*' element={<Authors/>}/>
    </Routes>
    </div>
  )
}

export default App
