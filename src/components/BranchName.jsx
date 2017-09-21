import React from 'react';
import { CallSplit } from 'material-ui-icons';

const AlignedCallSplit = () => <CallSplit style={{ verticalAlign: 'middle' }} />;

export default ({branch}) => (
    <span>
        <AlignedCallSplit/>{branch}
    </span>
);
