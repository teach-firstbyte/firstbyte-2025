import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
  } from '@/components/ui/card'
  import { Button } from '@/components/ui/button'
  import Link from 'next/link'

  const COPY: Record<string, { title: string; description: string; action: string }> = {
       signup: {
         title: 'Confirm your email',
         description: 'Click below to finish confirming your account.',
         action: 'Confirm my email',
       },
       email: {
         title: 'Confirm your email',
         description: 'Click below to finish confirming your account.',
         action: 'Confirm my email',
       },
       recovery: {
         title: 'Reset your password',
         description: 'Click below to continue to the password reset form.',
         action: 'Continue',
       },
       magiclink: {
         title: 'Log in to FirstByte',
         description: 'Click below to finish logging in.',
         action: 'Log in',
       },
       email_change: {
         title: 'Confirm your new email address',
         description: 'Click below to finish updating your email address.',
         action: 'Confirm my email',
       },
     }
    
     const FALLBACK = {
       title: 'Confirm this request',
       description: 'Click below to continue.',
       action: 'Continue',
     }
  
  export default async function ConfirmPage({
    searchParams,
  }: {
    searchParams: Promise<{ token_hash?: string; type?: string; next?: string }>
  }) {
    const { token_hash, type, next } = await searchParams
  
    // Nothing verifies here — this page is inert on load, which is the point.
    if (!token_hash || !type) {
      return (
        <div className="container mx-auto flex min-h-screen max-w-sm flex-col justify-center p-6">
          <Card>
            <CardHeader>
              <CardTitle>Invalid link</CardTitle>
              <CardDescription>
                This link is missing information. Try signing in or requesting a new one.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/login">Back to log in</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }
  
    const params = new URLSearchParams({ token_hash, type })
    if (next) params.set('next', next)
    const confirmHref = `/auth/callback?${params.toString()}`
    const copy = COPY[type] ?? FALLBACK
  
    return (
      <div className="container mx-auto flex min-h-screen max-w-sm flex-col justify-center p-6">
        <Card>
          <CardHeader>
            <CardTitle>{copy.title}</CardTitle>
            <CardDescription>
              {copy.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href={confirmHref}>{copy.action}</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }