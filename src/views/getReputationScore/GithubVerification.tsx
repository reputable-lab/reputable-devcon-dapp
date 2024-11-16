import { useAuth0 } from '@auth0/auth0-react'
import { Github, Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

interface GithubVerificationProps {
  githubUsername: string
  onVerificationComplete: (isVerified: boolean) => void
}

const GithubVerification: React.FC<GithubVerificationProps> = ({
  githubUsername,
  onVerificationComplete,
}) => {
  const { loginWithRedirect, isAuthenticated, getIdTokenClaims } = useAuth0()
  const [isVerifying, setIsVerifying] = useState(false)

  const verifyGithubIdentity = async () => {
    setIsVerifying(true)
    if (!isAuthenticated) {
      await loginWithRedirect({
        authorizationParams: {
          connection: 'github',
          screen_hint: 'signup',
        },
      })
      // The function will end here as the page will redirect to GitHub
      return
    }

    try {
      const claims = await getIdTokenClaims()
      const githubUser = claims?.['https://github.com/username']

      if (githubUser && githubUser.toLowerCase() === githubUsername.toLowerCase()) {
        onVerificationComplete(true)
      } else {
        console.error('GitHub username mismatch')
        onVerificationComplete(false)
      }
    } catch (error) {
      console.error('Error verifying GitHub identity:', error)
      onVerificationComplete(false)
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <Button onClick={verifyGithubIdentity} disabled={isVerifying}>
      {isVerifying ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Verifying...
        </>
      ) : (
        <>
          <Github className="mr-2 h-4 w-4" />
          Verify GitHub Identity
        </>
      )}
    </Button>
  )
}

export { GithubVerification }
