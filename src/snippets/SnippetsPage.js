import React from 'react';

import { errorBoundary } from 'src/components/errorBoundary/ErrorBoundary';

const SnippetsPage = () => {
    return <div><p>Coming soon!</p></div>
};

export default errorBoundary(SnippetsPage);
