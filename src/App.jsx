import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseHistory from './components/ExpenseHistory';
import ProfitLoss from './components/ProfitLoss';
import { useExpenses } from './hooks/useExpenses';

function App() {
  const {
    transactions,
    loading,
    addTransaction,
    deleteTransaction,
    expenseCategories,
    incomeCategories
  } = useExpenses();

  if (loading) {
    return <div className="loading-screen">Loading your finances...</div>;
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
