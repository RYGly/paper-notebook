/**
 * theme.js — Light/Dark mode toggle
 * Persists preference in localStorage, defaults to light
 */
(function () {
    const STORAGE_KEY = 'pn-theme';

    // Apply theme immediately (before paint) to avoid flash
    const saved = localStorage.getItem(STORAGE_KEY) || 'light';
    document.documentElement.setAttribute('data-theme', saved);

    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('theme-toggle');
        if (!btn) return;

        function updateButton(theme) {
            const isDark = theme === 'dark';
            btn.querySelector('.toggle-icon').textContent = isDark ? '☀️' : '🌙';
            btn.querySelector('.toggle-label').textContent = isDark ? 'Light' : 'Dark';
            btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        }

        // Set initial button state
        updateButton(document.documentElement.getAttribute('data-theme') || 'light');

        btn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') || 'light';
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem(STORAGE_KEY, next);
            updateButton(next);
        });
    });
})();
