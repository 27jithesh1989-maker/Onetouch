import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseHistory from './components/ExpenseHistory';
import ProfitLoss from './components/ProfitLoss';
import Auth from './components/Auth';
import { useExpenses } from './hooks/useExpenses';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, loading: authLoading } = useAuth();
  const {
    transactions,
    loading: dataLoading,
    addTransaction,
    deleteTransaction,
    expenseCategories,
    incomeCategories
  } = useExpenses();

  if (authLoading || dataLoading) {
    return <div className="loading-screen">Loading your finances...</div>;
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="container">
          <Routes>
            <Route
              path="/"
              element={<Dashboard transactions={transactions} expenseCategories={expenseCategories} />}
            />
            <Route
              path="/add"
              element={
                <ExpenseForm
                  addTransaction={addTransaction}
                  expenseCategories={expenseCategories}
                  incomeCategories={incomeCategories}
                />
              }
            />
            <Route
              path="/pl"
              element={<ProfitLoss transactions={transactions} />}
            />
            <Route
              path="/history"
              element={<ExpenseHistory transactions={transactions} deleteTransaction={deleteTransaction} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
