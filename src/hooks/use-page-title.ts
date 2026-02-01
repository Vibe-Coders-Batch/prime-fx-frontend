import { useEffect } from "react";
export function usePageTitle(title: string, subtitle?: string) {
    useEffect(() => {
        const fullTitle = subtitle ? `${title} - ${subtitle}` : title;
        document.title = `${fullTitle} | Prime Assets Education`;
        return () => {
            document.title = "Prime Assets Education";
        };
    }, [title, subtitle]);
}
