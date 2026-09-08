1. Executive Dashboard — Gives senior officials a quick portfolio-level overview of project health, cost, delays, and risks.
2. Project Portfolio KPIs — Displays total projects, total project value, expenditure, cost escalation, delays, and risk distribution.
3. Cost Overrun Prediction — Linear Regression predicts the expected final project cost and potential cost overrun.
4. Cost Overrun Classification — Logistic Regression predicts whether a project is likely to experience a cost overrun.
5. Time Overrun Prediction — Linear Regression estimates expected completion time and potential schedule delay.
6. Time Overrun Classification — Logistic Regression predicts whether a project is likely to experience a time overrun.
7. Random Forest Risk Prediction — Predicts the probability of cost and time overruns using multiple project parameters.
8. XGBoost Prediction Model — Improves prediction performance and accuracy compared with baseline models.
9. ML Model Comparison — Compares Linear/Logistic Regression, Random Forest, and XGBoost using accuracy, MAPE, MAE, etc.
10. Isolation Forest Anomaly Detection — Detects abnormal project behaviour such as sudden expenditure spikes or unusual progress patterns.
11. Early Warning Alert System (EWAS) — Converts detected risks and anomalies into actionable alerts.
12. Cost Spike Detection — Identifies sudden abnormal increases in project expenditure.
13. Schedule Slippage Detection — Detects projects falling significantly behind schedule.
14. Land Acquisition Risk Detection — Identifies land acquisition issues that may cause project delays.
15. Environmental Clearance Risk — Tracks clearance-related delays affecting project completion.
16. Contractor Risk/Distress Detection — Identifies contractor-related issues that may cause delays or cost escalation.
17. Disbursement Deceleration Detection — Detects unusual reductions in expenditure or disbursement velocity.
18. PCRI — Project Composite Risk Index — Combines multiple risk factors into a single project risk score.
19. Risk Classification — Classifies projects as LOW, MODERATE, HIGH, or CRITICAL risk.
20. Risk Dashboard / Risk Gauge — Provides a visual representation of the project's overall risk level.
21. Cost-vs-Delay Risk Quadrant — Identifies projects based on the combination of cost escalation and schedule delay.
22. What-If Cost Simulation — Allows users to modify factors such as inflation, land delay, clearance delay, contractor cash-flow issues, and monsoon disruption.
23. Predicted Cost & Time Impact — Shows how different scenarios can affect the final project cost and completion time.
24. Confidence Score — Indicates the confidence level of the ML prediction.
25. S-Curve Analysis — Compares planned, actual, and predicted physical and financial progress.
26. Portfolio Benchmarking — Compares project performance across sectors, ministries, and implementing agencies.
27. Sector Performance Analysis — Identifies sector-wise cost, delay, and milestone performance.
28. Ministry Performance Analysis — Compares ministries based on expenditure, cost variance, delays, and efficiency.
29. Agency Performance Analysis — Evaluates implementing agencies based on delays, cost variance, and performance.
30. CUF Data Analysis — Uses Common Upload Form data as structured project information for monitoring and prediction.
31. SHAP Explainability — Explains which project features contributed most to an ML prediction.
32. Feature Importance Analysis — Identifies important factors influencing cost, time, and risk predictions.
33. Project Explorer — Allows users to search, filter, sort, and compare projects.
34. Project Dossier — Provides a complete 360° view of an individual project including cost, progress, delays, risk, milestones, and predictions.
35. Milestone Tracking — Tracks milestone status, slippage, weightage, and critical-path milestones.
36. Bottleneck Identification — Identifies major issues causing project delays or cost increases.
37. Prescriptive Recommendations — Suggests corrective actions for detected risks and alerts.
38. Project Intelligence Copilot — Conversational AI for asking questions about projects, portfolio performance, risks, delays, and interventions.
39. Notification Center — Provides a centralized view of critical and recent project alerts.
40. Alert Status Management — Allows alerts to be acknowledged, intervention initiated, or resolved.
41. Historical + Predictive Analytics — Combines historical project information with ML predictions for forward-looking monitoring.
42. FastAPI Backend — Provides APIs for project data, analytics, predictions, alerts, simulations, and the copilot.
43. PostgreSQL Database — Stores projects, users, alerts, predictions, milestones, CUF data, and historical records.
44. ML Prediction API — Connects the frontend with the trained ML models for predictions and risk scoring.
45. ML Model Training Pipeline — Cleans project data and trains/retrains the ML models.
46. Model Evaluation & Versioning — Evaluates model performance and manages different model versions.
47. External Factor Integration — Incorporates factors such as commodity prices, weather/monsoon disruption, regulatory factors, and contractor conditions.
48. Data Validation & Preprocessing — Cleans, validates, and prepares project data before ML prediction.
49. Authentication & Role-Based Access — Provides secure access to project information and different system functionalities.
50. End-to-End Decision Support — Combines data → ML prediction → risk detection → alert → recommendation → decision into one monitoring platform.

## Google OAuth Sign-In

The login page supports "Continue with Google" (Google Identity Services ID-token flow) alongside email/password.

### One-time Google Cloud setup
1. Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials) and create an **OAuth 2.0 Client ID** of type *Web application*.
2. Add BOTH development origins to **Authorized JavaScript origins**: `http://localhost:5173` and `http://localhost:5174` (Vite falls back to 5174 when 5173 is busy). No **Authorized redirect URI** is needed — the GIS popup returns the ID token directly to the page; there is no server-side redirect/callback flow.
3. Copy the generated client ID (it ends in `.apps.googleusercontent.com`).

### Configuration
- `frontend/.env` → `VITE_GOOGLE_CLIENT_ID=<your-client-id>` (see `frontend/.env.example`)
- `backend/.env` → `GOOGLE_CLIENT_ID=<same-client-id>` (see `backend/.env.example`)

The Google button is always visible on the login card. When the client ID is configured, it becomes the live official Google button; until then, clicking it shows setup guidance instead of failing silently.

### Flow
The Google button (loaded from `https://accounts.google.com/gsi/client`) returns a short-lived **ID token**, which the frontend POSTs to `POST /api/auth/google`. The backend verifies the token's signature, audience and expiry with `google-auth`, upserts the user, and returns the same session token used by password login — so session validation (`/api/auth/me`) and protected routes work unchanged.
