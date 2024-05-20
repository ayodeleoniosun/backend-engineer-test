export class ProductDto {
    id: string;
    name: string;
    description: string;
    price: number;
    createdAt: Date;

    constructor(id: string, name: string, description: string, price: number, createdAt: Date) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.createdAt = createdAt;
    }
}