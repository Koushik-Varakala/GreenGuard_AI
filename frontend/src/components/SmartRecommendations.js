import React from 'react';

const SmartRecommendations = ({ destination, isHighAltitude, hasAsthma, userType, travelDate, aqi }) => {
  const recommendations = {
    clothing: [],
    essentials: [],
    medical: [],
    general: [],
  };

  // High Altitude Recommendations
  if (isHighAltitude) {
    recommendations.clothing.push(
      'Layered winter wear (thermal innerwear + fleece + windproof jacket)',
      'Thermal gloves and cap',
      'Thermal socks (multiple pairs)',
      'Windproof and waterproof outer layer',
      'Sturdy waterproof boots'
    );

    recommendations.essentials.push(
      'Sunglasses with UV protection (high altitude = intense UV)',
      'Sunscreen SPF 50+ (apply every 2 hours)',
      'Hydration supplies (water bottles, electrolyte tablets)',
      'Power banks (cold-resistant, high capacity)',
      'Headlamp or flashlight',
      'Portable hand warmers',
      'Lip balm with SPF'
    );

    recommendations.medical.push(
      'Altitude sickness medication (consult doctor)',
      'Diamox (Acetazolamide) - if prescribed',
      'First-aid kit with bandages and antiseptics',
      'Oxygen support (portable oxygen canisters)',
      'Pain relievers (for altitude headaches)',
      'Anti-nausea medication'
    );

    recommendations.general.push(
      'Acclimatize for 2-3 days before high-altitude activities',
      'Stay hydrated - drink 3-4 liters of water daily',
      'Avoid alcohol and smoking',
      'Eat light, high-carbohydrate meals',
      'Sleep at lower altitudes when possible',
      'Monitor for symptoms: headache, nausea, dizziness, shortness of breath'
    );
  }

  // Asthma-specific recommendations
  if (hasAsthma) {
    recommendations.medical.push(
      'Extra rescue inhalers (carry 2-3)',
      'Spacer device for inhaler',
      'Nebulizer (if you use one)',
      'Peak flow meter to monitor lung function',
      'Written asthma action plan from doctor'
    );

    if (isHighAltitude) {
      recommendations.medical.push(
        'Consult pulmonologist before high-altitude travel',
        'Consider portable oxygen concentrator',
        'Carry doctor\'s note explaining condition'
      );
    }

    recommendations.general.push(
      'Avoid outdoor activities when AQI > 100',
      'Wear N95 mask when air quality is poor',
      'Keep windows closed in hotel room',
      'Use air purifier in accommodation if available',
      'Have emergency contact numbers ready'
    );
  }

  // AQI-based recommendations
  if (aqi > 150) {
    recommendations.general.push(
      'Consider postponing travel if possible',
      'Limit time spent outdoors',
      'Use air purifiers in indoor spaces',
      'Wear N95 masks when outside',
      'Monitor air quality hourly'
    );
  }

  // User type specific
  if (userType === 'child') {
    recommendations.general.push(
      'Children are more vulnerable - extra precautions needed',
      'Keep children indoors when AQI > 100',
      'Ensure proper hydration and nutrition',
      'Watch for signs of respiratory distress'
    );
  }

  if (userType === 'elderly') {
    recommendations.general.push(
      'Elderly individuals should avoid strenuous activities',
      'Ensure medications are up to date',
      'Have emergency contacts easily accessible',
      'Consider travel insurance with medical coverage'
    );
  }

  const sections = [
    { title: '🧥 Clothing', items: recommendations.clothing, icon: '🧥' },
    { title: '🎒 Essential Items', items: recommendations.essentials, icon: '🎒' },
    { title: '🩺 Medical Requirements', items: recommendations.medical, icon: '🩺' },
    { title: '💡 General Advice', items: recommendations.general, icon: '💡' },
  ].filter(section => section.items.length > 0);

  if (sections.length === 0) {
    return (
      <div className="glass-panel rounded-3xl p-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-green/20 to-neon-teal/20 flex items-center justify-center border-2 border-neon-green/50">
            <span className="text-3xl">✓</span>
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-neon-green mb-1">Travel Ready</h2>
            <p className="text-neon-cyan/70 text-sm">No special recommendations needed</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-3xl p-8 hover:shadow-neon-green transition-all duration-500 relative overflow-hidden">
      {/* Holographic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 via-transparent to-neon-cyan/5 pointer-events-none"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-green/20 to-neon-cyan/20 flex items-center justify-center border-2 border-neon-green/50">
            <svg className="w-8 h-8 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-neon-green mb-1">Smart Recommendations</h2>
            <p className="text-sm text-neon-cyan/70 font-light">Personalized travel preparation guide</p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="glass-cosmic rounded-2xl p-6 border border-neon-green/20">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{section.icon}</span>
                <h3 className="text-lg font-display font-bold text-neon-green">{section.title}</h3>
              </div>
              <div className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-start gap-3 p-2 rounded-lg hover:bg-neon-green/5 transition-colors">
                    <span className="text-neon-green font-bold flex-shrink-0 mt-0.5">•</span>
                    <span className="text-sm text-neon-cyan/90 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* AI Insight Footer */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-neon-green/10 to-neon-cyan/10 border border-neon-green/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neon-green/20 flex items-center justify-center">
              <span className="text-lg">🤖</span>
            </div>
            <div>
              <p className="text-sm text-neon-green font-semibold mb-1">AI Insight</p>
              <p className="text-xs text-neon-cyan/70">
                These recommendations are personalized based on your destination, health profile, and current conditions. 
                Always consult with healthcare providers for medical advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartRecommendations;



