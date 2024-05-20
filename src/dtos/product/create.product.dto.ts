export class CreateProductPayloadDto {
    name: string;
    description: string;
    price: number;

    constructor(name: string, description: string, price: number) {
        this.name = name;
        this.description = description;
        this.price = price;
    }
}