import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppLayout from '@/pages/layout'
import DashboardPage from '@/pages/index'
import MissionPage from '@/pages/mission/MissionPage'
import RewardsPage from '@/pages/rewards'
import ParentPage from '@/pages/parent/index'
import ParentProgressPage from '@/pages/parent/progress'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/mission/:missionId" element={<MissionPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/parent" element={<ParentPage />} />
          <Route path="/parent/progress" element={<ParentProgressPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
