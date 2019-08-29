import {
    find,
    propEq,
    defaultTo,
 } from 'ramda';

export default (pullRequestNumber, queue) =>
    defaultTo({}, find(propEq('pullRequestNumber', pullRequestNumber), queue));
