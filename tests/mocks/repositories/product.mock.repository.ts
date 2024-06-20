export class ProductMockRepository {
    public create = jest.fn(() => {
        return Promise.resolve(undefined);
    });

    public findAllProducts = jest.fn(() => {
        return Promise.resolve(undefined);
    });

    public findUserProducts = jest.fn(() => {
        return Promise.resolve(undefined);
    });

    public findProductByCriteria = jest.fn(() => {
        return Promise.resolve(undefined);
    });

    public findExistingProductByName = jest.fn(() => {
        return Promise.resolve(undefined);
    });

    public findById = jest.fn(() => {
        return Promise.resolve(undefined);
    });

    public findByIdAndUpdate = jest.fn(() => {
        return Promise.resolve(undefined);
    });
}