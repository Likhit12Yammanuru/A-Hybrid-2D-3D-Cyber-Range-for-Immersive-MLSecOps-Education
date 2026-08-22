from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from sklearn.linear_model import LogisticRegression
import random
import uuid
from difflib import SequenceMatcher

app = Flask(__name__)
CORS(app)


# -------------------------------------------------------------------------
# 🧠 Base ML Model (for basic attack prediction)
# -------------------------------------------------------------------------
model = LogisticRegression()
X_train = np.array([[0, 0], [1, 0], [0, 1], [1, 1]])  # Dummy training data
y_train = np.array([0, 0, 0, 1])  # Attack only when both features = 1
model.fit(X_train, y_train)

@app.route("/")
def home():
    return {"message": "🚀 CyberSecML-Lab Backend is running successfully"}

# -------------------------------------------------------------------------
# 🧩 Feature 1: Phishing Detector (Binary ML-based)
# -------------------------------------------------------------------------
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(force=True)
    features = data.get("features")

    if not features:
        return jsonify({"error": "Missing 'features' field"}), 400

    try:
        arr = np.array(features, dtype=float).reshape(1, -1)
        pred = int(model.predict(arr)[0])
        prob = model.predict_proba(arr)[0].tolist()

        return jsonify({
            "features": features,
            "prediction": pred,
            "probability": prob
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -------------------------------------------------------------------------
# 🧠 Alternative Feature 1 (Heuristic URL-based phishing detection)
# -------------------------------------------------------------------------
@app.route("/predict_phishing", methods=["POST"])
def predict_phishing():
    data = request.get_json(force=True)
    url = data.get("url", "")
    if not url:
        return jsonify({"error": "Missing URL"}), 400

    suspicious_keywords = ["@", "login", "verify", "update", "secure", "bank", "password"]
    score = sum(word in url.lower() for word in suspicious_keywords)
    if "https" not in url.lower():
        score += 1
    if len(url) > 60:
        score += 1

    prediction = "Phishing" if score >= 2 else "Legitimate"
    return jsonify({
        "url": url,
        "prediction": prediction,
        "risk_score": score
    })

# -------------------------------------------------------------------------
# 🧹 Feature 2: Data Cleaner Game (AI Pipeline Initiation Challenge)
# -------------------------------------------------------------------------
MESSY_DATASETS = [
    ("SDD DFE SSS GGFDE \ncdmd m, g,mjefsdsf;l',mvck ,.,srv jhdwasx",
     "SDD DFE SSS GGFDE cdmd m g mjefsdsf l mvck srv jhdwasx"),
    ("Raw    data: x,,,,,, y!! 12\t\n\n\n   z",
     "Raw data x y 12 z"),
    ("User@@ login## password!! verify**", 
     "User login password verify"),
    ("   Clean this dataset... NOW!!!   ", 
     "Clean this dataset NOW")
]

@app.route("/clean_data", methods=["POST"])
def clean_data():
    data = request.get_json(force=True)
    user_text = data.get("text", "")
    index = data.get("index", None)

    # Send a random dataset if index not provided
    if index is None or not (0 <= index < len(MESSY_DATASETS)):
        idx = random.randint(0, len(MESSY_DATASETS)-1)
        messy, clean = MESSY_DATASETS[idx]
        return jsonify({
            "index": idx,
            "messy_text": messy,
            "ideal_clean": clean
        })

    # Validate user input
    _, ideal_clean = MESSY_DATASETS[index]

    matcher = SequenceMatcher(None, user_text.strip(), ideal_clean)
    score = round(matcher.ratio() * 100)
    success = score >= 80

    return jsonify({
        "score": score,
        "success": success,
        "ideal_clean": ideal_clean
    })

# -------------------------------------------------------------------------
# ⚔️ Feature 3: Final Boss Game
# -------------------------------------------------------------------------
PIPELINE_STAGES = ["collection", "cleaning", "training", "deployment", "monitoring"]

ATTACK_TYPES = [
    ("data_poisoning", 10, ["collection", "cleaning"]),
    ("label_flip", 8, ["cleaning", "training"]),
    ("model_backdoor", 12, ["training"]),
    ("model_extraction", 9, ["deployment"]),
    ("dos_spike", 6, ["deployment", "monitoring"]),
    ("adversarial_input", 7, ["deployment", "monitoring"])
]

CLUE_TEMPLATES = {
    "data_poisoning": [
        "Strange records with impossible values appeared in incoming datasets.",
        "Multiple sources reported inconsistent feature distributions in recent data.",
        "A sudden influx of data from new unknown sources was detected."
    ],
    "label_flip": [
        "Training loss increased with no code changes; label quality warnings triggered.",
        "Conflicting labels for similar samples found during validation.",
        "Review of recent labeled samples shows suspicious label patterns."
    ],
    "model_backdoor": [
        "Anomalous training checkpoints detected; a rare pattern triggers very high confidence.",
        "Unusual model behavior on a rare trigger observed in test set.",
        "Validation shows a small input pattern causing outrageous predictions."
    ],
    "model_extraction": [
        "Repeated calls to the model endpoint from same IP range were observed.",
        "High request volume querying many permutations of inputs detected at the API.",
        "Unusual pattern of probing queries aiming to reconstruct model outputs."
    ],
    "dos_spike": [
        "Endpoint latency spiked and error rates increased for /predict.",
        "Traffic surge with many similar queries detected at deployment endpoints.",
        "Servers flagged high connection churn and throttling triggered frequently."
    ],
    "adversarial_input": [
        "A cluster of near-boundary examples caused large prediction shifts.",
        "High misclassification rate for seemingly benign inputs was noticed.",
        "Sudden drop in model confidence on normal inputs detected in monitoring."
    ]
}

boss_sessions = {}

@app.route("/get_round_info", methods=["POST"])
def get_round_info():
    body = request.get_json(force=True)
    session_id = body.get("session_id") or str(uuid.uuid4())
    round_num = int(body.get("round", 1))
    round_num = max(1, min(round_num, 5))

    # Initialize session if new
    if session_id not in boss_sessions:
        rounds = []
        for _ in range(5):
            attacks = []
            choices = random.sample(ATTACK_TYPES, k=2)
            for atk_key, base_damage, stages in choices:
                stage = random.choice(stages)
                attacks.append({
                    "attack": atk_key,
                    "stage": stage,
                    "base_damage": base_damage
                })
            rounds.append(attacks)
        boss_sessions[session_id] = {"rounds": rounds, "health": 100, "score": 0}

    session = boss_sessions[session_id]
    attacks = session["rounds"][round_num - 1]
    chosen_attack = random.choice(attacks)
    atk_type = chosen_attack["attack"]
    clue = random.choice(CLUE_TEMPLATES.get(atk_type, ["Unusual activity detected."]))
    severity = sum(a["base_damage"] for a in attacks) / len(attacks)

    return jsonify({
        "session_id": session_id,
        "round": round_num,
        "clue": clue,
        "attacks_count": len(attacks),
        "severity": round(severity, 2),
        "message": "Prepare defenses wisely based on the clue!"
    })


@app.route("/simulate_round", methods=["POST"])
def simulate_round():
    body = request.get_json(force=True)
    session_id = body.get("session_id")
    round_num = int(body.get("round", 1))
    accuracy_before = float(body.get("accuracy", 100.0))
    defenses = body.get("defenses", {}) or {}
    use_resource = bool(body.get("use_resource", False))

    if not session_id or session_id not in boss_sessions:
        return jsonify({"error": "Invalid or missing session_id. Call /get_round_info first."}), 400

    session = boss_sessions[session_id]
    attacks = session["rounds"][round_num - 1]
    total_accuracy_drop = 0.0
    score_gain = 0
    round_messages = []

    for atk in attacks:
        attack, stage, base_damage = atk["attack"], atk["stage"], atk["base_damage"]
        mitigation = 0.0

        # Direct defense
        if defenses.get(stage, False): mitigation += 0.65
        idx = PIPELINE_STAGES.index(stage)
        # Neighbor defenses
        if idx - 1 >= 0 and defenses.get(PIPELINE_STAGES[idx - 1], False): mitigation += 0.15
        if idx + 1 < len(PIPELINE_STAGES) and defenses.get(PIPELINE_STAGES[idx + 1], False): mitigation += 0.15
        # Monitoring baseline
        if defenses.get("monitoring", False): mitigation += 0.1
        # Emergency resource
        if use_resource: mitigation += 0.15

        mitigation = min(0.95, mitigation)
        rand = random.uniform(0.8, 1.2)
        damage = base_damage * rand * (1 - mitigation)

        # Determine message & score
        if mitigation >= 0.75:
            msg = f"✅ {attack.replace('_',' ').title()} on {stage} neutralized!"
            score_gain += 2
        elif mitigation >= 0.45:
            msg = f"⚠️ {attack.replace('_',' ').title()} on {stage} partially mitigated."
            score_gain += 1
        else:
            msg = f"❌ {attack.replace('_',' ').title()} succeeded at {stage}!"

        total_accuracy_drop += damage
        round_messages.append(msg)

    accuracy_after = max(0, accuracy_before - total_accuracy_drop)
    session["score"] += score_gain
    session["health"] = max(0, session["health"] - int(total_accuracy_drop // 5))
    game_over = accuracy_after < 70
    victory = (round_num >= 5 and not game_over)

    if game_over or round_num >= 5:
        final_score = session["score"]
        final_health = session["health"]
        del boss_sessions[session_id]
    else:
        final_score = None
        final_health = session["health"]

    return jsonify({
        "round": round_num,
        "accuracy_before": round(accuracy_before, 2),
        "accuracy_after": round(accuracy_after, 2),
        "round_messages": round_messages,
        "session_score": session["score"],
        "session_health": session["health"],
        "game_over": game_over,
        "victory": victory,
        "final_score": final_score,
        "final_health": final_health
    })

# -------------------------------------------------------------------------
# 🧩 Feature 4: Patch Pipeline Game (Medium)
# -------------------------------------------------------------------------
PIPELINE_STAGES = ["collection", "cleaning", "training", "deployment", "monitoring"]

VULNERABILITIES = [
    {
        "stage": "collection",
        "desc": "Dataset from untrusted sources may contain poisoned samples.",
    },
    {
        "stage": "cleaning",
        "desc": "Missing data validation lets malicious input slip through.",
    },
    {
        "stage": "training",
        "desc": "Unpatched ML library vulnerability allows backdoor insertion.",
    },
    {
        "stage": "deployment",
        "desc": "Weak encryption on deployed API leaks sensitive predictions.",
    },
    {
        "stage": "monitoring",
        "desc": "No anomaly detection causes delayed attack response.",
    },
    {
        "stage": "collection",
        "desc": "Compromised labeling leads to biased training data.",
    },
    {
        "stage": "cleaning",
        "desc": "Inconsistent feature scaling leads to skewed training results.",
    },
    {
        "stage": "deployment",
        "desc": "Model weights not signed or verified before deployment.",
    },
    {
        "stage": "monitoring",
        "desc": "Lack of runtime monitoring hides adversarial attacks.",
    },
    {
        "stage": "training",
        "desc": "Outdated dependencies during training cause instability.",
    },
]

# Each session tracks 5 rounds, score, and system integrity
active_sessions = {}  # {"session_id": {"rounds": [...], "score": 0, "health": 100}}

@app.route("/patch_pipeline", methods=["POST"])
def patch_pipeline():
    data = request.get_json(force=True)
    session_id = data.get("session_id", "default")
    round_num = int(data.get("round", 1))
    user_choice = data.get("stage", None)

    # Initialize session
    if session_id not in active_sessions:
        # Randomly select 5 vulnerabilities for this session
        active_sessions[session_id] = {
            "rounds": random.sample(VULNERABILITIES, 5),
            "score": 0,
            "health": 100,
        }

    session = active_sessions[session_id]
    rounds = session["rounds"]
    score = session["score"]
    health = session["health"]

    # Get current round's vulnerability
    if round_num > len(rounds):
        return jsonify({"error": "Invalid round number"}), 400

    vuln = rounds[round_num - 1]
    correct_stage = vuln["stage"]
    vuln_desc = vuln["desc"]

    # Evaluate user choice
    if user_choice == correct_stage:
        success = True
        score += 1
        message = f"✅ Correct! You patched the {correct_stage} stage successfully."
    else:
        success = False
        health = max(0, health - 20)
        message = f"❌ Wrong patch! Vulnerability was in {correct_stage}. System integrity reduced."

    # Update session state
    session["score"] = score
    session["health"] = health

    # Check game state
    game_over = round_num >= 5 or health <= 0
    next_round = min(round_num + 1, 5)

    # Prepare response
    response = {
        "round": round_num,
        "vulnerability": vuln_desc,
        "correct_stage": correct_stage,
        "user_choice": user_choice,
        "success": success,
        "message": message,
        "score": score,
        "system_health": health,
        "next_round": next_round,
        "game_over": game_over,
    }

    # Reset session if game over
    if game_over:
        final_score = score
        response["final_score"] = final_score
        response["final_health"] = health
        if session_id in active_sessions:
            del active_sessions[session_id]

    return jsonify(response)

# -------------------------------------------------------------------------
# 🎮 Feature 5: Explainability Game — Model Audit Mission
# -------------------------------------------------------------------------
@app.route('/explain_model', methods=['POST'])
def explain_model():
    data = request.json
    round_num = int(data.get("round", 1))
    f1 = float(data.get("feature1", 0))
    f2 = float(data.get("feature2", 0))

    # Model bias profiles (hidden from user)
    round_profiles = {
        1: {"weights": (0.7, 0.3), "bias_label": "normal"},        # Fair model
        2: {"weights": (0.9, 0.1), "bias_label": "suspicious"},    # Overweights feature 1
        3: {"weights": (0.2, 0.8), "bias_label": "normal"}         # Balanced and fair again
    }

    profile = round_profiles.get(round_num, round_profiles[1])
    w1, w2 = profile["weights"]
    bias_label = profile["bias_label"]

    # Compute feature influence
    influence1 = abs(f1 * w1)
    influence2 = abs(f2 * w2)
    total = influence1 + influence2 + 0.001

    f1_contrib = round((influence1 / total) * 100, 2)
    f2_contrib = round((influence2 / total) * 100, 2)
    prediction = "Malicious" if (influence1 + influence2) > 5 else "Safe"
    confidence = round(min(1, (influence1 + influence2) / 10) * 100, 2)

    # Generate subtle clue in explanation
    clue = ""
    if f1_contrib > 80:
        clue = "Notice that Feature 1 dominates the decision; check if the model is relying too heavily on it."
    elif f2_contrib > 80:
        clue = "Feature 2 dominates; consider whether the model might be biased towards frequency."
    else:
        clue = "Feature contributions are reasonably balanced, the model seems fair."

    explanation = f"Feature 1 contributes {f1_contrib}% and Feature 2 contributes {f2_contrib}%. {clue}"

    return jsonify({
        "round": round_num,
        "feature1_contribution": f1_contrib,
        "feature2_contribution": f2_contrib,
        "prediction": prediction,
        "confidence": confidence,
        "bias_label": bias_label,
        "explanation": explanation,
        "next_round": round_num + 1 if round_num < 3 else None,
        "game_over": (round_num >= 3)
    })


# -------------------------------------------------------------------------
# 🧩 Feature 6: Poison Detection System
# -------------------------------------------------------------------------
# Sample datasets
@app.route('/generate_samples', methods=['GET'])
def generate_samples():
    labels = ["cat", "dog", "car", "plane", "tree"]
    samples = []

    for i in range(10):
        poisoned = random.random() < 0.3  # 30% poisoned
        sample = {
            "id": i + 1,
            "label": random.choice(labels),
            "confidence": round(random.uniform(0.3, 0.99), 2),
            "feature": round(random.uniform(-3, 3), 2),
            "poisoned": poisoned
        }
        samples.append(sample)
    return jsonify(samples)

@app.route('/validate_decisions', methods=['POST'])
def validate_decisions():
    data = request.get_json()
    score = data.get("score")
    accuracy = data.get("accuracy")
    # This can be extended to save logs or leaderboard data
    print(f"Game Summary → Score: {score}, Accuracy: {accuracy}")
    return jsonify({"message": "Results logged successfully!"})

# -------------------------------------------------------------------------
# Cloud Castle Defense (Stateless)
# -------------------------------------------------------------------------

@app.route("/cloud_castle_defense", methods=["POST"])
def cloud_castle_defense():
    """
    Stateless API:
    Receives score + status + time.
    Returns them back immediately.
    Stores NOTHING.
    """
    data = request.get_json()

    score = data.get("score", 0)
    defense_status = data.get("defense_status", "Unknown")
    time_taken = data.get("time_taken", 0)

    return jsonify({
        "message": "Round completed.",
        "score": score,
        "defense_status": defense_status,
        "time_taken": time_taken
    }), 200

# -------------------------------------------------------------------------
# ✅ Run the app
# -------------------------------------------------------------------------
if __name__ == "__main__":
    app.run(port=5000, debug=True)
