import { useState, useEffect } from 'react'

const API_BASE = 'http://localhost:8000/api'

const GetInvolved = () => {
  const [csrfToken, setCsrfToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch(`${API_BASE}/accounts/csrf/`, { credentials: 'include' })
      .then((response) => response.json())
      .then((data) => setCsrfToken(data.csrfToken || ''))
      .catch(() => setCsrfToken(''))
  }, [])

  const api = async (path, body) => {
    const response = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      body: JSON.stringify(body),
    })
    const data = await response.json()
    if (!response.ok) {
      throw data
    }
    return data
  }

  const handleSignup = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')
    const form = event.target
    try {
      await api('/accounts/register/', {
        username: form.elements.username.value,
        email: form.elements.email.value,
        password: form.elements.password.value,
        password_confirm: form.elements.password_confirm.value,
      })
      setMessage('Account created successfully. You can now log in.')
      form.reset()
    } catch (data) {
      setError(JSON.stringify(data?.non_field_errors ?? data ?? 'Signup failed'))
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')
    const form = event.target
    try {
      const data = await api('/accounts/login/', {
        username: form.elements.username.value,
        password: form.elements.password.value,
      })
      setUser(data.user)
      setMessage('Logged in successfully.')
      form.reset()
    } catch (data) {
      setError(JSON.stringify(data?.non_field_errors ?? data ?? 'Login failed'))
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    setLoading(true)
    try {
      await api('/accounts/logout/', {})
      setUser(null)
      setMessage('Logged out successfully.')
    } catch {
      setMessage('Logout failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="get-involved">
      <section className="get-involved-hero">
        <h2>Get Involved</h2>
        <p>Join SOCCODO and help create sustainable change in our communities.</p>
      </section>

      <div className="auth-forms">
        <div className="auth-card">
          <h3>Create an account</h3>
          <p>Sign up to volunteer, donate, or participate in our programs.</p>
          <form onSubmit={handleSignup} noValidate>
            <div className="form-group">
              <label>Username</label>
              <input name="username" type="text" required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input name="password" type="password" required />
            </div>
            <div className="form-group">
              <label>Confirm password</label>
              <input name="password_confirm" type="password" required />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create account'}
            </button>
          </form>
        </div>

        <div className="auth-card">
          <h3>Admin login</h3>
          <p>Sign in as administrator (username: admin, email: admin@gmail.com).</p>
          <form onSubmit={handleLogin} noValidate>
            <div className="form-group">
              <label>Username or email</label>
              <input name="username" type="text" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input name="password" type="password" required />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Log in'}
            </button>
          </form>
          {user && (
            <div className="user-info">
              <p>Logged in as <strong>{user.username}</strong> ({user.email})</p>
              <button type="button" onClick={handleLogout} disabled={loading}>
                Log out
              </button>
            </div>
          )}
        </div>
      </div>

      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
    </div>
  )
}

export default GetInvolved
