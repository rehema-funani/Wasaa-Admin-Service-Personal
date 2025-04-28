import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';
type ColorScheme = 'blue' | 'indigo' | 'purple' | 'teal' | 'green';

type ThemeContextType = {
    mode: ThemeMode;
    colorScheme: ColorScheme;
    isDarkMode: boolean;
    setMode: (mode: ThemeMode) => void;
    setColorScheme: (colorScheme: ColorScheme) => void;
    toggleMode: () => void;
};

type ThemeProviderProps = {
    children: ReactNode;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [mode, setMode] = useState<ThemeMode>('system');
    const [colorScheme, setColorScheme] = useState<ColorScheme>('blue');
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    // Function to update the document with the current theme
    const updateThemeClass = (darkMode: boolean) => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        setIsDarkMode(darkMode);
    };

    // Initialize theme on component mount
    useEffect(() => {
        // Get stored preferences
        const storedMode = localStorage.getItem('theme-mode') as ThemeMode || 'system';
        const storedColorScheme = localStorage.getItem('color-scheme') as ColorScheme || 'blue';

        setMode(storedMode);
        setColorScheme(storedColorScheme);

        // Apply the appropriate theme
        applyTheme(storedMode);

        // Listen for system preference changes if in system mode
        if (storedMode === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

            const handleChange = (e: MediaQueryListEvent) => {
                updateThemeClass(e.matches);
            };

            mediaQuery.addEventListener('change', handleChange);

            return () => {
                mediaQuery.removeEventListener('change', handleChange);
            };
        }
    }, []);

    // Apply theme based on mode
    const applyTheme = (themeMode: ThemeMode) => {
        if (themeMode === 'dark') {
            updateThemeClass(true);
        } else if (themeMode === 'light') {
            updateThemeClass(false);
        } else {
            // System mode - check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            updateThemeClass(prefersDark);
        }
    };

    // Set theme mode and save to localStorage
    const handleSetMode = (newMode: ThemeMode) => {
        localStorage.setItem('theme-mode', newMode);
        setMode(newMode);
        applyTheme(newMode);
    };

    // Set color scheme and save to localStorage
    const handleSetColorScheme = (newColorScheme: ColorScheme) => {
        localStorage.setItem('color-scheme', newColorScheme);
        setColorScheme(newColorScheme);

        // Apply color scheme classes or CSS variables here
        // This is a placeholder for actual implementation that would
        // change the CSS variables for your theme colors
        document.documentElement.setAttribute('data-color-scheme', newColorScheme);
    };

    // Toggle between light and dark mode
    const toggleMode = () => {
        const newMode = mode === 'dark' ? 'light' : 'dark';
        handleSetMode(newMode);
    };

    // Create context value
    const value: ThemeContextType = {
        mode,
        colorScheme,
        isDarkMode,
        setMode: handleSetMode,
        setColorScheme: handleSetColorScheme,
        toggleMode
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook for using theme context
export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export default ThemeContext;