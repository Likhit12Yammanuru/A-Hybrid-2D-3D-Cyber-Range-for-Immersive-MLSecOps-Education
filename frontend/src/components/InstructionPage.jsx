// src/components/InstructionPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function InstructionPage() {
  const navigate = useNavigate();

  const steps = [
    {
      icon: "🏠",
      title: "Home Page",
      description:
        "Entry point to the MLSecOps training platform where learners begin their cybersecurity journey."
    },
    {
      icon: "📘",
      title: "Instruction Page",
      description:
        "Understand the purpose of the platform, its real-world relevance, and the complete learning roadmap."
    },
    {
      icon: "🎬",
      title: "Learning Video",
      description:
        "Watch a lecture on machine learning security concepts, attack vectors, and defensive strategies used in production ML systems."
    },
    {
      icon: "🧠",
      title: "Quiz (Minimum Score: 11 / 20)",
      description:
        "Assess your understanding of the lecture. You must score at least 11 out of 20 to unlock the game-based missions."
    },
    {
      icon: "🎮",
      title: "2D Games",
      description:
        "Complete progressively challenging 2D games covering data cleaning, phishing detection, cloud defense, poisoning, explainability, and incident response."
    },
    {
      icon: "🕹️",
      title: "3D Games",
      description:
        "Apply your knowledge in immersive 3D simulations that mimic realistic ML security incidents and operational environments."
    }
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
        padding: "40px 20px",
        fontFamily: "Segoe UI, Roboto, sans-serif",
        color: "#1e293b"
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "20px",
          padding: "40px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.08)"
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1
            style={{
              fontSize: "2.3rem",
              marginBottom: "15px",
              color: "#0f172a",
              fontWeight: "700",
              lineHeight: "1.2"
            }}
          >
            🛡️ Welcome to MLSecOps Training Platform
          </h1>

          <p
            style={{
              fontSize: "1rem",
              lineHeight: "1.8",
              maxWidth: "900px",
              margin: "0 auto",
              color: "#475569",
              textAlign: "justify"
            }}
          >
            MLSecOps (Machine Learning Security Operations) is the practice of
            protecting machine learning systems throughout their entire
            lifecycle—from data collection and preprocessing to training,
            deployment, and continuous monitoring.
            <br />
            <br />
            This platform is an interactive cybersecurity training environment
            designed to help learners understand how real-world attacks such as
            data poisoning, phishing, adversarial manipulation, model theft, and
            deployment vulnerabilities can compromise AI systems.
            <br />
            <br />
            Through lectures, assessments, 2D games, and immersive 3D
            simulations, you will develop practical skills required to secure
            modern AI pipelines used in finance, healthcare, transportation,
            defense, and cloud applications.
          </p>
        </div>

        {/* Why This Training Matters */}
        <div
          style={{
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: "14px",
            padding: "25px",
            marginBottom: "40px"
          }}
        >
          <h2 style={{ marginBottom: "15px", color: "#1d4ed8" }}>
            🌍 Why This Training Matters
          </h2>

          <p
            style={{
              lineHeight: "1.9",
              color: "#334155",
              marginBottom: "20px",
              fontSize: "0.98rem",
              textAlign: "justify"
            }}
          >
            As artificial intelligence and machine learning systems are
            increasingly deployed in critical applications, securing these
            systems has become essential. Traditional courses and online
            platforms often explain MLSecOps concepts primarily through
            theoretical lectures, making it difficult for many learners to
            visualize how attacks occur and how defenses are implemented in
            real-world environments.
          </p>

          <p
            style={{
              lineHeight: "1.9",
              color: "#334155",
              marginBottom: "20px",
              fontSize: "0.98rem",
              textAlign: "justify"
            }}
          >
          </p>

          <p
            style={{
              lineHeight: "1.9",
              color: "#334155",
              marginBottom: "20px",
              fontSize: "0.98rem",
              textAlign: "justify"
            }}
          >
            This platform addresses these challenges through a gamified 2D–3D
            metaverse training environment that combines lectures, quizzes,
            interactive games, and immersive simulations to make complex
            security concepts easier to understand, practice, and retain.
          </p>

          <ul
            style={{
              lineHeight: "2",
              paddingLeft: "25px",
              color: "#334155",
              margin: 0,
              fontSize: "0.98rem"
            }}
          >
            <li>Strengthens understanding through visual and hands-on learning.</li>
            <li>Simulates realistic attacks on machine learning pipelines.</li>
            <li>Improves decision-making in operational security scenarios.</li>
            <li>Bridges the gap between theory and practical experience.</li>
            <li>Enhances long-term retention through gamification.</li>
            <li>Prepares learners for real-world MLSecOps responsibilities.</li>
          </ul>
        </div>

        {/* Learning Journey */}
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            fontSize: "2rem",
            color: "#0f172a"
          }}
        >
          📈 Learning Journey
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            marginBottom: "40px"
          }}
        >
          {steps.map((step, index) => (
            <div
              key={index}
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                padding: "24px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.04)"
              }}
            >
              <div style={{ fontSize: "2.2rem", marginBottom: "10px" }}>
                {step.icon}
              </div>
              <h3
                style={{
                  marginBottom: "10px",
                  color: "#0f172a",
                  fontSize: "1.2rem"
                }}
              >
                {index + 1}. {step.title}
              </h3>
              <p
                style={{
                  lineHeight: "1.7",
                  color: "#475569",
                  margin: 0,
                  fontSize: "0.96rem"
                }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Platform Flow */}
        <div
          style={{
            background: "#0f172a",
            color: "white",
            borderRadius: "16px",
            padding: "30px",
            marginBottom: "40px",
            textAlign: "center"
          }}
        >
          <h2 style={{ marginBottom: "25px" }}>🔄 Platform Flow</h2>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: "12px",
              fontSize: "1rem",
              fontWeight: "600",
              lineHeight: "1.6"
            }}
          >
            <span>🏠 Home</span>
            <span style={{ color: "#60a5fa", fontSize: "1.4rem" }}>→</span>

            <span>📘 Instructions</span>
            <span style={{ color: "#60a5fa", fontSize: "1.4rem" }}>→</span>

            <span>🎬 Learning Video</span>
            <span style={{ color: "#60a5fa", fontSize: "1.4rem" }}>→</span>

            <span>🧠 Quiz (Pass: 11/20)</span>
            <span style={{ color: "#60a5fa", fontSize: "1.4rem" }}>→</span>

            <span>🎮 2D Games</span>
            <span style={{ color: "#60a5fa", fontSize: "1.4rem" }}>→</span>

            <span>🕹️ 3D Games</span>
          </div>
        </div>

        {/* Real-World Applications */}
        <div
          style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "14px",
            padding: "25px",
            marginBottom: "40px"
          }}
        >
          <h2 style={{ marginBottom: "15px", color: "#15803d" }}>
            🏢 Real-World Applications
          </h2>

          <p
            style={{
              lineHeight: "1.9",
              color: "#334155",
              marginBottom: "15px",
              fontSize: "0.98rem",
              textAlign: "justify"
            }}
          >
            Machine learning systems are widely used in critical industries and
            are increasingly targeted by cyberattacks. The skills developed
            through this platform mirror the responsibilities of AI engineers,
            cybersecurity analysts, and MLSecOps professionals who secure these
            systems in production environments.
          </p>

          <ul
            style={{
              lineHeight: "2",
              paddingLeft: "25px",
              marginTop: "15px",
              marginBottom: 0,
              color: "#334155",
              fontSize: "0.98rem"
            }}
          >
            <li>
              🏦 <strong>Banking and Fraud Detection</strong> – Securing models
              used to detect fraudulent financial transactions.
            </li>
            <li>
              🏥 <strong>Healthcare Diagnostics</strong> – Protecting AI systems
              supporting disease prediction and medical decision-making.
            </li>
            <li>
              🚗 <strong>Autonomous Vehicles</strong> – Defending perception and
              navigation models from adversarial attacks.
            </li>
            <li>
              ☁️ <strong>Cloud Security Operations</strong> – Safeguarding
              deployed models, APIs, and MLOps pipelines.
            </li>
            <li>
              🛡️ <strong>Defense and National Security</strong> – Ensuring the
              integrity of AI systems used in mission-critical operations.
            </li>
            <li>
              🛒 <strong>E-commerce Recommendation Systems</strong> – Preventing
              manipulation of ranking and personalization models.
            </li>
            <li>
              📱 <strong>Social Media Platforms</strong> – Protecting content
              moderation and recommendation engines.
            </li>
            <li>
              🏭 <strong>Industrial and IoT Systems</strong> – Securing anomaly
              detection and predictive maintenance models.
            </li>
          </ul>
        </div>

        {/* Start Button */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => navigate("/video")}
            style={{
              padding: "16px 36px",
              fontSize: "1.1rem",
              fontWeight: "600",
              border: "none",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "white",
              cursor: "pointer",
              boxShadow: "0 8px 20px rgba(37,99,235,0.3)"
            }}
          >
            🚀 Begin Training
          </button>
        </div>
      </div>
    </div>
  );
}