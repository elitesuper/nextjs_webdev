import CenterLayout from '@layouts/CenterLayout'
import Loading from '@elements/Loading'
import { useRouter } from 'next/router'
import { getSession } from 'next-auth/react'
import { useEffect } from 'react'

const LOADING_TIME = 5000

export default function Home() {
  const router = useRouter()
  useEffect(() => {
    setTimeout(() => {
      getSession().then((session) => {
        if (session) {
          router.replace('/dashboard')
        } else {
          router.replace('/signin')
        }
      })
    }, LOADING_TIME)
  })

  return (
    <CenterLayout title="Loading..">
      <Loading />
    </CenterLayout>
  )
}
