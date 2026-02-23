import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, History, Wallet, BarChart3 } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="container nav-content">
                <div className="logo">
                    <Wallet className="primary-icon" size={28} />
                    <h1>Onetouch</h1>
                </div>
                <div className="nav-links">
                    <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/add" className={({ isActive }) => isActive ? 'active' : ''}>
                        <PlusCircle size={20} />
                        <span>Add Transaction</span>
                    </NavLink>
                    <NavLink to="/pl" className={({ isActive }) => isActive ? 'active' : ''}>
                        <BarChart3 size={20} />
                        <span>Profit & Loss</span>
                    </NavLink>
                    <NavLink to="/history" className={({ isActive }) => isActive ? 'active' : ''}>
                        <History size={20} />
                        <span>History</span>
                    </NavLink>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
