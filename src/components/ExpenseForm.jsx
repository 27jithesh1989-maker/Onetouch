import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, XCircle, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

const ExpenseForm = ({ addTransaction, expenseCategories, incomeCategories }) => {
    const navigate = useNavigate();
    const [type, setType] = useState('expense');
    const categories = type === 'expense' ? expenseCategories : incomeCategories;

    const [formData, setFormData] = useState({
        amount: '',
        category: expenseCategories[0],
        date: new Date().toISOString().split('T')[0],
        notes: ''
    });

    useEffect(() => {
        setFormData(prev => ({ ...prev, category: categories[0] }));
    }, [type]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.amount || !formData.category) return;

        addTransaction({ ...formData, type });
        navigate('/');
    };

    return (
        <div className="form-container animate-fade">
            <div className="glass-card max-w-md mx-auto">
                <h2 className="mb-6">Add Transaction</h2>

                <div className="type-selector mb-6">
                    <button
                        type="button"
                        className={`type-btn ${type === 'expense' ? 'active expense' : ''}`}
                        onClick={() => setType('expense')}
                    >
                        <ArrowDownCircle size={20} />
                        Expense
                    </button>
                    <button
                        type="button"
                        className={`type-btn ${type === 'income' ? 'active income' : ''}`}
                        onClick={() => setType('income')}
                    >
                        <ArrowUpCircle size={20} />
                        Income
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="expense-form">
                    <div className="form-group">
                        <label>Amount (Required)</label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            placeholder="₹ 0.00"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            {categories.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Date</label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Notes (Optional)</label>
                        <textarea
                            placeholder="What was this for?"
                            rows="3"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">
                            <Save size={20} />
                            Save
                        </button>
                        <button type="button" className="btn btn-ghost" onClick={() => navigate('/')}>
                            <XCircle size={20} />
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExpenseForm;
