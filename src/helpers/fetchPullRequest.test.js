import fetchPullRequest from './fetchPullRequest';

describe('fetchPullRequest', () => {
    beforeEach(() => {
        fetch.resetMocks();
    });

    it('should fetch from the right URL using the provided access token', () => {
        fetch.mockResponseOnce(JSON.stringify({}));

        return fetchPullRequest('ACCESS_TOKEN', 'foo', 'bar', 333)
            .then(pullRequest => {
                expect(fetch).toHaveBeenCalledWith(
                    'http://localhost:3000/pull-request/foo/bar/333',
                    { headers: { authorization: 'token ACCESS_TOKEN' } }
                );
            });
    });

    it('should return the parsed result of the fetch on success', () => {
        const pullRequestData = {
            pullRequestNumber: 333,
            humanUrl: 'https://github.com/foo/bar/pull/2',
        };

        fetch.mockResponseOnce(JSON.stringify(pullRequestData));

        return fetchPullRequest('ACCESS_TOKEN', 'foo', 'bar', 333)
            .then(pullRequest => {
                expect(pullRequest).toEqual(pullRequestData);
            });
    });

    it('should fail when the result is empty', () => {
        fetch.mockResponseOnce('');

        return fetchPullRequest('ACCESS_TOKEN', 'foo', 'bar', 333)
            .then(() => fail('Should never reach this point'))
            .catch(e => {
                expect(e).toBeInstanceOf(Error);
            });
    });

    it('should fail when the status code is not one of success', () => {
        fetch.mockResponseOnce('', { status: 404, statusText: 'Not Found' });

        return fetchPullRequest('ACCESS_TOKEN', 'foo', 'bar', 333)
            .then(result => fail('Should never reach this point'))
            .catch(e => {
                expect(e).toBeInstanceOf(Error);
            });
    });
});
