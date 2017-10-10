import { branch, renderNothing } from 'recompose';

export default condition => branch(
    condition,
    renderNothing,
);
