import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Call, Agent } from "../types/UserDashCall";

export const useDashboardData = () => {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "Nombre del Usuario";
  const role = searchParams.get("role") || "agent";
  const id_team = Number(searchParams.get("id_team")) || 0;
  const idFromParams = searchParams.get("id");
  const id_user =
    idFromParams && !isNaN(Number(idFromParams)) ? Number(idFromParams) : 0;

  const [calls, setCalls] = useState<Call[]>([]);
  const [teamAgents, setTeamAgents] = useState<Agent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null);

  const fetchUserCalls = async (userId: number) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/User/${userId}`,
        {
          headers: {
            "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
          },
        }
      );
      const data = await res.json();
      setCalls(data.calls || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    if (role === "TeamLeader" && id_team) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        headers: {
          "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY || "",
        },
      })
        .then((res) => res.json())
        .then((users) => {
          const agents = users.filter(
            (u: Agent) =>
              u.role.toLowerCase() === "agent" &&
              String(u.id_team) === String(id_team)
          );
          setTeamAgents(agents);
        })
        .catch((err) => console.error("Error fetching agents:", err));
    } else if (id_user !== null) {
      fetchUserCalls(id_user);
    }
  }, [role, id_team, id_user]);

  const getAverageCallDuration = () =>
    calls.length === 0
      ? 0
      : calls.reduce((acc, c) => acc + c.duration, 0) / calls.length;

  const getEmotionDistribution = () => {
    const result = { happiness: 0, sadness: 0, anger: 0 };
    calls.forEach((call) => {
      call.report?.speakers?.forEach((s) => {
        (["happiness", "sadness", "anger"] as const).forEach((e) => {
          const val = s.emotions[e];
          if (typeof val === "number") result[e] += val;
        });
      });
    });
    return result;
  };

  return {
    name,
    role,
    id_team,
    calls,
    teamAgents,
    selectedAgentId,
    setSelectedAgentId,
    fetchUserCalls,
    getAverageCallDuration,
    getEmotionDistribution,
  };
};
