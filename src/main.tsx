import { Auth0Provider } from '@auth0/auth0-react'
import '@fontsource/righteous/latin-400.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from './router.tsx'
import { checkEnvVars } from './utils/checkEnvVars.ts'

checkEnvVars()

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
      domain="dev-zsd8i1o5y66645u3.us.auth0.com"
      clientId="lsFRrglyTDTzlAsJoUMDkuAeX8zgMxqt"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Auth0Provider>
  </StrictMode>
)
