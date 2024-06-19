import {ProductService} from "../../src/services/product.service";
import {ProductRepository} from "../../src/repositories/product.repository";
import {getProduct} from "../fixtures/product.fixture";
import {ProductModelDto} from "../../src/dtos/models/product.model.dto";
import {ErrorMessages} from "../../src/utils/enums/error.messages";

describe('Product unit tests', () => {
    let productRepository: ProductRepository;
    let service: ProductService;

    beforeAll(async () => {
        productRepository = new ProductRepository();
        service = new ProductService(productRepository);
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
    
    // describe('Create Product', () => {
    //     it('it should throw an error if a product already exist', async () => {
    //         try {
    //             await create(createProductPayload, user.id);
    //             await create(createProductPayload, user.id);
    //         } catch (err: any) {
    //             expect(err.message).toBe(ErrorMessages.PRODUCT_ALREADY_EXISTS);
    //         }
    //     });
    //
    //     it('it can create new product', async () => {
    //         const response = await create(createProductPayload, user.id);
    //
    //         expect(response.name).toBe(createProductPayload.name);
    //         expect(response.description).toBe(createProductPayload.description);
    //         expect(response.price).toBe(createProductPayload.price);
    //     });
    // });
    //
    // describe('Update Product', () => {
    //     it('it should throw an error if a product does not exist', async () => {
    //         try {
    //             const invalidId = new ObjectId().toString();
    //
    //             await update(invalidId, createProductPayload, user.id);
    //         } catch (err: any) {
    //             expect(err.message).toBe(ErrorMessages.PRODUCT_NOT_FOUND);
    //         }
    //     });
    //
    //     it('it cannot update existing product with the same product name', async () => {
    //         try {
    //             const firstCreatedProduct = await create(createProductPayload, user.id);
    //
    //             let payload = JSON.parse(JSON.stringify(createProductPayload));
    //             payload.name = 'updated product name';
    //
    //             await create(payload, user.id);
    //             await update(firstCreatedProduct.id, payload, user.id);
    //         } catch (err: any) {
    //             expect(err.message).toBe(ErrorMessages.PRODUCT_ALREADY_EXISTS);
    //         }
    //     });
    //
    //     it('it can update existing product', async () => {
    //         const createProduct = await create(createProductPayload, user.id);
    //
    //         let payload = JSON.parse(JSON.stringify(createProductPayload));
    //         payload.name = 'updated product name';
    //         payload.description = 'updated product description';
    //
    //         const response = await update(createProduct.id, payload, user.id);
    //
    //         expect(response!.name).toBe(payload.name);
    //         expect(response!.description).toBe(payload.description);
    //         expect(response!.price).toBe(payload.price);
    //     });
    // });
    //
    //
    // describe('Show Product', () => {
    //     it('it should throw an error if a product does not exist', async () => {
    //         try {
    //             const invalidId = new ObjectId().toString();
    //
    //             await show(invalidId);
    //         } catch (err: any) {
    //             expect(err.message).toBe(ErrorMessages.PRODUCT_NOT_FOUND);
    //         }
    //     });
    //
    //     it('it should show product details', async () => {
    //         const createProduct = await create(createProductPayload, user.id);
    //         const response = await show(createProduct.id);
    //
    //         expect(response.name).toBe(createProduct.name);
    //         expect(response.description).toBe(createProduct.description);
    //         expect(response.price).toBe(createProduct.price);
    //     });
    // });
    //
    //
    // describe('Delete Product', () => {
    //     it('it should throw an error if a product does not exist', async () => {
    //         try {
    //             const invalidId = new ObjectId().toString();
    //
    //             await destroy(invalidId, user.id);
    //         } catch (err: any) {
    //             expect(err.message).toBe(ErrorMessages.PRODUCT_NOT_FOUND);
    //         }
    //     });
    //
    //     it('it should delete product', async () => {
    //         const createProduct = await create(createProductPayload, user.id);
    //         const response = await destroy(createProduct.id, user.id);
    //
    //         expect(response!.id.toString()).toBe(createProduct.id.toString());
    //         expect(response!.name).toBe(createProduct.name);
    //         expect(response!.description).toBe(createProduct.description);
    //         expect(response!.price).toBe(createProduct.price);
    //     });
    // });
});