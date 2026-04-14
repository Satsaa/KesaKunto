const surfaces = [
  {
    title: "Food Logging",
    detail: "Single entry flow for AI, barcode, manual, and pantry-based logging.",
  },
  {
    title: "Pantry",
    detail: "Multi-pantry inventory with expiry awareness and AI-ready context.",
  },
  {
    title: "Metrics",
    detail: "Built-in and user-defined tracking with references, charts, and percentiles.",
  },
  {
    title: "Daily Plan",
    detail: "Conversational meal planning that depletes pantry ingredients through normal actions.",
  },
] as const;

export function App() {
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">KesaKunto</p>
        <h1>Single showcase app for fast product iteration.</h1>
        <p className="lede">
          Vite-powered sandbox for exploring the app surface without carrying old Expo demos forward.
        </p>
      </section>

      <section className="grid" aria-label="Feature areas">
        {surfaces.map((surface) => (
          <article className="card" key={surface.title}>
            <h2>{surface.title}</h2>
            <p>{surface.detail}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
