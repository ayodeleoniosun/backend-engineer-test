import {ProductService} from "../../src/services/product.service";
import {ProductRepository} from "../../src/repositories/product.repository";
import {getProduct} from "../fixtures/product.fixture";
import {ProductModelDto} from "../../src/dtos/models/product.model.dto";
import {ErrorMessages} from "../../src/utils/enums/error.messages";
import {ProductDto} from "../../src/dtos/requests/product.dto";

describe('Product unit tests', () => {
    let productRepository: ProductRepository;
    let service: ProductService;

    let findProductByCriteria: jest.SpyInstance;

    beforeAll(async () => {
        productRepository = new ProductRepository();
        service = new ProductService(productRepository);
    });

    beforeEach(() => {
        findProductByCriteria = jest.spyOn(productRepository, 'findProductByCriteria');
    });

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    describe('All Products', () => {
        let findAllProducts: jest.SpyInstance;
        let findUserProducts: jest.SpyInstance;
        let findById: jest.SpyInstance;

        beforeEach(() => {
            findAllProducts = jest.spyOn(productRepository, 'findAllProducts');
            findUserProducts = jest.spyOn(productRepository, 'findUserProducts');
            findById = jest.spyOn(productRepository, 'findById');
        });

        afterEach(() => {
            jest.resetAllMocks();
            jest.restoreAllMocks();
        });

        it('it should display all products', async () => {
            findAllProducts.mockResolvedValue([getProduct()]);

            const products = await service.index();
            expect(products).toBeInstanceOf(Array);
            expect(products[0]).toBeInstanceOf(ProductModelDto)
        });

        it('it should display logged in user products', async () => {
            const userId = '6672cb6915285f0e39ab32de';
            findUserProducts.mockResolvedValue([getProduct({userId})]);

            const products = await service.myProducts(userId);
            expect(products).toBeInstanceOf(Array);
            expect(products[0]).toBeInstanceOf(ProductModelDto);
        });

        it('it should throw an error if product is not found', async () => {
            const _id = '6672cb6915285f0e39ab32de';
            findById.mockResolvedValue(getProduct());

            try {
                await service.show(_id);
            } catch (e: any) {
                expect(findById).toBeCalledTimes(1);
                expect(e.message).toBe(ErrorMessages.PRODUCT_NOT_FOUND);
            }
        });

        it('it should display product details', async () => {
            const _id = '6672cb6915285f0e39ab32de';
            findById.mockResolvedValue(getProduct({_id}));

            const product = await service.show(_id);
            expect(product).toBeInstanceOf(ProductModelDto);
        });
    });

    describe('Create Product', () => {
        let createProductMock: jest.SpyInstance;

        beforeEach(() => {
            createProductMock = jest.spyOn(productRepository, 'create');
        });

        afterEach(() => {
            jest.resetAllMocks();
            jest.restoreAllMocks();
        });

        it('it should throw an error if a product already exist', async () => {
            const userId = '6672cb6915285f0e39ab32de';
            const mockProductData = getProduct();
            findProductByCriteria.mockResolvedValue(mockProductData);

            const payload = new ProductDto();
            payload.name = mockProductData.name;
            payload.description = mockProductData.description;
            payload.price = mockProductData.price;

            try {
                await service.create(payload, userId);
            } catch (e: any) {
                expect(findProductByCriteria).toBeCalledTimes(1);
                expect(createProductMock).toBeCalledTimes(0);
                expect(e.message).toBe(ErrorMessages.PRODUCT_ALREADY_EXISTS);
            }
        });

        it('it can create new product', async () => {
            const userId = '6672cb6915285f0e39ab32de';
            const mockProductData = getProduct();
            findProductByCriteria.mockResolvedValue(null);
            createProductMock.mockResolvedValue(mockProductData);

            const payload = new ProductDto();
            payload.name = mockProductData.name;
            payload.description = mockProductData.description;
            payload.price = mockProductData.price;

            const product = await service.create(payload, userId);
            expect(product).toBeInstanceOf(ProductModelDto);
            expect(product).toHaveProperty('id', mockProductData._id);
            expect(product).toHaveProperty('name', mockProductData.name);
        });
    });


    describe('Update Product', () => {
        let findExistingProductByName: jest.SpyInstance;
        let findByIdAndUpdate: jest.SpyInstance;

        beforeEach(() => {
            findExistingProductByName = jest.spyOn(productRepository, 'findExistingProductByName');
            findByIdAndUpdate = jest.spyOn(productRepository, 'findByIdAndUpdate');
        });

        afterEach(() => {
            jest.resetAllMocks();
            jest.restoreAllMocks();
        });

        it('it should throw error if product is not found', async () => {
            const userId = '6672cb6915285f0e39ab32de';
            const _id = '6672cb6915285f0e39ab32d1';

            const mockProductData = getProduct();
            findProductByCriteria.mockResolvedValue(null);

            const payload = new ProductDto();
            payload.name = mockProductData.name;
            payload.description = mockProductData.description;
            payload.price = mockProductData.price;

            try {
                await service.update(_id, payload, userId);
            } catch (e: any) {
                expect(findProductByCriteria).toBeCalledTimes(1);
                expect(findByIdAndUpdate).toBeCalledTimes(0);
                expect(e.message).toBe(ErrorMessages.PRODUCT_NOT_FOUND);
            }
        });

        it('it cannot update existing product with the same product name', async () => {
            const userId = '6672cb6915285f0e39ab32de';
            const _id = '6672cb6915285f0e39ab32d1';
            const name = 'A new product';

            const mockProductData = getProduct({_id, userId, name});
            findProductByCriteria.mockResolvedValue(mockProductData);
            findExistingProductByName.mockResolvedValue(mockProductData);

            const payload = new ProductDto();
            payload.name = mockProductData.name;
            payload.description = mockProductData.description;
            payload.price = mockProductData.price;

            try {
                await service.update(_id, payload, userId);
            } catch (e: any) {
                expect(findProductByCriteria).toBeCalledTimes(1);
                expect(findExistingProductByName).toBeCalledTimes(1);
                expect(findByIdAndUpdate).toBeCalledTimes(0);
                expect(e.message).toBe(ErrorMessages.PRODUCT_ALREADY_EXISTS);
            }
        });

        it('it can update existing product', async () => {
            const userId = '6672cb6915285f0e39ab32de';
            const _id = '6672cb6915285f0e39ab32d1';
            const name = 'A new product';

            const mockProductData = getProduct({_id, userId, name});
            findProductByCriteria.mockResolvedValue(mockProductData);
            findExistingProductByName.mockResolvedValue(null);
            findByIdAndUpdate.mockResolvedValue(mockProductData);

            const payload = new ProductDto();
            payload.name = mockProductData.name;
            payload.description = mockProductData.description;
            payload.price = mockProductData.price;

            const product = await service.update(_id, payload, userId);
            expect(product).toBeInstanceOf(ProductModelDto);
            expect(product).toHaveProperty('id', mockProductData._id);
            expect(product).toHaveProperty('name', mockProductData.name);
        });
    });

    describe('Delete Product', () => {
        let findByIdAndDelete: jest.SpyInstance;

        beforeEach(() => {
            findByIdAndDelete = jest.spyOn(productRepository, 'findByIdAndDelete');
        });

        afterEach(() => {
            jest.resetAllMocks();
            jest.restoreAllMocks();
        });

        it('it should throw an error if a product does not exist', async () => {
            const userId = '6672cb6915285f0e39ab32de';
            const _id = '6672cb6915285f0e39ab32d1';

            findProductByCriteria.mockResolvedValue(null);

            try {
                await service.destroy(_id, userId);
            } catch (e: any) {
                expect(findProductByCriteria).toBeCalledTimes(1);
                expect(findByIdAndDelete).toBeCalledTimes(0);
                expect(e.message).toBe(ErrorMessages.PRODUCT_NOT_FOUND);
            }
        });

        it('it should delete product', async () => {
            const userId = '6672cb6915285f0e39ab32de';
            const _id = '6672cb6915285f0e39ab32d1';

            const mockProductData = getProduct({_id, userId});
            findProductByCriteria.mockResolvedValue(mockProductData);
            findByIdAndDelete.mockResolvedValue(mockProductData);

            const product = await service.destroy(_id, userId);
            expect(product).toHaveProperty('_id', mockProductData._id);
            expect(product).toHaveProperty('name', mockProductData.name);
        });
    });
});