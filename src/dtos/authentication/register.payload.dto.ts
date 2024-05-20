export class RegisterPayloadDto {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;

    constructor(id: string, firstname: string, lastname: string, email: string, password: string) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
    }
}