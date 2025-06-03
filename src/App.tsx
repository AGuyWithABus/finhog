import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import InvoicesPage from "./pages/InvoicesPage";
import ExpensesPage from "./pages/ExpensesPage";
import TasksPage from "./pages/TasksPage";
import QuotationsPage from "./pages/QuotationsPage";
import Clients from "./components/dashboard/Clients";
import Reports from "./components/dashboard/Reports";
import Settings from "./components/dashboard/Settings";
import routes from "tempo-routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/quotations" element={<QuotationsPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
