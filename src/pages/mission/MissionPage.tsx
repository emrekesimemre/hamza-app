import { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMissionById } from "@/missions/catalog/missionCatalog";
import { resolveDifficulty } from "@/missions/engine/difficultyEngine";
import { useMissionStore } from "@/store/useMissionStore";
import { MissionRunner } from "@/missions/modules/MissionRunner";
import { ArrowLeft } from "lucide-react";

export default function MissionPage() {
  const { missionId } = useParams<{ missionId: string }>();
  const navigate = useNavigate();
  const startMission = useMissionStore((s) => s.startMission);
  const exitMission = useMissionStore((s) => s.exitMission);
  const timeLimitReached = useMissionStore((s) => s.timeLimitReached);
  const currentMissionId = useMissionStore((s) => s.currentMissionId);
  const dailyMissions = useMissionStore((s) => s.dailyMissions);
  const difficultyByType = useMissionStore((s) => s.difficultyByType);

  const mission = missionId ? getMissionById(missionId) : undefined;
  const dailyMission = dailyMissions.find((dm) => dm.missionId === missionId);

  const difficulty = useMemo(() => {
    if (!mission) return 1;
    if (dailyMission) return dailyMission.resolvedDifficulty;
    return resolveDifficulty(mission.type, difficultyByType);
  }, [mission, dailyMission, difficultyByType]);

  useEffect(() => {
    if (!missionId || !mission) {
      navigate("/");
      return;
    }

    if (timeLimitReached && currentMissionId !== missionId) {
      navigate("/");
      return;
    }

    if (currentMissionId !== missionId) {
      const started = startMission(missionId);
      if (!started) navigate("/");
    }
  }, [
    missionId,
    mission,
    startMission,
    navigate,
    timeLimitReached,
    currentMissionId,
  ]);

  const handleExit = () => {
    exitMission();
    navigate("/");
  };

  if (!mission) return null;

  return (
    <div>
      <button
        type="button"
        onClick={handleExit}
        className="mb-4 flex items-center gap-2 rounded-xl px-3 py-2 font-semibold text-gray-600 transition hover:bg-white/60"
      >
        <ArrowLeft className="h-5 w-5" />
        Geri
      </button>
      <MissionRunner mission={mission} difficulty={difficulty} />
    </div>
  );
}
