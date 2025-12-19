import React from "react";

const TravelAnalysis = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🛡️ GreenGuard Safety Agent
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            An agentic safety companion that reasons about environmental risk
            while you navigate — not just where you go, but how safe the journey is.
          </p>
        </div>

        {/* Core Agent Description */}
        <div className="bg-white rounded-2xl shadow-xl p-10 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            What is the GreenGuard Safety Agent?
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            The <strong>GreenGuard Safety Agent</strong> is an intelligent, agent-driven
            safety layer designed to operate alongside traditional navigation systems.
            Instead of optimizing only for distance or time, GreenGuard continuously
            reasons about <strong>environmental safety conditions</strong> that impact
            human health during a journey.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            GreenGuard does not attempt to replace navigation apps. Instead, it acts as a
            <strong> decision-support companion</strong>, observing the environment,
            evaluating risk, and intervening only when safety truly matters.
          </p>
        </div>

        {/* Observe Decide Act */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-blue-500">
            <h3 className="text-xl font-bold text-gray-800 mb-4">👀 Observe</h3>
            <p className="text-gray-700 leading-relaxed">
              GreenGuard continuously observes the user’s live location and gathers
              surrounding environmental signals such as <strong>air quality (AQI)</strong>
              and <strong>wind conditions</strong> using real-world public data sources.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-green-500">
            <h3 className="text-xl font-bold text-gray-800 mb-4">🧠 Decide</h3>
            <p className="text-gray-700 leading-relaxed">
              Using deterministic, profile-aware logic, the agent evaluates safety risk
              and detects <strong>meaningful changes</strong> in environmental conditions,
              rather than reacting to every minor fluctuation.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-red-500">
            <h3 className="text-xl font-bold text-gray-800 mb-4">🚨 Act</h3>
            <p className="text-gray-700 leading-relaxed">
              When risk thresholds are crossed, GreenGuard proactively generates
              <strong> clear, human-readable safety advisories</strong>, delivered visually
              and through voice alerts — without overwhelming the user.
            </p>
          </div>
        </div>

        {/* Design Philosophy */}
        <div className="bg-white rounded-2xl shadow-xl p-10 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            GreenGuard Design Philosophy
          </h2>

          <ul className="space-y-4 text-gray-700 text-lg">
            <li>
              • <strong>Agent-first architecture:</strong> Built explicitly around the
              Observe → Decide → Act loop, not passive data dashboards.
            </li>
            <li>
              • <strong>Non-intrusive by design:</strong> Alerts trigger only when safety
              severity changes, preventing alert fatigue.
            </li>
            <li>
              • <strong>Responsible AI usage:</strong> AI is used to explain and
              communicate risk, not to make opaque or irreversible decisions.
            </li>
            <li>
              • <strong>Graceful degradation:</strong> GreenGuard continues operating
              even if AI services are unavailable.
            </li>
          </ul>
        </div>

        {/* Why It Matters */}
        <div className="bg-white rounded-2xl shadow-xl p-10 mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Why GreenGuard Matters
          </h2>

          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Environmental risks during travel are often invisible — pollution hotspots,
            sudden drops in air quality, or unfavorable wind conditions can directly
            impact health, especially for cyclists, pedestrians, and individuals with
            respiratory sensitivities.
          </p>

          <p className="text-gray-700 text-lg leading-relaxed">
            GreenGuard makes these hidden risks visible and actionable, empowering users
            to make <strong>safer, more informed travel decisions</strong> without adding
            complexity to their navigation experience.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl shadow-xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Experience GreenGuard in Action
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-white">
            Launch the dedicated GreenGuard Safety Agent interface to observe real-time
            environmental signals, risk reasoning, and proactive safety alerts during
            navigation.
          </p>
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-green-700 font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-gray-100 transition-all"
          >
            Open GreenGuard Safety Agent Dashboard →
          </a>
        </div>

      </div>
    </div>
  );
};

export default TravelAnalysis;
