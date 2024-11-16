import { createBrowserRouter, Navigate } from 'react-router-dom'
import Landing from '@/views/Landing.tsx'
import { BuildReputationModel } from '@/views/buildReputationModel/BuildReputationModel.tsx'
import { GetReputationScore } from '@/views/getReputationScore/GetReputationScore.tsx'
import { ChatContainer } from './layouts/ChatContainer.tsx'
import MainLayout from './layouts/MainLayout.tsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '',
        element: <Landing />,
      },
      {
        path: 'build',
        element: <BuildReputationModel />,
      },
      {
        path: 'chat',
        element: <ChatContainer />,
      },
      {
        path: 'compute',
        element: <GetReputationScore />,
      },
      {
        path: '*',
        element: <Navigate to="/" />,
      },
    ],
  },
])
