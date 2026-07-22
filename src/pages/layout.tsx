import { Outlet, useLocation, Navigate } from 'react-router-dom'
import { AppHeader } from '@/components/layout/AppHeader'
import { useMissionStore } from '@/store/useMissionStore'
import { useActiveTimer, useDayInitializer, useTimeWarning } from '@/hooks/useActiveTimer'

function MissionRouteGuard({ children }: { children: React.ReactNode }) {
  const isLocked = useMissionStore((s) => s.isLocked)
  const timeLimitReached = useMissionStore((s) => s.timeLimitReached)
  const currentMissionId = useMissionStore((s) => s.currentMissionId)

  // Soft lock: allow active mission to continue
  if (isLocked && currentMissionId === null) {
    return <Navigate to="/" replace />
  }

  if (timeLimitReached && currentMissionId === null) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default function AppLayout() {
  useDayInitializer()
  useActiveTimer()
  const timeWarning = useTimeWarning()
  const location = useLocation()
  const isMissionRoute = location.pathname.startsWith('/mission/')

  return (
    <div className="min-h-dvh">
      <AppHeader />

      {timeWarning && (
        <div className="bg-yellow-100 px-4 py-2 text-center text-sm font-bold text-yellow-800">
          {timeWarning}
        </div>
      )}

      <main className="mx-auto max-w-2xl px-4 py-6">
        {isMissionRoute ? (
          <MissionRouteGuard>
            <Outlet />
          </MissionRouteGuard>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  )
}
