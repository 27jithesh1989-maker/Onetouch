import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

const ProfitLoss = ({ transactions }) => {
    const currentMonth = new Date();

    const monthlyData = useMemo(() => {
        const start = startOfMonth(currentMonth);
        const end = endOfMonth(currentMonth);
        const filtered = transactions.filter(t => {
            const date = parseISO(t.date);
            return isWithinInterval(date, { start, end });
        });

        const income = filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const expense = filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount), 0);

        return {
            income,
            expense,
            profit: income - expense,
            margin: income > 0 ? ((income - expense) / income * 100).toFixed(1) : 0
        };
    }, [transactions]);

    return (
        <div className="pl-container animate-fade">
            <h2 className="mb-6">Profit & Loss Summary ({format(currentMonth, 'MMMM yyyy')})</h2>

            <div className="stats-grid">
                <div className="stat-card glass-card">
                    <div className="stat-icon green">
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-info">
                        <p>Total Income</p>
                        <h3 className="text-success">₹{monthlyData.income.toLocaleString('en-IN')}</h3>
                    </div>
                </div>

                <div className="stat-card glass-card">
                    <div className="stat-icon red">
                        <TrendingDown size={24} />
                    </div>
                    <div className="stat-info">
                        <p>Total Expense</p>
                        <h3 className="text-danger">₹{monthlyData.expense.toLocaleString('en-IN')}</h3>
                    </div>
                </div>

                <div className="stat-card glass-card">
                    <div className="stat-icon blue">
                        <DollarSign size={24} />
                    </div>
                    <div className="stat-info">
                        <p>Net Profit</p>
                        <h3 className={monthlyData.profit >= 0 ? 'text-success' : 'text-danger'}>
                            ₹{monthlyData.profit.toLocaleString('en-IN')}
                        </h3>
                    </div>
                </div>
            </div>

            <div className="glass-card mt-6">
                <h4>Performance Overview</h4>
                <div className="pl-details">
                    <div className="pl-row">
                        <span>Profit Margin</span>
                        <span className={`font-bold ${monthlyData.profit >= 0 ? 'text-success' : 'text-danger'}`}>
                            {monthlyData.margin}%
                        </span>
                    </div>
                    <div className="progress-bar-container">
                        <div
                            className={`progress-bar ${monthlyData.profit >= 0 ? 'bg-success' : 'bg-danger'}`}
                            style={{ width: `${Math.min(Math.abs(monthlyData.margin), 100)}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfitLoss;
