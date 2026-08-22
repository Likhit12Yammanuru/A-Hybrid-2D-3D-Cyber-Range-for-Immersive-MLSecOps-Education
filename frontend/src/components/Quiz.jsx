import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const QUESTIONS = [
  { id: 1, type: "blank", prompt: "___ is the process of adding incorrect data to a training set to manipulate model behavior.", answer: "Data poisoning" },
  { id: 2, type: "blank", prompt: "Tagging each data item with source and timestamp is called ___ .", answer: "provenance" },
  { id: 3, type: "blank", prompt: "A common technique to limit model extraction by controlling request rate is called ___.", answer: "rate limiting" },
  { id: 4, type: "blank", prompt: "In federated learning, malicious clients may perform ___ to send harmful updates to the central model.", answer: "model poisoning" },
  { id: 5, type: "blank", prompt: "Keeping an immutable record of deployments and approvals is part of ___.", answer: "audit logging" },

  { id: 6, type: "mcq", prompt: "Which control helps detect sudden changes in feature distributions?", options: ["A) Input filters", "B) Data drift dashboards", "C) Model watermarking", "D) Rate limiting"], answer: "B" },
  { id: 7, type: "mcq", prompt: "A backdoor attack typically involves:", options: ["A) Replacing the model binary", "B) Injecting a rarely-seen trigger during training", "C) Denying service to training nodes", "D) Encrypting artifacts"], answer: "B" },
  { id: 8, type: "mcq", prompt: "Which is a privacy-preserving technique used during training?", options: ["A) Differential privacy", "B) Model extraction", "C) Reverse engineering", "D) Feature injection"], answer: "A" },
  { id: 9, type: "mcq", prompt: "Which is *not* a mitigation for sensor spoofing?", options: ["A) Hardware attestation", "B) Signed telemetry", "C) CAPTCHA", "D) Sensor fusion"], answer: "C" },
  { id: 10, type: "mcq", prompt: "What is an effective defense against model extraction via repeated queries?", options: ["A) Query throttling", "B) Publishing weights", "C) Plaintext logs", "D) Unlimited retries"], answer: "A" },

  { id: 11, type: "tf", prompt: "Model watermarking can help prove ownership.", answer: true },
  { id: 12, type: "tf", prompt: "Differential privacy guarantees zero data leakage.", answer: false },
  { id: 13, type: "tf", prompt: "Schema validation reduces adversarial payload risk.", answer: true },
  { id: 14, type: "tf", prompt: "Unlimited API queries prevent extraction.", answer: false },
  { id: 15, type: "tf", prompt: "Immutable logs help investigations.", answer: true },

  { id: 16, type: "scenario", prompt: "Someone claims they can reproduce your model via API queries. What mitigations apply?", keywords: ["throttle", "watermark", "monitor", "api key", "rbac"] },
  { id: 17, type: "scenario", prompt: "You find extreme float values breaking training — how sanitize?", keywords: ["clamp", "normalize", "impute", "outlier", "schema"] },
  { id: 18, type: "scenario", prompt: "Vision model misclassifies stop signs with stickers — what defenses?", keywords: ["adversarial", "augment", "robustness", "monitor", "camera", "red-team"] },
  { id: 19, type: "scenario", prompt: "You suspect test set poisoning — how verify and recover?", keywords: ["golden", "isolate", "re-label", "holdout", "audit"] },
  { id: 20, type: "scenario", prompt: "A model artifact was exfiltrated — steps for containment?", keywords: ["revoke", "rotate", "investigate", "watermark", "retrain"] },
];

const PASSING_SCORE = 11;

// ------------------- NORMALIZATION -------------------
function normalize(text) {
  return text?.toLowerCase().replace(/[^\w\s]/g, "").trim() || "";
}

// ------------------- SCENARIO MATCH -------------------
function scenarioMatch(answer, keywords) {
  const text = normalize(answer);
  return keywords.some(k => text.includes(normalize(k)));
}

