import type { Mission, Difficulty } from '@/missions/types/mission.types'
import { StubMissionRunner } from '@/missions/modules/_stub/StubMissionRunner'
import { getMissionComponent } from '@/missions/modules/registry'
import { MissionCompleteHandler } from '@/components/missions/common/MissionCompleteHandler'

interface MissionRunnerProps {
  mission: Mission
  difficulty: Difficulty
}

export function MissionRunner({ mission, difficulty }: MissionRunnerProps) {
  const ModuleComponent = getMissionComponent(mission.type)

  if (!ModuleComponent) {
    return <StubMissionRunner mission={mission} />
  }

  return (
    <MissionCompleteHandler mission={mission}>
      {(onComplete) => (
        <ModuleComponent mission={mission} difficulty={difficulty} onComplete={onComplete} />
      )}
    </MissionCompleteHandler>
  )
}
