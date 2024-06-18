export class ProductModelDto {
    id: string;
    name: string;
    description: string;
    price: string;
    createdAt: Date;

    constructor(id: string, name: string, description: string, price: number, createdAt: Date) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price.toLocaleString("en", {minimumFractionDigits: 2});
        this.createdAt = createdAt;
    }
}