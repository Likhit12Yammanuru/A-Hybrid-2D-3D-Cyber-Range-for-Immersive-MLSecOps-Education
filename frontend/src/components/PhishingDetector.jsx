// src/components/PhishingDetector.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EMAIL_POOL = [
  { text: "Bank Security Team: There was an attempt to sign in to your account from a new device. Review: https://bank-secure-login.example-login.net", label: "Phishing", explain: "Suspicious domain + urgency → Phishing" },
  { text: "Accounts Payable: Attached is an invoice. Please download and approve payment. Sender: payments@invoices-pay.example.co", label: "Phishing", explain: "Unexpected attachment from nonstandard domain → Phishing" },
  { text: "Income Tax Dept: ITR acknowledgment ready. Visit official portal: https://www.incometax.gov.in", label: "Legitimate", explain: "Official government portal → Legitimate" },
  { text: "IT Support: Reset your corporate password using portal: http://corp-secure-verify.example.com/reset", label: "Phishing", explain: "External-looking URL asking password → Phishing" },
  { text: "Amrita University Registrar: Complete admission steps at portal.amrita.edu", label: "Legitimate", explain: "Official university portal → Legitimate" },
  { text: "National Health Mission: Your appointment confirmation at https://nhm.gov.in/appointments", label: "Legitimate", explain: "Government health portal → Legitimate" },
  { text: "Vendor Notification: Payment failed, click link to verify bank details: https://vendor-pay-update.example-bank-verify.com", label: "Phishing", explain: "Suspicious mimic of bank site → Phishing" }
];

const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

export default function PhishingDetector({ next = "/cloud" }) {
  const navigate = useNavigate();
  const [emails, setEmails] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const pick = shuffle(EMAIL_POOL).slice(0, 5);
    setEmails(pick);
  }, []);

  if (emails.length === 0) return <p>Loading...</p>;

  const current = emails[index];

  const handleSubmit = () => {
    if (!selected) return;
    setAnswers([...answers, { email: current.text, selected, label: current.label, explain: current.explain }]);
    setSelected("");
    if (index + 1 < emails.length) {
      setIndex(index + 1);
    } else {
      setFinished(true);
    }
  };

  return (
    <div style={container}>
      <h2>🕵️‍♂️ Phishing Detector Challenge</h2>

      {/* Small info / example box before first question */}
      {index === 0 && !finished && (
        <div style={infoBox}>
          <h4>💡 Quick Tip:</h4>
          <p><b>Legitimate Email:</b> From official domains, proper grammar, no urgent or threatening language.</p>
          <p><b>Phishing Email:</b> Suspicious/misspelled domains, unexpected attachments, urgent requests for sensitive info.</p>
        </div>
      )}

      {!finished ? (
        <>
          <p>Classify the following email as <b>Legitimate</b> or <b>Phishing</b>:</p>
          <div style={emailBox}>{current.text}</div>

          <div style={{ marginTop: 12 }}>
            <button onClick={() => setSelected("Legitimate")} style={selected === "Legitimate" ? activeBtn : btn}>Legitimate</button>
            <button onClick={() => setSelected("Phishing")} style={selected === "Phishing" ? activeBtn : { ...btn, marginLeft: 10 }}>Phishing</button>
            <div style={{ marginTop: 10 }}>
              <button onClick={handleSubmit} disabled={!selected} style={{ ...btn, background: "#2f855a" }}>Submit</button>
            </div>
          </div>

          <p style={{ marginTop: 12 }}>Email {index + 1} of {emails.length}</p>
        </>
      ) : (
        <>
          <h3>📊 Results</h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Your Answer</th>
                <th>Correct Answer</th>
                <th>Explanation</th>
              </tr>
            </thead>
            <tbody>
              {answers.map((a, i) => (
                <tr key={i} style={{ background: a.selected === a.label ? "#c6f6d5" : "#fed7d7" }}>
                  <td>{i + 1}</td>
                  <td style={{ maxWidth: 300, wordWrap: "break-word" }}>{a.email}</td>
                  <td>{a.selected}</td>
                  <td>{a.label}</td>
                  <td>{a.explain}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ marginTop: 12 }}>Score: {answers.filter(a => a.selected === a.label).length} / {answers.length}</p>
          <button onClick={() => navigate(next)} style={{ ...btn, marginTop: 12 }}>Next → Cloud Castle Defense</button>
        </>
      )}
    </div>
  );
}

const container = { textAlign: "center", marginTop: 20, padding: 12 };
const emailBox = { border: "1px solid #ddd", backgroundColor: "#fff", padding: 16, maxWidth: 900, margin: "14px auto", borderRadius: 8, textAlign: "left", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" };
const infoBox = { border: "1px solid #3182ce", backgroundColor: "#ebf8ff", padding: 12, maxWidth: 900, margin: "12px auto", borderRadius: 8, textAlign: "left", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" };
const btn = { padding: "10px 18px", fontSize: 15, cursor: "pointer", borderRadius: 6, background: "#3182ce", color: "white", border: "none" };
const activeBtn = { ...btn, boxShadow: "0 0 0 4px rgba(49,130,206,0.12)", background: "#2b6cb0" };
const tableStyle = { borderCollapse: "collapse", width: "100%", maxWidth: 1000, margin: "10px auto" };
