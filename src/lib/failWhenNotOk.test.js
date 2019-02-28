import failWhenNotOk from './failWhenNotOk';

describe('failWhenNotOk', () => {
    it('should return the response unchanged when property ok is true', () => {
        const response = {
            ok: true,
            status: 200,
            statusText: 'OK',
        };

        expect(failWhenNotOk(response)).toBe(response);
    });

    it('should throw an error when property ok is false', () => {
        const response = {
            ok: false,
            status: 404,
            statusText: 'Not Found',
        };
        const expectedError = new Error('Not Found');
        expectedError.response = response;

        expect(() => failWhenNotOk(response)).toThrow(expectedError);
    });
});
