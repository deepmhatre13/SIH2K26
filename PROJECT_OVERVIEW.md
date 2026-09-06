# PAIMANA AI Project Overview

## 1. Product Summary

PAIMANA AI is a decision-support dashboard for monitoring large Central Sector infrastructure projects. It is presented for the Infrastructure and Project Monitoring Division (IPMD) of the Ministry of Statistics and Programme Implementation (MoSPI), Government of India.

The product combines project telemetry, cost and schedule forecasting, risk scoring, early-warning alerts, benchmarking, Common Upload Form (CUF) analysis, and an intelligence copilot in one operational interface. The intended monitoring scope is infrastructure projects valued at INR 150 crore and above.

The current repository is a working frontend prototype with a minimal FastAPI backend scaffold. The interface is feature-rich, but most portfolio analytics and intelligence responses are currently supplied by local mock data or client-side fallback logic.

## 2. Main Capabilities

### Executive Dashboard

The default workspace provides a portfolio-level view for senior decision-makers. It includes:

- Portfolio KPI cards for project count, total value, expenditure, cost escalation, delays, and risk distribution.
- Portfolio health and risk summaries.
- An interactive historical and predicted S-curve comparing planned and actual physical and financial progress.
- Sector-level breakdowns and comparative performance indicators.
- High-priority project cards that open the corresponding project dossier.
- Sector navigation that carries a selected sector filter into Project Explorer.

Primary implementation: [ExecutiveDashboard.tsx](frontend/src/components/dashboard/ExecutiveDashboard.tsx).

### Predictive Models

The Predictive Models workspace combines cost and schedule analysis.

#### Interactive cost simulation

Users can select a project and adjust five scenario variables:

- Land acquisition delay in months.
- Environmental clearance delay in months.
- Commodity inflation rate.
- Contractor cash-flow lag factor.
- Monsoon disruption days.

The simulator returns a scenario cost, cost delta, time delta, new PCRI risk score, risk level, confidence interval, and key vulnerability factors. It first attempts the backend simulation endpoint and falls back to a deterministic client-side formula when the endpoint is unavailable.

#### AI versus statistical evaluation

The interface compares conventional statistical methods such as ARIMA/OLS with the proposed AI/ML ensemble across:

- Cost-overrun forecasting accuracy.
- Mean absolute percentage error.
- Early-warning lead time.
- Schedule-slippage prediction error.
- False-alarm rate.
- Ability to synthesize regulatory and weather factors.

#### Portfolio escalation table

The table lists each loaded project with sanction cost, revised cost, predicted final cost, predicted escalation, model confidence, and actions to open the simulator or project dossier.

Primary implementations: [CostOverrunModel.tsx](frontend/src/components/predictions/CostOverrunModel.tsx), [CostSimulationStudio.tsx](frontend/src/components/predictions/CostSimulationStudio.tsx), and [TimeOverrunModel.tsx](frontend/src/components/predictions/TimeOverrunModel.tsx).

### PCRI Risk Scoring Framework

The risk workspace presents the Project Composite Risk Index (PCRI) for the selected project. It includes:

- Composite risk score and LOW, MODERATE, HIGH, or CRITICAL classification.
- Risk gauge visualization.
- Weighted risk dimensions:
  - Schedule risk: 35%.
  - Cost escalation risk: 30%.
  - Regulatory bottleneck risk: 20%.
  - Agency and contractor risk: 15%.
- Cost-versus-delay risk quadrant analysis.
- Project-level risk comparisons and dossier access.

Primary implementation: [RiskScoringFramework.tsx](frontend/src/components/risk/RiskScoringFramework.tsx).

### Early Warning Alert System (EWAS)

EWAS is designed to surface emerging project problems before they become materialized overruns. The alert workspace supports:

- Severity filtering for all, critical, high, and medium alerts.
- Search by project, agency, sector, or alert headline.
- Alert categories including cost spikes, critical schedule slippage, land-acquisition paralysis, contractor distress, and disbursement deceleration.
- Detection lead time, predicted cost impact, and predicted schedule impact telemetry.
- Prescriptive remedial recommendations for each alert.
- Navigation from an alert to its project dossier.
- Local status transitions to acknowledged, intervention initiated, or resolved.
- Toast feedback after a status update.

The header also exposes a notification center with a critical-alert badge and a preview of recent alerts.

Primary implementation: [EarlyWarningSystem.tsx](frontend/src/components/alerts/EarlyWarningSystem.tsx).

