# NHS Diagnostics Intelligence Platform

A high-performance, enterprise-grade AI-powered healthcare operations dashboard designed for NHS leadership, pathology departments, and diagnostic providers.

## Key Features
- **Executive Overview**: Real-time KPI clusters for diagnostic backlogs, wait times, and lab utilization.
- **Diagnostic Pressure Map**: Geographic visualization of regional capacity and wait time variance across the UK.
- **Pathology Bottleneck Analyzer**: Interactive workflow simulation identifying critical delays in blood and tissue analysis.
- **Gemini AI Insights Engine**: Automated executive briefings and risk analysis generated from simulated hospital data.
- **Staffing Optimization**: AI-driven resource allocation recommendations to mitigate clinician burnout.
- **Predictive Analytics**: Forecasting models for seasonal surges and cancer pathway compliance.
- **Ask DNA Chat Assistant**: An operational-level AI chatbot for real-time diagnostic intelligence.

## Technical Stack
- **Frontend**: React 19, Vite, Tailwind CSS, Recharts, Framer Motion, Lucide React.
- **Backend**: Express (Node.js) with tsx for development.
- **AI**: Google Gemini AI (@google/genai) integration.
- **Data**: Synthetic NHS Data Engine simulating realistic pathological and radiological workflows.

## Environment Variables
The application requires the following:
- `GEMINI_API_KEY`: Required for AI insights and chat assistant.
- `PORT`: Defaults to 3000.

## Development
```bash
npm install
npm run dev
```

## Production Build & Start
```bash
npm run build
npm start
```

## Deployment Instructions
1. Ensure `GEMINI_API_KEY` is set in your environment.
2. Build the application using `npm run build`.
3. Start the bundled server using `npm start`.
4. The server will be accessible at port 3000.
