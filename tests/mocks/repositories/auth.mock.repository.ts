export class AuthMockRepository {
    public create = jest.fn(() => {
        return Promise.resolve(undefined);
    });

    public getUserByEmail = jest.fn(() => {
        return Promise.resolve(undefined);
    });
}