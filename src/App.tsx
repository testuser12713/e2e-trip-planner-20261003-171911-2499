import { BrowserRouter, Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { TripsProvider } from './store/tripsStore';
import TripListPage from './features/trips/TripListPage';
import TripDetailPage from './features/tripDetail/TripDetailPage';
import PlanView from './features/plan/PlanView';
import BudgetView from './features/budget/BudgetView';
import PackingView from './features/packing/PackingView';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <TripsProvider>
      <BrowserRouter>
        <div className="app-shell">
          <header className="app-header">
            <div className="app-header__inner">
              <NavLink
                to="/"
                end
                className="brand"
                aria-label="Reiseplaner – zur Reiseliste"
              >
                <span className="brand__mark" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 21s-7-5.4-7-11a7 7 0 1 1 14 0c0 5.6-7 11-7 11z"
                      fill="#FFFFFF"
                    />
                    <circle cx="12" cy="10" r="2.5" fill="#0F766E" />
                  </svg>
                </span>
                Reiseplaner
              </NavLink>
            </div>
          </header>
          <main className="container">
            <Routes>
              <Route path="/" element={<TripListPage />} />
              <Route path="/trips/:id" element={<TripDetailPage />}>
                <Route index element={<Navigate to="plan" replace />} />
                <Route path="plan" element={<PlanView />} />
                <Route path="budget" element={<BudgetView />} />
                <Route path="packing" element={<PackingView />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TripsProvider>
  );
}
