import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, History, BarChart3, LogOut } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
    const { signOut } = useAuth();

    return (
        <nav className="navbar">
            <div className="container nav-content">
                <div className="logo-section">
                    <div className="logo">
                        <Logo className="logo-icon" size={32} />
                        <h1>Onetouch</h1>
                    </div>
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

                <div className="nav-footer">
                    <button onClick={signOut} className="btn-logout">
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
