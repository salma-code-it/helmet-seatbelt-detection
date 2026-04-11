import React from "react";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  AreaChart, Area 
} from 'recharts';

function AnalyticsPage({ history = [] }) {
  
  // --- PRÉPARATION DES DONNÉES ---
  const helmetData = history.filter(item => item?.modelId === "helmet");
  const beltData = history.filter(item => item?.modelId === "belt");

  const getStats = (data) => ({
    ok: data.reduce((sum, item) => sum + (parseInt(item?.ok) || 0), 0),
    fail: data.reduce((sum, item) => sum + (parseInt(item?.fail) || 0), 0),
    total: data.reduce((sum, item) => sum + (parseInt(item?.ok) || 0) + (parseInt(item?.fail) || 0), 0)
  });

  const hStats = getStats(helmetData);
  const bStats = getStats(beltData);

  const hRate = hStats.total > 0 ? Math.round((hStats.ok / hStats.total) * 100) : 0;
  const bRate = bStats.total > 0 ? Math.round((bStats.ok / bStats.total) * 100) : 0;

  // 1. TENDANCE : Cumul des infractions dans le temps (AreaChart est plus parlant pour le danger)
  // On inverse l'historique pour aller du plus ancien au plus récent
  const trendData = [...history].reverse().map((item, index) => ({
    index: index + 1,
    time: item.time,
    infractions: parseInt(item?.fail) || 0,
    label: item.modelId === "helmet" ? "Casque" : "Ceinture"
  }));

  // 2. RÉPARTITION : Pourcentage d'erreurs par type d'équipement
  const errorDistribution = [
    { name: 'Infractions Casques', value: hStats.fail, color: '#ff4757' },
    { name: 'Infractions Ceintures', value: bStats.fail, color: '#ffa502' },
    { name: 'Total Conformes', value: hStats.ok + bStats.ok, color: '#2ed573' }
  ];

  return (
    <div className="page">
      <div className="det-header">
        <h2>Intelligence Sécurité (EPI)</h2>
        <p>Analyse de la fiabilité et des risques détectés sur le chantier.</p>
      </div>

      {/* --- CARTES KPI --- */}
      <div className="info-grid-2" style={{ marginBottom: '24px' }}>
        <div className="icard" style={{ textAlign: 'center', borderBottom: '4px solid #2ed573' }}>
          <div className="hstat-key">Score Global de Conformité</div>
          <div className="hstat-val" style={{ fontSize: '2.5rem', color: '#2ed573' }}>
            {history.length > 0 ? Math.round((hStats.ok + bStats.ok) / (hStats.total + bStats.total) * 100) : 0}%
          </div>
          <p>Taux de respect moyen des consignes</p>
        </div>
        <div className="icard" style={{ textAlign: 'center', borderBottom: '4px solid #ff4757' }}>
          <div className="hstat-key">Alerte Critique</div>
          <div className="hstat-val" style={{ fontSize: '1.5rem', color: '#ff4757', marginTop: '10px' }}>
             {hStats.fail > bStats.fail ? "Risque Casque Élevé" : "Risque Ceinture Élevé"}
          </div>
          <p>L'équipement le plus souvent oublié</p>
        </div>
      </div>

      {/* ✅ AJOUT ICI : CONSEIL IA (Prend toute la largeur) */}
      <div className="icard" style={{ marginBottom: '24px', background: "rgba(255, 165, 2, 0.1)", borderLeft: "4px solid #ffa502" }}>
        <div className="icard-head">
          <h3>💡 Recommandation IA</h3>
        </div>
        <p style={{ fontSize: '0.95rem', lineHeight: '1.5', marginTop: '10px' }}>
          {hRate < bRate 
            ? "L'analyse montre que le port du CASQUE est moins respecté que la ceinture. Organisez une session de rappel sur la protection crânienne demain matin."
            : "Attention : Les oublis de CEINTURE sont en hausse. Vérifiez les points d'attache et la visibilité des harnais sur les zones de travail en hauteur."
          }
        </p>
      </div>

      {/* --- SECTION GRAPHIQUES --- */}
      <div className="info-grid-2">
        {/* GRAPH 1 : COURBE DE DANGER */}
        <div className="icard">
          <div className="icard-head">
            <h3>Courbe de Danger</h3>
            <small>Évolution des infractions par session</small>
          </div>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorFail" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff4757" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ff4757" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2d3748" />
                <XAxis dataKey="time" hide />
                <YAxis stroke="#8b95aa" />
                <Tooltip 
                   contentStyle={{ background: '#141b25', border: '1px solid #ff4757' }}
                   labelStyle={{ color: '#8b95aa' }}
                />
                <Area type="monotone" dataKey="infractions" stroke="#ff4757" fillOpacity={1} fill="url(#colorFail)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRAPH 2 : RÉPARTITION DES RISQUES */}
        <div className="icard">
          <div className="icard-head">
            <h3>Répartition des Risques</h3>
          </div>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie 
                  data={errorDistribution} 
                  innerRadius={60} 
                  outerRadius={80} 
                  paddingAngle={5} 
                  dataKey="value"
                >
                  {errorDistribution.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1a2030', border: 'none' }} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* --- COMPARATIF FINAL --- */}
      <div className="pipeline" style={{ marginTop: '24px' }}>
        <div className="section-title">Comparatif de Fiabilité par Équipement</div>
        <div className="info-grid-2" style={{ padding: '20px' }}>
          <div>
            <h4 style={{ color: 'var(--helmet)' }}>🛡️ Casques</h4>
            <p>Respecté à {hRate}%</p>
            <div style={{ background: '#2d3748', height: '8px', borderRadius: '4px', marginTop: '5px' }}>
               <div style={{ background: 'var(--helmet)', width: `${hRate}%`, height: '100%', borderRadius: '4px' }} />
            </div>
          </div>
          <div>
            <h4 style={{ color: 'var(--belt)' }}>🎗️ Ceintures</h4>
            <p>Respecté à {bRate}%</p>
            <div style={{ background: '#2d3748', height: '8px', borderRadius: '4px', marginTop: '5px' }}>
               <div style={{ background: 'var(--belt)', width: `${bRate}%`, height: '100%', borderRadius: '4px' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default AnalyticsPage;