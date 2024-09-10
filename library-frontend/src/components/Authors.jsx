import { useMutation, useQuery } from '@apollo/client'
import { ALL_AUTHORS, EDIT_BIRTH } from '../queries'
import { useField } from '../hooks/useField'
import Select from 'react-select'
import { useState } from 'react'

const EditAuthor = ({ authors }) => {
  // const name = useField('text')
  const born = useField('number')
  const [selectedName, setSelectedName] = useState(null)
  const options = authors.map(el => ({ value: el.name, label: el.name }))

  const [editBirth] = useMutation(EDIT_BIRTH)

  const editAuthor = (event) => {
    event.preventDefault()
    // console.log(selectedName.value)
    editBirth({
      variables: { name: selectedName.value, setBornTo: Number(born.input.value) },
      refetchQueries: [{ query: ALL_AUTHORS }]
    })
    // name.clear()
    setSelectedName(null)
    born.clear()
  }
  return (
    <section>
      <h2>Edit</h2>
      <form onSubmit={editAuthor}>
        {/* <label htmlFor="authorName">Name:</label><input id="authorName" {...name.input} /><br /> */}
        <Select defaultValue={selectedName} onChange={setSelectedName} options={options}/>
        <label htmlFor="authorBirth">Born: </label><input id="authorBirth" {...born.input} /> <br />
        <button type='submit'>Save</button>
      </form>
    </section>
  )
}

const Authors = (props) => {
  const query = useQuery(ALL_AUTHORS)
  console.log(query)
  if (query.loading) {
    return <div>loading</div>
  }

  const authors = query.data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <EditAuthor authors={authors}/>
    </div>
  )
}

export default Authors
