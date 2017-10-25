import React from 'react';
import CallSplit from 'material-ui-icons/CallSplit';

const AlignedCallSplit = () => <CallSplit style={{ verticalAlign: 'middle' }} />;

export default ({branch}) => (
    <span>
        <AlignedCallSplit/>{branch}
    </span>
);
