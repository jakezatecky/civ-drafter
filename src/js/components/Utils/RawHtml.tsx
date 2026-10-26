interface RawHtmlProps {
    className: string;
    html: string;
}

function RawHtml({ className, html }: RawHtmlProps) {
    // eslint-disable-next-line react/no-danger
    return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

export default RawHtml;
