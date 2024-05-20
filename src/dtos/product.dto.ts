export class ProductDto {
    id: string;
    name: string;
    description: string;
    price: string;
    createdAt: Date;

    constructor(id: string, name: string, description: string, price: string, createdAt: Date) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = Intl.NumberFormat('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(price);
        this.createdAt = createdAt;
    }
}