import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { Provider } from 'jotai'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ErrorBoundary } from 'react-error-boundary'
const queryClient = new QueryClient()
const root = createRoot((document.getElementById('root') as HTMLElement))
root.render(
  <React.StrictMode>
    <Provider>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary fallback={<h1>Произошла ошибка! Обновите страницу</h1>}>
          <App />
        </ErrorBoundary>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
)