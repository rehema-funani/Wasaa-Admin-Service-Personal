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

    const updateThemeClass = (darkMode: boolean) => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        setIsDarkMode(darkMode);
    };

    useEffect(() => {
        const storedMode = localStorage.getItem('theme-mode') as ThemeMode || 'system';
        const storedColorScheme = localStorage.getItem('color-scheme') as ColorScheme || 'blue';

        setMode(storedMode);
        setColorScheme(storedColorScheme);

        applyTheme(storedMode);

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

    const applyTheme = (themeMode: ThemeMode) => {
        if (themeMode === 'dark') {
            updateThemeClass(true);
        } else if (themeMode === 'light') {
            updateThemeClass(false);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            updateThemeClass(prefersDark);
        }
    };

    const handleSetMode = (newMode: ThemeMode) => {
        localStorage.setItem('theme-mode', newMode);
        setMode(newMode);
        applyTheme(newMode);
    };

    const handleSetColorScheme = (newColorScheme: ColorScheme) => {
        localStorage.setItem('color-scheme', newColorScheme);
        setColorScheme(newColorScheme);

        document.documentElement.setAttribute('data-color-scheme', newColorScheme);
    };

    const toggleMode = () => {
        const newMode = mode === 'dark' ? 'light' : 'dark';
        handleSetMode(newMode);
    };

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

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export default ThemeContext;