### Benchmarking Analytics

The benchmarking workspace compares performance at multiple organizational levels:

- Sector scorecards with project count, approved cost, expenditure, cost overrun, average delay, high-risk count, milestone adherence, and top bottleneck.
- Ministry scorecards with outlay, expenditure, cost variance, delay, and efficiency rating.
- Implementing-agency scorecards with portfolio value, average delay, cost variance, and performance score.

Primary implementation: [BenchmarkAnalytics.tsx](frontend/src/components/benchmarking/BenchmarkAnalytics.tsx).

### CUF Drivers and SHAP Attribution

The CUF analysis workspace explains which standard CUF fields and external variables influence predictions. It includes:

- CUF versus external-variable attribution summary.
- Ranked SHAP feature-importance bars.
- Direction and description of each feature's impact on overrun risk.
- Examples of high-value CUF predictors such as expenditure velocity, land acquisition status, physical-versus-financial divergence, and milestone velocity.
- Proposed non-CUF enrichment variables such as right-of-way turnaround, contractor financial exposure, and steel/cement price indices.

Primary implementation: [CUFDriverAnalysis.tsx](frontend/src/components/cuf/CUFDriverAnalysis.tsx).

### Project Explorer

Project Explorer provides project-level discovery and comparison. Users can:

- Search by project name, implementing agency, state, or PAIMANA ID.
- Filter by sector and PCRI risk level.
- Sort by composite risk, predicted cost, schedule delay, or project name.
- Switch between table and card layouts.
- Inspect original cost, revised cost, cost overrun, physical progress, schedule delay, and PCRI score.
- Open a project dossier by selecting a row or card.

Primary implementation: [ProjectExplorer.tsx](frontend/src/components/explorer/ProjectExplorer.tsx).

### Project Dossier

The dossier modal provides a 360-degree view of an individual project, including:

- Identity, sector, ministry, agency, state, and location.
- Original, revised, and predicted final costs.
- Expenditure and financial progress.
- Original, revised, and predicted completion dates.
- Physical progress and time overrun.
- PCRI breakdown and AI confidence score.
- Milestone statuses, slippage, weightage, and critical-path flags.
- Bottlenecks, severity, delay impact, cost impact, current status, and required agency action.
- CUF reporting data, including land acquisition and environmental clearance status.
- Executive summary and early-warning context.

Primary implementation: [ProjectDetailModal.tsx](frontend/src/components/explorer/ProjectDetailModal.tsx).

### Project Intelligence Copilot

The copilot is a drawer-based conversational assistant for project and portfolio questions. It provides:

- A floating launcher and header quick-launch button.
- Conversational history using typed user and assistant messages.
- Suggested investigation prompts.
- Responses about portfolio metrics, Railways, CUF drivers, delays, and project interventions.
- Backend LLM integration when available, with keyword-based fallback responses otherwise.

Primary implementation: [ProjectIntelligenceCopilot.tsx](frontend/src/components/assistant/ProjectIntelligenceCopilot.tsx).

## 3. Application Shell and Navigation

[App.tsx](frontend/src/App.tsx) is the main composition and state owner. It handles:

- Active workspace navigation.
- Dark and light theme switching through a body class.
- Initial project and alert loading.
- Loading-state presentation.
- Selected-project state and dossier modal visibility.
- Copilot drawer visibility.
- Sector filter handoff from dashboard to explorer.
- Shared project selection from dashboards, alerts, tables, and copilot actions.

[Header.tsx](frontend/src/components/common/Header.tsx) provides sticky navigation, PAIMANA identity, live clock, portfolio summary, alert notifications, copilot launch, theme switching, and the seven primary tabs:

1. Executive Dashboard
2. Predictive Models
3. Risk Scoring (PCRI)
4. Early Warning (EWAS)
5. Benchmarking
6. CUF Drivers & SHAP
7. Project Explorer

## 4. Domain Model

The shared TypeScript contracts are defined in [index.ts](frontend/src/types/index.ts). The central `Project` object contains:

- Project identifiers: OCMS code and PAIMANA ID.
- Administrative ownership: sector, ministry, agency, state, and location.
- Financial telemetry in INR crore.
- Original, revised, and predicted schedule dates.
- Status, risk level, PCRI breakdown, early-warning state, and model confidence.
- Milestones and bottlenecks.
- CUF fields.
- Executive summary.

Other domain contracts cover:

