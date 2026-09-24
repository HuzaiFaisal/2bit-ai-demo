export default function Loading() {
  return <main aria-label="Loading dashboard" aria-busy="true">
    <div className="skeleton-line short" />
    <div className="skeleton-line" style={{ width: "42%", height: 26 }} />
    <div className="metric-grid" style={{ marginTop: 28 }}>
      {Array.from({ length: 4 }, (_, index) => <div className="skeleton-card" key={index}><div className="skeleton-line short" /><div className="skeleton-line" style={{ width: "60%" }} /></div>)}
    </div>
    <div className="skeleton-card" style={{ height: 300, marginTop: 18 }}>
      {Array.from({ length: 6 }, (_, index) => <div className="skeleton-line" key={index} />)}
    </div>
  </main>;
}
