import find from 'ramda/src/find';
import propEq from 'ramda/src/propEq';
import defaultTo from 'ramda/src/defaultTo';

export default (pullRequestNumber, queue) =>
    defaultTo({}, find(propEq('pullRequestNumber', pullRequestNumber), queue));