- `EarlyWarningAlert` and prescriptive recommendations.
- Sector, ministry, and agency benchmark records.
- AI/statistical model comparison metrics.
- SHAP feature importance.
- What-if simulation input and output.
- Copilot message history.

## 5. Data Flow and Integration

The current data flow is:

1. `App.tsx` calls `projectService.getProjects()` and `projectService.getAlerts()` during initial load.
2. [api.ts](frontend/src/services/api.ts) creates an Axios client with a configurable base URL.
3. The service attempts the backend first.
4. Failed requests or invalid response shapes fall back to local mock data.
5. Loaded projects and alerts are passed to the relevant feature components through props.
6. Most analytical screens read static benchmark, S-curve, model, and SHAP constants from [mockAnalytics.ts](frontend/src/data/mockAnalytics.ts).

The frontend expects these backend routes:

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/projects` | Load monitored projects |
| GET | `/api/projects/{id}` | Load one project |
| GET | `/api/alerts` | Load early-warning alerts |
| GET | `/api/analytics/portfolio` | Load portfolio statistics |
| GET | `/api/analytics/benchmarks` | Load benchmark data |
| POST | `/api/predictions/simulate` | Run a what-if scenario |
| POST | `/api/llm/chat` | Query the intelligence copilot |

The implemented FastAPI application currently exposes only `GET /` and `GET /api/hello` in [main.py](backend/app/main.py). As a result, normal local development uses the frontend fallback data unless these routes are added.

## 6. Repository Structure

```text
paimana_master_final.csv       Broader source dataset, currently not loaded by the app
README.md                      Minimal project heading
PROJECT_OVERVIEW.md            This project documentation
backend/
  app/main.py                  FastAPI application and currently implemented routes
  app/core/database.py         PostgreSQL SQLAlchemy scaffold
  app/routes/                  Reserved for API route modules
  app/models/                  Reserved for persistence models
  app/schemas/                 Reserved for request/response schemas
  app/services/                Reserved for backend services
frontend/
  src/App.tsx                  Application shell and shared state
  src/components/              Feature workspaces and common UI
  src/data/                    Mock projects, alerts, and analytics
  src/services/                Axios client and fallback-aware service layer
  src/types/                   Shared TypeScript domain contracts
```

## 7. Local Setup

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Available scripts are:

- `npm run dev`: start the Vite development server.
- `npm run build`: run TypeScript build checks and create a production bundle.
- `npm run lint`: run ESLint.
- `npm run preview`: preview the production bundle locally.

The frontend uses `http://localhost:8000/api` by default. Set `VITE_API_BASE_URL` to point to another API gateway.

### Backend

```powershell
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The backend dependency list includes FastAPI, Uvicorn, SQLAlchemy, PostgreSQL support, authentication libraries, and utility packages. The database scaffold in [database.py](backend/app/core/database.py) expects PostgreSQL connection settings from environment variables, but it is not currently wired into `main.py`.

## 8. Current Prototype Status and Gaps

The following points are important for anyone extending the project:

- The mock project file contains 10 detailed project records, while portfolio headline statistics describe 1,981 projects.
- `paimana_master_final.csv` contains a broader dataset, but no application code currently imports or processes it.
- Portfolio statistics, benchmarks, S-curve values, model metrics, and SHAP values are static constants.
- The simulation fallback is a calibrated coefficient-based client-side formula, not a trained model execution.
- Copilot fallback answers are hard-coded keyword-based responses and are not generated by an LLM.
- EWAS status changes are held in component state and are not persisted.
- Benchmarking and CUF views currently bypass the service layer.
- The backend routes expected by the frontend are not implemented yet.
- Database, authentication, migrations, model training, and production persistence are not implemented.
- There are no visible automated tests in the current repository structure.
- The copilot receives a project-opening callback, but its current implementation does not use that callback for every possible response path.

## 9. Suggested Next Development Steps

1. Implement the missing FastAPI routes using the existing TypeScript contracts as API specifications.
2. Decide whether the CSV is an import source, a one-time seed, or only a reference dataset.
3. Move portfolio analytics and benchmark constants behind the API service layer.
4. Add persistence for alert status changes and user actions.
5. Add request validation, database models, migrations, authentication, and role-aware access controls.
6. Replace prototype simulation and copilot fallbacks with versioned model and LLM services.
7. Add unit, integration, and browser-level tests for filtering, simulation outputs, alert transitions, and project navigation.


