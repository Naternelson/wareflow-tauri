import { getDocs, where, query, setDoc, addDoc, deleteDoc, doc, FirestoreDataConverter, FieldValue, serverTimestamp, Timestamp } from "firebase/firestore";
import { BaseModel } from "../BaseCollection";
export interface DBProduct {
    id: string,
    name: string,
    organizationId: string
    description: string,
    color: string,
    labelDisplay: string,
    udi: boolean,
    createdOn: FieldValue,
    updatedOn: FieldValue
}
export interface ProductBuild {
    id?: string,
    name: string,
    organizationId?: string,
    description: string,
    color: string,
    labelDisplay: string,
    udi: boolean
}
export interface Product extends ProductBuild {
    id: string,
    createdOn: string,
    updatedOn: string
}
type DBModel = DBProduct;
type Build = ProductBuild;
type Model = Product;
export class ProductsCollection extends BaseModel<Model, DBModel, Build> {
	name: string = "Product";
    collectionName = "products";
    converter: FirestoreDataConverter<Model, DBModel> = ({
        toFirestore: (model: Model): DBModel => {
            return {
                id: model.id,
                name: model.name,
                organizationId: model.organizationId || this.orgId,
                description: model.description,
                color: model.color,
                labelDisplay: model.labelDisplay,
                udi: model.udi,
                createdOn: Timestamp.fromDate(new Date(model.createdOn)),
                updatedOn: serverTimestamp()
            }
        },
        fromFirestore: (snapshot: any, options: any): Model => {
            const data = snapshot.data(options) as DBModel;
            return data as unknown as Model;
        }
    
    })
	add = async (product: ProductBuild): Promise<Product> => {
		const docRef = doc(this.collection);
		const productWithID: Product = {
			...product,
			id: docRef.id,
			createdOn: new Date().toLocaleDateString(),
			updatedOn: new Date().toLocaleDateString(),
		};
		await addDoc(this.collection, productWithID);
		return productWithID;
	};
	delete = async (id: string): Promise<void> => {
		await deleteDoc(doc(this.collection, id));
	};
	get = async (id: string): Promise<Product> => {
		const docRef = await getDocs(query(this.collection, where("id", "==", id)));
		if (docRef.docs.length === 0) {
			throw new Error(`${this.name} not found`);
		}
		return docRef.docs[0].data();
	};
	getAll = async (): Promise<Product[]> => {
		const docRef = await getDocs(this.collection);
		return docRef.docs.map((doc) => doc.data());
	};

	update = async (product: Product): Promise<Product> => {
		await setDoc(doc(this.collection, product.id), product);
		return product;
	};
}