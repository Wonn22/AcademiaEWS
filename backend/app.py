from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os
import pandas as pd
import numpy as np

app = Flask(__name__)

allowed_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173")
cors_origins = [
    origin.strip().rstrip("/")
    for origin in allowed_origins.split(",")
    if origin.strip()
]
CORS(app, resources={r"/*": {"origins": cors_origins}})

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

try:
    model = joblib.load(os.path.join(BASE_DIR, 'random_forest_model_v1.pkl'))
    scaler = joblib.load(os.path.join(BASE_DIR, 'scaler_v1.pkl'))
except Exception as e:
    print(f"Error: {e}")

friendly_names = {
    'code_module': 'Mata Kuliah',
    'gender': 'Jenis Kelamin',
    'highest_education': 'Pendidikan',
    'imd_band': 'Status Ekonomi',
    'age_band': 'Kategori Usia',
    'num_of_prev_attempts': 'Riwayat Mengulang',
    'studied_credits': 'Beban SKS',
    'date_registration': 'Waktu Pendaftaran',
    'total_clicks': 'Total Aktivitas (VLE)',
    'mean_score': 'Kualitas Nilai Tugas',
    'mean_delay': 'Tingkat Keterlambatan',
    'clicks_early': 'Momentum Awal (30H)',
    'clicks_late': 'Konsistensi Akhir (30H)',
    'click_trend': 'Tren Keaktifan',
    'learning_efficiency': 'Efisiensi Belajar',
    'delay_stress_score': 'Skor Stres (SKS vs Delay)',
    'struggle_index': 'Indikator Kesulitan Akademik',
    'score_per_credit': 'Produktivitas per SKS',
    'is_overloaded': 'Beban Berlebih'
}

FEATURES_ORDER = [
    'code_module', 
    'gender', 
    'highest_education', 
    'imd_band', 
    'age_band', 
    'num_of_prev_attempts', 
    'studied_credits', 
    'date_registration', 
    'total_clicks', 
    'mean_score', 
    'mean_delay', 
    'clicks_early', 
    'clicks_late', 
    'delay_stress_score', 
    'is_overloaded', 
    'struggle_index', 
    'click_trend', 
    'learning_efficiency', 
    'score_per_credit'
]

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'service': 'AcademiaEWS backend'})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        raw_df = pd.DataFrame([data])
        
        raw_df['click_trend'] = (raw_df['clicks_late'] + 1) / (raw_df['clicks_early'] + 1)
        raw_df['learning_efficiency'] = raw_df['mean_score'] / (raw_df['total_clicks'] + 1)
        raw_df['delay_stress_score'] = raw_df['mean_delay'] * raw_df['studied_credits']
        raw_df['struggle_index'] = raw_df['num_of_prev_attempts'] / (raw_df['mean_score'] + 0.1)
        raw_df['score_per_credit'] = raw_df['mean_score'] / (raw_df['studied_credits'] + 1)
        raw_df['is_overloaded'] = (raw_df['studied_credits'] > 175).astype(int)
        
        raw_df = raw_df.fillna(0)
        final_input_df = raw_df[FEATURES_ORDER]
        X_scaled = scaler.transform(final_input_df)
        
        prediction = int(model.predict(X_scaled)[0])
        probabilities = model.predict_proba(X_scaled)[0]
        risk_percent = round(float(probabilities[0]) * 100, 1)

        importances = model.feature_importances_
        contributions = []
        for i, name in enumerate(FEATURES_ORDER):
            contributions.append({
                'name': friendly_names.get(name, name).upper(),
                'value': round(float(importances[i]) * 100, 2)
            })

        top_contributions = sorted(contributions, key=lambda x: x['value'], reverse=True)[:8]

        return jsonify({
            'status': 'success',
            'prediction': prediction,
            'label': "AT RISK" if prediction == 0 else "SUCCESS",
            'riskPercent': risk_percent,
            'contributions': top_contributions
        })
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False, use_reloader=False)
