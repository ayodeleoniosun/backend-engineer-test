export class AuthMockRepository {
    public create = jest.fn(() => {
        return Promise.resolve(undefined);
    });

    public findUserByEmail = jest.fn(() => {
        return Promise.resolve(undefined);
    });

    public findById = jest.fn(() => {
        return Promise.resolve(undefined);
    });

    public deleteAll = jest.fn(() => {
        return Promise.resolve(undefined);
    });
}