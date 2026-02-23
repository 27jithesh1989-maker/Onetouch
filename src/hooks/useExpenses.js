import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const EXPENSE_CATEGORIES = [
  'Food',
  'Travel',
  'Rent',
  'Utilities',
  'Shopping',
  'Entertainment',
  'Health',
  'Miscellaneous'
];

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investment',
  'Gift',
  'Other'
];

export const useExpenses = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch transactions from Supabase
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error.message);
      // Fallback to local storage if supabase fails or is not configured
      const saved = localStorage.getItem('onetouch_transactions');
      if (saved) {
        setTransactions(JSON.parse(saved));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Sync to local storage as fallback
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem('onetouch_transactions', JSON.stringify(transactions));
    }
  }, [transactions]);

  const addTransaction = async (transaction) => {
    const newTransaction = {
      ...transaction,
      id: crypto.randomUUID(),
      type: transaction.type || 'expense',
      created_at: new Date().toISOString()
    };

    // Optimistic Update
    setTransactions(prev => [newTransaction, ...prev]);

    try {
      const { error } = await supabase
        .from('transactions')
        .insert([newTransaction]);

      if (error) throw error;
    } catch (error) {
      console.error('Error adding transaction:', error.message);
      // Rollback is usually complex, for now we just log it
      // In a real app, you'd show an error toast
    }
  };

  const deleteTransaction = async (id) => {
    // Optimistic Update
    setTransactions(prev => prev.filter(t => t.id !== id));

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting transaction:', error.message);
    }
  };

  return {
    transactions,
    loading,
    expenses: transactions.filter(t => t.type === 'expense'),
    incomes: transactions.filter(t => t.type === 'income'),
    addTransaction,
    deleteTransaction,
    expenseCategories: EXPENSE_CATEGORIES,
    incomeCategories: INCOME_CATEGORIES
  };
};
