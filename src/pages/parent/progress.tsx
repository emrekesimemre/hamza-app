import { useState } from "react";
import { Link } from "react-router-dom";
import { useMissionStore } from "@/store/useMissionStore";
import { getMissionById } from "@/missions/catalog/missionCatalog";
import { SUBJECT_LABELS } from "@/missions/types/mission.types";
import { ParentPinGate } from "@/components/parent/ParentPinGate";
import { ArrowLeft } from "lucide-react";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ParentProgressPage() {
  const [verified, setVerified] = useState(false);

  const parentPinHash = useMissionStore((s) => s.parentPinHash);
  const setParentPin = useMissionStore((s) => s.setParentPin);
  const progress = useMissionStore((s) => s.progress);
  const rewardPurchaseHistory = useMissionStore((s) => s.rewardPurchaseHistory);

  if (!verified) {
    return (
      <ParentPinGate
        pinHash={parentPinHash}
        onVerified={() => setVerified(true)}
        onSetupPin={setParentPin}
      />
    );
  }

  const recentLogs = [...progress].reverse().slice(0, 20);
  const recentRewards = rewardPurchaseHistory.slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/parent"
          className="flex items-center gap-1 rounded-xl px-2 py-2 font-semibold text-gray-600 transition hover:bg-white/60"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-extrabold text-gray-800">
          Detaylı İlerleme
        </h1>
      </div>

      {recentRewards.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-bold text-purple-700">Son Ödül Alımları</h2>
          <div className="space-y-2">
            {recentRewards.map((purchase, i) => (
              <div
                key={`${purchase.rewardId}-${purchase.purchasedAt}-${i}`}
                className="flex items-center gap-3 rounded-2xl bg-purple-50 p-4"
              >
                <span className="text-3xl">{purchase.icon}</span>
                <div className="flex-1">
                  <p className="font-bold text-gray-800">{purchase.rewardName}</p>
                  <p className="text-xs text-gray-500">{formatDate(purchase.purchasedAt)}</p>
                </div>
                <p className="font-bold text-yellow-600">-{purchase.cost} ⭐</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {recentLogs.length === 0 ? (
        <p className="text-center text-gray-500">Henüz tamamlanan görev yok.</p>
      ) : (
        <section>
          <h2 className="mb-3 text-sm font-bold text-gray-700">Görev Geçmişi</h2>
          <div className="space-y-3">
            {recentLogs.map((log, i) => {
              const mission = getMissionById(log.missionId);
              const total = log.correctCount + log.wrongCount;
              const accuracy =
                total > 0 ? Math.round((log.correctCount / total) * 100) : 0;

              return (
                <div
                  key={`${log.missionId}-${log.completedAt}-${i}`}
                  className="rounded-2xl bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{mission?.icon ?? "📋"}</span>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">
                        {mission?.title ?? log.missionId}
                      </p>
                      <p className="text-sm text-gray-500">
                        {SUBJECT_LABELS[log.subject]}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-yellow-600">
                        +{log.starsEarned} ⭐
                      </p>
                      <p className="text-xs text-gray-400">{accuracy}% doğru</p>
                    </div>
                  </div>
                  {mission && (
                    <p className="mt-2 text-xs text-gray-400">
                      Tahmini süre: ~{mission.estimatedMinutes} dk
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
