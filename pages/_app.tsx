import '../styles/globals.css'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import type { AppProps, NextWebVitalsMetric } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'
import {ReactQueryDevtools} from 'react-query/devtools'
import { supabase } from '../utils/supabase'


export function reportWebVitals(metric: NextWebVitalsMetric) {
  switch(metric.name) {
    case 'FCP': 
      console.log(`FCP: ${Math.round(metric.value * 10) / 10}`)
      break
    case 'LCP': 
      console.log(`LCP: ${Math.round(metric.value * 10) / 10}`)
      break
    case 'TTFB': 
      console.log(`TTFB: ${Math.round(metric.value * 10) / 10}`)
      break
    case 'Next.js-hydration':
      console.log(
        `Hydration: ${Math.round(metric.startTime * 10) / 10} -> ${
          Math.round((metric.startTime + metric.value) * 10) / 10
        }`
      )
      break
    default: 
      break
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false
    }
  }
})

export default function App({ Component, pageProps }: AppProps) {
  const {push, pathname} = useRouter()
  const validateSession = async() => {
    const user = await supabase.auth.getUser()
    if (user.data.user && pathname === '/') {
      console.log('user', user)
      push('/dashboard')
    } else if (!user.data.user && pathname !== '/') {
      await push('/')
    }
  }
  supabase.auth.onAuthStateChange((event, _) => {
    if (event === 'SIGNED_IN' && pathname === '/') {
      push('/dashboard')
    }
    if (event === 'SIGNED_OUT') {
      push('/')
    }
  })
  useEffect(() => {
    validateSession()
  }, [])
  return (
    <QueryClientProvider client={queryClient}> 
      <Component {...pageProps} />
      <ReactQueryDevtools initialIsOpen={false}/>
    </QueryClientProvider>
  )
}
