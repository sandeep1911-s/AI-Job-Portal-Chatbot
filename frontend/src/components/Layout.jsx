import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Briefcase, FileText, Lightbulb, TrendingUp, Send, MessageSquare,
    LayoutDashboard, Users, Shield, Star, AlertCircle, LogOut, Menu, X,
    PlusCircle, ClipboardList, Building2, UserCheck, ChevronDown
} from 'lucide-react';

import logo from '../assets/logo.png';

export default function Layout() {
    const { user, token, logout, isUser, isProvider, isAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const userNav = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/cv-builder', label: 'CV Builder', icon: FileText },
        { path: '/browse-jobs', label: 'Browse Jobs', icon: Briefcase },
        { path: '/job-suggestions', label: 'AI Suggestions', icon: Lightbulb },
        { path: '/skill-suggestions', label: 'Skill Growth', icon: TrendingUp },
        { path: '/my-applications', label: 'Applications', icon: Send },
        { path: '/chat', label: 'AI Chat', icon: MessageSquare },
        { path: '/my-complaints', label: 'Support & Complaints', icon: AlertCircle },
    ];

    const providerNav = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/post-job', label: 'Post Job', icon: PlusCircle },
        { path: '/my-jobs', label: 'My Jobs', icon: Building2 },
        { path: '/manage-applications', label: 'Applications', icon: ClipboardList },
        { path: '/admin-messages', label: 'Admin Messages', icon: MessageSquare },
    ];

    const adminNav = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/manage-providers', label: 'Providers', icon: UserCheck },
        { path: '/active-users', label: 'Users', icon: Users },
        { path: '/view-feedback', label: 'Feedback', icon: Star },
        { path: '/manage-complaints', label: 'Complaints', icon: AlertCircle },
    ];

    const navItems = isAdmin ? adminNav : isProvider ? providerNav : isUser ? userNav : [];
    const roleBadge = isAdmin ? 'Admin' : isProvider ? 'Provider' : 'User';
    const roleGradient = isAdmin
        ? 'linear-gradient(135deg, #ef4444, #dc2626)'
        : isProvider
            ? 'linear-gradient(135deg, #10b981, #059669)'
            : 'linear-gradient(135deg, #10b981, #0ea5e9)';

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* ─── Top Navigation Bar ───────────────────────────────── */}
            <nav className="main-nav">
                <div className="nav-inner">
                    {/* Logo */}
                    <Link to="/" className="nav-logo">
                        <img src={logo} alt="Pathify Logo" style={{ height: 24, width: 'auto', borderRadius: '8px' }} />
                        <span className="nav-logo-text" style={{ fontWeight: 800, fontSize: '1.2rem', background: 'linear-gradient(135deg, #10b981, #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Pathify
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="nav-links-desktop">
                        {token && navItems.map(item => {
                            const Icon = item.icon;
                            const active = location.pathname === item.path;
                            return (
                                <Link key={item.path} to={item.path}
                                    className={`nav-link ${active ? 'nav-link-active' : ''}`}>
                                    <Icon size={12} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Side Actions */}
                    <div className="nav-actions">
                        {token && user ? (
                            <>
                                <div className="nav-user-pill">
                                    <div className="nav-avatar" style={{ background: roleGradient }}>
                                        {user.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="nav-user-info">
                                        <span className="nav-username">{user.username}</span>
                                        <span className="nav-role-badge" style={{ background: roleGradient }}>
                                            {roleBadge}
                                        </span>
                                    </div>
                                </div>
                                <button onClick={handleLogout} className="nav-logout-btn" title="Logout">
                                    <LogOut size={14} />
                                </button>
                            </>
                        ) : (
                            <div style={{ display: 'flex', gap: 8 }}>
                                <Link to="/login" className="nav-btn-ghost">Sign In</Link>
                                <Link to="/register" className="nav-btn-cta">Get Started</Link>
                            </div>
                        )}

                        {/* Mobile Hamburger */}
                        {token && (
                            <button className="nav-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
                                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Drawer */}
                {mobileOpen && token && (
                    <div className="nav-mobile-drawer">
                        {navItems.map(item => {
                            const Icon = item.icon;
                            const active = location.pathname === item.path;
                            return (
                                <Link key={item.path} to={item.path}
                                    className={`nav-mobile-link ${active ? 'nav-mobile-link-active' : ''}`}
                                    onClick={() => setMobileOpen(false)}>
                                    <Icon size={18} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main style={{ flex: 1 }}>
                <Outlet />
            </main>

            {/* Footer */}
            <footer style={{
                borderTop: '1px solid var(--border)',
                padding: '20px 24px',
                textAlign: 'center',
                fontSize: 13,
                color: 'var(--text-muted)',
            }}>
                © 2026 Pathify— AI-Powered Career Platform
            </footer>
        </div>
    );
}
