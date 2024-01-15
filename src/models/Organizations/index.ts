import { User } from "firebase/auth";

export class OrganizationCollection {
    user: User | null = null;
    role: string = "";
    refreshRole = async () => {
        if(this.user){
            const token = await this.user.getIdTokenResult();
            this.role = (token.claims["role"] || "") as string;
        } else {
            this.role = "";
        }
    }
    constructor(user: User | null){
        this.user = user;
        this.refreshRole();
    }
}