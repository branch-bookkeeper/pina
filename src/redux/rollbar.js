import { mergeMap as mergeMap$ } from 'rxjs/operators/mergeMap';
import { filter as filter$ } from 'rxjs/operators/filter';

import { REQUEST_SUCCESS } from './requests';
import { requestIdEq } from './requests/helpers';

// Epics
const identifyUserEpic = (action$, { getState }) =>
    action$.ofType(REQUEST_SUCCESS).pipe(
        filter$(requestIdEq('user')),
        mergeMap$(({ payload: { result: user } }) => {
            window.Rollbar && window.Rollbar.configure({
                payload: {
                    person: {
                        id: user.id,
                        username: user.login,
                    },
                },
            });

            return [];
        }),
    );

export const epics = identifyUserEpic;
