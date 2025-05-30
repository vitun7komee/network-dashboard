import HeuristicIncidentList from "../components/HeuristicIncidentList";

export default function ThreatIntelPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">🧠 Threat Intelligence & Heuristics</h1>
      <HeuristicIncidentList />
    </div>
  );
}
