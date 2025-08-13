import { Main } from '@/components/layout/main'
import DashboardComps from './components'
import { useSearch } from '@tanstack/react-router'

export default function Dashboard() {
  const search = useSearch({ from: '/root-layout' })
  return (
    <>
      {/* ===== Main ===== */}
      <Main>
        <div className=''>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
          <p>Search: {search?.q}</p>
        </div>
        <DashboardComps />
      </Main>
    </>
  )
}

