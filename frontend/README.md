# PharmAI Frontend (Vite + React + Tailwind + shadcn)

This repo is a prototype frontend for the PharmAI drug repurposing platform.

Quick start (from `frontend` folder):

```powershell
npm install
npm run dev
```

Shadcn UI

If you haven't already initialized shadcn UI, run:

```powershell
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
```

Notes

- The UI uses dummy data from `src/states/useResultStore.js`. Replace `setQuery` with real API calls when backend is available.
- Results rendering is case-aware (4 modes) and will auto-update when you submit the input panel.
- `ResultsPanel.jsx` includes simple copy/export and a dummy report download for export.

Next steps

- Connect real APIs and replace the dummy generator in `useResultStore.js`.
- Improve PDF/export by adding a library like `jsPDF` or server-side report generation.
- Add authentication and audit logging if required.
