import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'
import { useEffect } from 'react'
import { useField } from '../hooks/useField'
import { useNavigate } from 'react-router-dom'

const Login = ({ setToken }) => {
  const navigate = useNavigate()
  const username = useField('text')
  const password = useField('password')
  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
    //   setError(error.graphQLErrors[0].message)
      console.error(error.graphQLErrors[0].message)
    }
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
      navigate('/')
    }
  }, [result.data])

  const submitLoginForm = async (event) => {
    event.preventDefault()
    // console.log('login in', username.input.value, password.input.value)
    login({ variables: { username: username.input.value, password: password.input.value } })
  }

  return (
    <>
      <h2>login form</h2>
      <form onSubmit={submitLoginForm}>
        <input {...username.input} /> <br />
        <input {...password.input} /> <br />
        <button type="submit">login</button>
      </form>
    </>
  )
}
export default Login
