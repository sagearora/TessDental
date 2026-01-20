import React from "react";
import ReactDOM from "react-dom/client";
import { registerLicense } from "@syncfusion/ej2-base";
import App from "./App";
import "./index.css";

// Syncfusion Bootstrap 5 Theme Styles
// Import base styles first (includes icon fonts)
import "@syncfusion/ej2-base/styles/bootstrap5.css";
// Then import component-specific styles
import "@syncfusion/ej2-buttons/styles/bootstrap5.css";
import "@syncfusion/ej2-calendars/styles/bootstrap5.css";
import "@syncfusion/ej2-dropdowns/styles/bootstrap5.css";
import "@syncfusion/ej2-inputs/styles/bootstrap5.css";
import "@syncfusion/ej2-navigations/styles/bootstrap5.css";
import "@syncfusion/ej2-popups/styles/bootstrap5.css";
import "@syncfusion/ej2-schedule/styles/bootstrap5.css";

// Register Syncfusion license (use environment variable if available)
const licenseKey = import.meta.env.VITE_SYNCFUSION_LICENSE_KEY;
if (licenseKey) {
  registerLicense(licenseKey);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
