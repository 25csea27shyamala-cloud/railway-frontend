import './App.css'

function App() {
  return (
    <div className="app">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">🚆</div>
          <div>
            <h2>RailMind</h2>
            <span>AI Traffic Control</span>
          </div>
        </div>

        <nav>
          <button className="nav-item active">
            <span>◈</span>
            Dashboard
          </button>

          <button className="nav-item">
            <span>◎</span>
            Live Network
          </button>

          <button className="nav-item">
            <span>◆</span>
            Digital Twin
          </button>

          <button className="nav-item">
            <span>⚡</span>
            What-If Simulator
          </button>

          <button className="nav-item">
            <span>▣</span>
            AI Recommendations
          </button>

          <button className="nav-item">
            <span>◷</span>
            Train Schedule
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="system-status">
            <span className="status-dot"></span>
            <div>
              <strong>System Online</strong>
              <small>AI Engine Active</small>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        {/* HEADER */}
        <header className="topbar">
          <div>
            <p className="eyebrow">RAILWAY OPERATIONS CENTER</p>
            <h1>AI Traffic Command Center</h1>
          </div>

          <div className="header-actions">
            <div className="live-indicator">
              <span className="pulse"></span>
              LIVE
            </div>

            <div className="operator">
              <div className="avatar">OP</div>
              <div>
                <strong>Operator</strong>
                <small>Control Room</small>
              </div>
            </div>
          </div>
        </header>

        {/* OVERVIEW CARDS */}
        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-top">
              <span>Active Trains</span>
              <span className="stat-icon blue">🚆</span>
            </div>
            <strong>42</strong>
            <p><span className="positive">↑ 4.8%</span> from last hour</p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Network Load</span>
              <span className="stat-icon purple">◉</span>
            </div>
            <strong>68%</strong>
            <p><span className="warning">Moderate</span> traffic density</p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Delayed Trains</span>
              <span className="stat-icon orange">⚠</span>
            </div>
            <strong>07</strong>
            <p><span className="negative">2 critical</span> delays detected</p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>AI Confidence</span>
              <span className="stat-icon green">✦</span>
            </div>
            <strong>94.2%</strong>
            <p><span className="positive">High</span> prediction confidence</p>
          </div>
        </section>

        {/* DASHBOARD GRID */}
        <section className="dashboard-grid">

          {/* NETWORK MAP */}
          <div className="panel network-panel">
            <div className="panel-header">
              <div>
                <h2>Live Railway Network</h2>
                <p>Real-time digital twin visualization</p>
              </div>

              <button className="panel-button">
                Full Screen ↗
              </button>
            </div>

            <div className="network-map">
              <div className="map-grid"></div>

              <div className="rail-line line-one"></div>
              <div className="rail-line line-two"></div>
              <div className="rail-line line-three"></div>

              <div className="station station-a">
                <span></span>
                <label>Chennai</label>
              </div>

              <div className="station station-b">
                <span></span>
                <label>Katpadi</label>
              </div>

              <div className="station station-c">
                <span></span>
                <label>Jolarpettai</label>
              </div>

              <div className="station station-d">
                <span></span>
                <label>Bangalore</label>
              </div>

              <div className="train train-one">🚆</div>
              <div className="train train-two">🚆</div>
              <div className="train train-three">🚆</div>

              <div className="map-legend">
                <span><i className="legend-green"></i> Normal</span>
                <span><i className="legend-orange"></i> Congested</span>
                <span><i className="legend-red"></i> Conflict</span>
              </div>
            </div>
          </div>

          {/* AI RECOMMENDATIONS */}
          <div className="panel ai-panel">
            <div className="panel-header">
              <div>
                <h2>AI Recommendations</h2>
                <p>Decision engine suggestions</p>
              </div>

              <span className="ai-badge">AI</span>
            </div>

            <div className="recommendation critical">
              <div className="recommendation-icon">⚠</div>
              <div>
                <strong>Potential Conflict</strong>
                <p>Train 12674 approaching Platform 3.</p>
                <small>Confidence: 96%</small>
              </div>
            </div>

            <div className="recommendation">
              <div className="recommendation-icon">✦</div>
              <div>
                <strong>Suggested Action</strong>
                <p>Hold Train 12674 for 4 minutes.</p>
                <small>Delay reduction: 11 minutes</small>
              </div>
            </div>

            <div className="recommendation">
              <div className="recommendation-icon">↗</div>
              <div>
                <strong>Route Optimization</strong>
                <p>Alternative route available via Line B.</p>
                <small>Estimated improvement: 8.4%</small>
              </div>
            </div>

            <button className="primary-button">
              Open Decision Engine →
            </button>
          </div>
        </section>

        {/* LOWER SECTION */}
        <section className="bottom-grid">

          {/* WHAT IF */}
          <div className="panel whatif-panel">
            <div className="panel-header">
              <div>
                <h2>What-If Decision Simulator</h2>
                <p>Test an action before applying it to the real network.</p>
              </div>

              <span className="simulation-badge">SIMULATION</span>
            </div>

            <div className="scenario">
              <div className="scenario-number">01</div>

              <div className="scenario-content">
                <strong>Hold Train 12674</strong>
                <span>Platform 3 • 4 minutes</span>
              </div>

              <div className="scenario-result">
                <span>Expected delay</span>
                <strong>-11 min</strong>
              </div>

              <button className="test-button">Test</button>
            </div>

            <div className="scenario">
              <div className="scenario-number">02</div>

              <div className="scenario-content">
                <strong>Reroute Train 12028</strong>
                <span>Line A → Line B</span>
              </div>

              <div className="scenario-result">
                <span>Conflict risk</span>
                <strong>Low</strong>
              </div>

              <button className="test-button">Test</button>
            </div>
          </div>

          {/* TRAIN STATUS */}
          <div className="panel train-panel">
            <div className="panel-header">
              <div>
                <h2>Train Status</h2>
                <p>Live operational overview</p>
              </div>

              <button className="panel-button">View All</button>
            </div>

            <div className="train-row">
              <div className="train-info">
                <strong>12674</strong>
                <span>Chennai → Bangalore</span>
              </div>
              <span className="status delayed">Delayed 6m</span>
            </div>

            <div className="train-row">
              <div className="train-info">
                <strong>12028</strong>
                <span>Chennai → Mumbai</span>
              </div>
              <span className="status ontime">On Time</span>
            </div>

            <div className="train-row">
              <div className="train-info">
                <strong>12622</strong>
                <span>Chennai → New Delhi</span>
              </div>
              <span className="status ontime">On Time</span>
            </div>

            <div className="train-row">
              <div className="train-info">
                <strong>12840</strong>
                <span>Chennai → Howrah</span>
              </div>
              <span className="status warning-status">+2m</span>
            </div>
          </div>

        </section>

        {/* FOOTER */}
        <footer>
          <span>RailMind AI Railway Traffic Management System</span>
          <span>Digital Twin • Predictive AI • What-If Simulation</span>
        </footer>
      </main>
    </div>
  )
}

export default App