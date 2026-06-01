import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { SiteLayout } from '@/components/SiteLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/login')({
  head: () => ({
    meta: [
      { title: 'Admin Login — Uyisenga Ni Imanzi' },
      { name: 'description', content: 'Login to the admin dashboard for Uyisenga Ni Imanzi.' },
    ],
  }),
  component: LoginPage,
})

function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@gmail.com')
  const [password, setPassword] = useState('Admin123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      if (data.success) {
        localStorage.setItem('auth_token', data.token)
        localStorage.setItem('auth_email', data.email)
        router.navigate({ to: '/admin' })
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (err) {
      setError('Unable to login. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24">
        <Card className="border border-border bg-card p-8 shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle className="text-3xl">Admin Login</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter the email and password to manage news stories and the homepage content.
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Checking...' : 'Sign in'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </SiteLayout>
  )
}
