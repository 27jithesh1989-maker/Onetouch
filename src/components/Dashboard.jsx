import React, { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { TrendingUp, CreditCard, ListChecks, ArrowUpRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = ({ transactions, expenseCategories }) => {
    const currentMonth = new Date();

    const monthlyExpenses = useMemo(() => {
        const start = startOfMonth(currentMonth);
        const end = endOfMonth(currentMonth);
        return transactions.filter(t => {
            const date = parseISO(t.date);
            return t.type === 'expense' && isWithinInterval(date, { start, end });
        });
    }, [transactions]);

    const totalSpent = useMemo(() => {
        return monthlyExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    }, [monthlyExpenses]);

    const categoryTotals = useMemo(() => {
        const totals = {};
        expenseCategories.forEach(c => totals[c] = 0);
        monthlyExpenses.forEach(e => {
            totals[e.category] = (totals[e.category] || 0) + parseFloat(e.amount);
        });
        return totals;
    }, [monthlyExpenses, expenseCategories]);

    const topCategory = useMemo(() => {
        const filtered = Object.entries(categoryTotals).filter(([_, val]) => val > 0);
        const sorted = filtered.sort((a, b) => b[1] - a[1]);
        return sorted.length > 0 ? sorted[0][0] : 'None';
    }, [categoryTotals]);

    // Chart Data for Pie
    const pieData = {
        labels: expenseCategories.filter(c => categoryTotals[c] > 0),
        datasets: [{
            data: expenseCategories.filter(c => categoryTotals[c] > 0).map(c => categoryTotals[c]),
            backgroundColor: [
                '#6366f1', '#10b981', '#f59e0b', '#ef4444',
                '#8b5cf6', '#ec4899', '#06b6d4', '#4b5563'
            ],
            borderWidth: 0,
        }]
    };

    const barData = {
        labels: monthlyExpenses.slice(0, 10).map(e => format(parseISO(e.date), 'MMM d')).reverse(),
        datasets: [{
            label: 'Amount',
            data: monthlyExpenses.slice(0, 10).map(e => e.amount).reverse(),
            backgroundColor: 'rgba(99, 102, 241, 0.6)',
            borderRadius: 8,
        }]
    };

    return (
        <div className="dashboard animate-fade">
            <header className="mb-6">
                <h2 className="text-main">Overview</h2>
                <p className="text-muted">Here's what's happening this month.</p>
            </header>

            <div className="stats-grid">
                <div className="stat-card glass-card">
                    <div className="stat-icon purple">
                        <CreditCard size={24} />
                    </div>
                    <div className="stat-info">
                        <p>Total Spent</p>
                        <h3>₹{totalSpent.toLocaleString('en-IN')}</h3>
                    </div>
                </div>

                <div className="stat-card glass-card">
                    <div className="stat-icon green">
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-info">
                        <p>Top Spend</p>
                        <h3>{topCategory}</h3>
                    </div>
                </div>

                <div className="stat-card glass-card">
                    <div className="stat-icon orange">
                        <ListChecks size={24} />
                    </div>
                    <div className="stat-info">
                        <p>Entries</p>
                        <h3>{monthlyExpenses.length}</h3>
                    </div>
                </div>
            </div>

            <div className="charts-grid">
                <div className="chart-container glass-card">
                    <h4>Expense Breakdown</h4>
                    <div className="chart-wrapper">
                        {totalSpent > 0 ? (
                            <Pie data={pieData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
                        ) : (
                            <div className="no-data">No expenses for this month</div>
                        )}
                    </div>
                </div>

                <div className="chart-container glass-card">
                    <h4>Recent Trends</h4>
                    <div className="chart-wrapper">
                        {monthlyExpenses.length > 0 ? (
                            <Bar data={barData} options={{ maintainAspectRatio: false }} />
                        ) : (
                            <div className="no-data">No expenses yet</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="recent-transactions glass-card">
                <div className="section-header">
                    <h4>Recent Activity</h4>
                    <ArrowUpRight size={20} className="text-muted" />
                </div>
                <div className="mini-table">
                    {transactions.slice(0, 5).map(t => (
                        <div key={t.id} className="transaction-row">
                            <div className="row-info">
                                <span className={`category-tag ${t.type === 'income' ? 'income-tag' : t.category.toLowerCase().replace(/\s/g, '-')}`}>
                                    {t.category}
                                </span>
                                <span className="date">{format(parseISO(t.date), 'MMM d, yyyy')}</span>
                            </div>
                            <div className={`row-amount ${t.type === 'income' ? 'text-success' : ''}`}>
                                {t.type === 'income' ? '+' : ''}₹{parseFloat(t.amount).toLocaleString('en-IN')}
                            </div>
                        </div>
                    ))}
                    {transactions.length === 0 && <div className="no-data">No activity recorded.</div>}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
