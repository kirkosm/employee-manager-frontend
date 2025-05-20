import React from 'react';
import './Layout.css';

function Layout({ children }) {
    return (
        <div className="app-wrapper">
            <header className="app-header">
                <h1>Employee Manager</h1>
            </header>

            <main className="app-main">
                {children}
            </main>

            <footer className="app-footer">
                <p>© 2025 Φτιαγμένο με React & Spring Boot</p>
            </footer>
        </div>
    );
}

export default Layout;
