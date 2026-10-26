import type { ReactNode } from 'react';

import AccordionIcon from '#js/components/Utils/AccordionIcon.tsx';

interface SettingsSectionProps {
    children: ReactNode;
    header: ReactNode;
    defaultOpen?: boolean;
}

function SettingsSection({ header, children, defaultOpen = false }: SettingsSectionProps) {
    return (
        <details className="accordion-item" open={defaultOpen}>
            <summary className="accordion-header">
                <h3>{header}</h3>
                <AccordionIcon />
            </summary>
            <div className="accordion-body">{children}</div>
        </details>
    );
}

export default SettingsSection;