export default function Quiz() {
  const navigate = useNavigate();

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // NEW: stores correctness per question
  const [results, setResults] = useState({});

  // ------------------- LOAD SAVED PROGRESS -------------------
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("quiz-progress"));

    if (saved && saved.submitted !== true) {
      setAnswers(saved.answers || {});
      setCurrent(saved.current || 0);
    }
  }, []);

  // ------------------- SAVE PROGRESS -------------------
  useEffect(() => {
    if (!submitted) {
      localStorage.setItem(
        "quiz-progress",
        JSON.stringify({
          current,
          answers,
          submitted: false,
        })
      );
    }
  }, [current, answers, submitted]);

  // ------------------- HANDLE ANSWERS -------------------
  function handleAnswer(id, value) {
    setAnswers(prev => ({
      ...prev,
      [id]: value,
    }));
  }

  // ------------------- FIXED GRADING -------------------
  function grade() {
    let total = 0;
    const evaluated = {};

    QUESTIONS.forEach(q => {
      const a = answers[q.id];
      let correct = false;

      if (!a && q.type !== "tf") {
        correct = false;
      }

      else if (q.type === "blank") {
        correct = normalize(a) === normalize(q.answer);
      }

      else if (q.type === "mcq") {
        correct = a === q.answer;
      }

      else if (q.type === "tf") {
        correct =
          String(a).toLowerCase() ===
          String(q.answer).toLowerCase();
      }

      else if (q.type === "scenario") {
        correct = scenarioMatch(a, q.keywords);
      }

      evaluated[q.id] = correct;

      if (correct) total++;
    });

    setResults(evaluated);
    setScore(total);
    setSubmitted(true);

    localStorage.removeItem("quiz-progress");
  }

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === QUESTIONS.length;

  const q = QUESTIONS[current];

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <h2>🧠 ML Security Quiz</h2>

      {/* ------------------- PROGRESS ------------------- */}
      <strong>
        Progress: {answeredCount}/{QUESTIONS.length}
      </strong>

      <div
        style={{
          height: "10px",
          background: "#ccc",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            width: `${(answeredCount / QUESTIONS.length) * 100}%`,
            height: "100%",
            background: "#4caf50",
          }}
        />
      </div>

      {/* ------------------- QUESTION ------------------- */}
      <h3>
        Question {current + 1} / {QUESTIONS.length}
      </h3>

      <p>{q.prompt}</p>

      {!submitted ? (
        <>
          {/* ------------------- BLANK ------------------- */}
          {q.type === "blank" && (
            <input
              style={{
                width: "100%",
                padding: "10px",
              }}
              value={answers[q.id] || ""}
              onChange={e =>
                handleAnswer(q.id, e.target.value)
              }
            />
          )}

          {/* ------------------- MCQ ------------------- */}
          {q.type === "mcq" &&
            q.options.map(opt => (
              <label
                key={opt}
                style={{ display: "block" }}
              >
                <input
                  type="radio"
                  value={opt[0]}
                  checked={answers[q.id] === opt[0]}
                  onChange={e =>
                    handleAnswer(q.id, e.target.value)
                  }
                />{" "}
                {opt}
              </label>
            ))}

          {/* ------------------- TRUE/FALSE ------------------- */}
          {q.type === "tf" && (
            <>
              <label>
                <input
                  type="radio"
                  checked={answers[q.id] === true}
                  onChange={() =>
                    handleAnswer(q.id, true)
                  }
                />{" "}
                True
              </label>

              <br />

              <label>
                <input
                  type="radio"
                  checked={answers[q.id] === false}
                  onChange={() =>
                    handleAnswer(q.id, false)
                  }
                />{" "}
                False
              </label>
            </>
          )}

          {/* ------------------- SCENARIO ------------------- */}
          {q.type === "scenario" && (
            <textarea
              style={{
                width: "100%",
                height: "90px",
                padding: "10px",
              }}
              placeholder="Write your mitigation..."
              value={answers[q.id] || ""}
              onChange={e =>
                handleAnswer(q.id, e.target.value)
              }
            />
          )}

          {/* ------------------- NAVIGATION ------------------- */}
          <button
            disabled={current === 0}
            onClick={() =>
              setCurrent(c => c - 1)
            }
          >
            ⬅ Previous
          </button>

          <button
            disabled={current === QUESTIONS.length - 1}
            onClick={() =>
              setCurrent(c => c + 1)
            }
            style={{ marginLeft: "10px" }}
          >
            Next ➡
          </button>

          {/* ------------------- SUBMIT ------------------- */}
          <button
            disabled={!allAnswered}
            style={{ marginTop: "20px" }}
            onClick={grade}
          >
            Submit Quiz
          </button>
        </>
      ) : (
        <>
          {/* ------------------- RESULT ------------------- */}
          <h3>
            Score: {score}/{QUESTIONS.length}
          </h3>

          {score >= PASSING_SCORE ? (
            <h2 style={{ color: "green" }}>
              🎉 Passed!
            </h2>
          ) : (
            <h2 style={{ color: "red" }}>
              ❌ Failed
            </h2>
          )}

          {/* ------------------- REVIEW ------------------- */}
          {QUESTIONS.map(q => {
            const correct = results[q.id];

            return (
              <p key={q.id}>
                <strong>
                  {q.id}. {q.prompt}
                </strong>

                <br />

                <span
                  style={{
                    color: correct ? "green" : "red",
                  }}
                >
                  {correct
                    ? "✔ Correct"
                    : `❌ Incorrect → Expected ${
                        q.keywords
                          ? `keywords: ${q.keywords.join(", ")}`
                          : q.answer
                      }`}
                </span>
              </p>
            );
          })}

          {/* ------------------- CONTINUE ------------------- */}
          {score >= PASSING_SCORE && (
            <button
              style={{ marginTop: "20px" }}
              onClick={() =>
                navigate("/games")
              }
            >
              🚀 Continue to Games Menu
            </button>
          )}

          {/* ------------------- RESTART ------------------- */}
          <button
            style={{ marginTop: "10px" }}
            onClick={() => {
              setSubmitted(false);
              setAnswers({});
              setResults({});
              setCurrent(0);
              setScore(0);

              localStorage.removeItem(
                "quiz-progress"
              );
            }}
          >
            Restart Quiz
          </button>
        </>
      )}
    </div>
  );
}