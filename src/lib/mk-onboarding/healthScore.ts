// Client health score — derived 0-100 metric.
// Reflects operational health: how active, how unblocked, how fresh.

export type HealthInputs = {
  status: string;                   // active | onboarding | paused | rescue | ...
  openQuestions: number;
  blockers: number;                 // deliverables in blocked state
  inProgress: number;
  shipped: number;                  // shipped deliverables count
  daysSinceLastShip: number | null;
  daysSinceLastActivity: number;    // any table touched
  hasBrandVoice: boolean;
  hasIntegrations: boolean;
  hasPrimaryContact: boolean;
  performanceSnapshotsLast90d: number;
};

export function computeHealth(h: HealthInputs): { score: number; factors: { label: string; delta: number }[] } {
  let score = 70;
  const factors: { label: string; delta: number }[] = [];

  // Status signal (hard)
  if (h.status === "rescue") { score -= 30; factors.push({ label: "Status: Rescue", delta: -30 }); }
  else if (h.status === "paused") { score -= 15; factors.push({ label: "Status: Pauziran", delta: -15 }); }
  else if (h.status === "active") { score += 5; factors.push({ label: "Status: Aktivan", delta: +5 }); }

  // Blockers hurt
  if (h.blockers > 0) {
    const d = -Math.min(25, h.blockers * 8);
    score += d;
    factors.push({ label: `${h.blockers} blokiranih deliverable-a`, delta: d });
  }

  // Open questions slight drag
  if (h.openQuestions >= 5) { score -= 10; factors.push({ label: `${h.openQuestions} otvorenih pitanja`, delta: -10 }); }
  else if (h.openQuestions > 0) { score -= 3; factors.push({ label: `${h.openQuestions} otvorena pitanja`, delta: -3 }); }

  // In-progress work = good health
  if (h.inProgress > 0) { const d = Math.min(10, h.inProgress * 3); score += d; factors.push({ label: `${h.inProgress} aktivnih deliverable-a`, delta: +d }); }

  // Shipped momentum
  if (h.daysSinceLastShip !== null) {
    if (h.daysSinceLastShip <= 7) { score += 10; factors.push({ label: "Ship u poslednjih 7 dana", delta: +10 }); }
    else if (h.daysSinceLastShip <= 30) { score += 3; factors.push({ label: "Ship u poslednjih 30 dana", delta: +3 }); }
    else if (h.daysSinceLastShip > 60) { score -= 10; factors.push({ label: `${h.daysSinceLastShip} dana bez ship-a`, delta: -10 }); }
  }

  // Recency of any activity
  if (h.daysSinceLastActivity > 30) { score -= 8; factors.push({ label: `${h.daysSinceLastActivity} dana bez aktivnosti`, delta: -8 }); }
  else if (h.daysSinceLastActivity <= 3) { score += 5; factors.push({ label: "Skoro azurirano", delta: +5 }); }

  // Data completeness bonuses
  if (!h.hasBrandVoice) { score -= 4; factors.push({ label: "Nema brand voice-a", delta: -4 }); }
  if (!h.hasPrimaryContact) { score -= 4; factors.push({ label: "Nema primary kontakta", delta: -4 }); }
  if (!h.hasIntegrations) { score -= 3; factors.push({ label: "Nema registrovanih integracija", delta: -3 }); }

  // Performance tracking maturity
  if (h.performanceSnapshotsLast90d === 0) { score -= 3; factors.push({ label: "Nema performance snapshot-a", delta: -3 }); }
  else if (h.performanceSnapshotsLast90d >= 8) { score += 4; factors.push({ label: "Redovni snapshoti", delta: +4 }); }

  return { score: Math.max(0, Math.min(100, Math.round(score))), factors };
}
