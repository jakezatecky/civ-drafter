import ThemeSwitcher from '#js/components/Header/ThemeSwitcher.tsx';
import type { Theme } from '#js/types.ts';

interface HeaderActionsProps {
    theme: Theme;
    onThemeChange: (theme: Theme) => void;
}

function HeaderActions({ theme, onThemeChange }: HeaderActionsProps) {
    return <ThemeSwitcher theme={theme} onChange={onThemeChange} />;
}

export default HeaderActions;
