import { User } from "firebase/auth";
import {
	CollectionReference,
	DocumentData,
	FirestoreDataConverter,
	collection,
	doc,
	getDoc,
	getDocs,
	getFirestore,
} from "firebase/firestore";

type getFn<Model> = (id: string) => Promise<Model>;
type getAllFn<Model> = () => Promise<Model[]>;
export class BaseModel<Model extends BuildModel, DBModel extends DocumentData, BuildModel> {
	name: string = "BaseModel";
	collectionName = "bases";
	converter: FirestoreDataConverter<Model, DBModel> = {
		toFirestore: (model: Model): DBModel => model as unknown as DBModel,
		fromFirestore: (snapshot: any, options: any): Model => {
			const data = snapshot.data(options) as DBModel;
			return data as unknown as Model;
		},
	};
	get collection(): CollectionReference<Model, DBModel> {
		return collection(getFirestore(), "organizations", this.orgId, this.collectionName).withConverter(
			this.converter
		);
	}
	orgId: string = "";
	user: User | null = null;
	get: getFn<Model> = async (id: string) => {
		return (await getDoc(doc(this.collection, id))) as Model;
	};

	getAll: getAllFn<Model> = async () => {
		const docs = await getDocs(this.collection);
		return docs.docs.map((doc) => doc.data()) as Model[];
	};
	delete = async (id: string): Promise<void> => {
		await getDoc(doc(this.collection, id));
	};
	refreshOrgId = async () => {
		if (this.user) {
			const token = await this.user.getIdTokenResult();
			this.orgId = (token.claims["orgId"] || "") as string;
		} else {
			this.orgId = "";
		}
	};
	constructor(user: User | null) {
		this.user = user;
		this.refreshOrgId();
	}
}
