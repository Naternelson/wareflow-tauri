import {
	getFirestore,
	getDocs,
	setDoc,
	deleteDoc,
	doc,
	FirestoreDataConverter,
	FieldValue,
	serverTimestamp,
	Timestamp,
	getDoc,
} from "firebase/firestore";
import { BaseModel } from "../BaseCollection";
import { Device, DevicesCollection } from "../Devices";
import { Case, CasesCollection } from "../Cases";
export enum OrderStatus {
	Queued = "Queued",
	Active = "Active",
	Completed = "Completed",
	Cancelled = "Cancelled",
}
export interface DBOrder {
	id: string;
	customer: string;
	product: string;
	organization: string;
	quantity: number;
	quantityAvailable: number;
	status: OrderStatus;
	orderedOn: FieldValue;
	dueOn: FieldValue | null;
	createdOn: FieldValue;
	updatedOn: FieldValue;
}
export interface OrderBuild {
	product: string;
	customer: string;
	organization: string;
	quantity: number;
	quantityAvailable: number;
	status: OrderStatus;
	orderedOn: string;
	dueOn: string | null;
}
export interface Order extends OrderBuild {
	id: string;
	createdOn: string;
	updatedOn: string;
}

type DBModel = DBOrder;
type Build = OrderBuild;
type Model = Order;
const converter: FirestoreDataConverter<Model, DBModel> = {
	toFirestore: (model: Model): DBModel => {
		return {
			id: model.id,
			customer: model.customer,
			product: model.product,
			organization: doc(getFirestore(), "organizations", "REPLACEME").path,
			quantity: model.quantity,
			quantityAvailable: model.quantityAvailable,
			status: model.status,
			orderedOn: Timestamp.fromDate(new Date(model.orderedOn)),
			dueOn: model.dueOn ? Timestamp.fromDate(new Date(model.dueOn)) : null,
			createdOn: Timestamp.fromDate(new Date(model.createdOn)),
			updatedOn: serverTimestamp(),
		};
	},
	fromFirestore: (snapshot: any, options: any): Model => {
		const data = snapshot.data(options) as DBModel;
		return {
			id: data.id,
			customer: data.customer,
			product: data.product,
			organization: data.organization,
			quantity: data.quantity,
			quantityAvailable: data.quantityAvailable,
			status: data.status,
			orderedOn: (data.orderedOn as Timestamp).toDate().toLocaleDateString(),
			dueOn: data.dueOn ? (data.dueOn as Timestamp).toDate().toLocaleDateString() : null,
			createdOn: (data.createdOn as Timestamp).toDate().toLocaleDateString(),
			updatedOn: (data.updatedOn as Timestamp).toDate().toLocaleDateString(),
		};
	},
};
export class OrdersCollection extends BaseModel<Model, DBModel, Build> {
	name = "Order";
	collectionName = "orders";
	converter: FirestoreDataConverter<Model, DBModel> = converter;

	add = async (buildModel: Build): Promise<Model> => {
		const docRef = doc(this.collection);
		const model: Model = {
			...buildModel,
			id: docRef.id,
			createdOn: new Date().toLocaleDateString(),
			updatedOn: new Date().toLocaleDateString(),
		};
		await setDoc(docRef, model);
		return model;
	};
	get = async (id: string): Promise<Model> => {
		const docRef = doc(this.collection, id);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			return docSnap.data() as Model;
		} else {
			throw new Error("Order not found");
		}
	};
	getAll = async (): Promise<Model[]> => {
		const docRef = await getDocs(this.collection);
		return docRef.docs.map((doc) => doc.data()) as Model[];
	};
	delete = async (id: string): Promise<void> => {
		await deleteDoc(doc(this.collection, id));
	};
	update = async (model: Build & { id: string; createdOn: string }): Promise<Model> => {
		const docRef = doc(this.collection, model.id);
		const modelWithID: Model = {
			...model,
			id: docRef.id,
			updatedOn: new Date().toLocaleDateString(),
		};
		await setDoc(docRef, modelWithID);
		return modelWithID;
	};
	getDevices = async (id: string): Promise<Device[]> => {
		return new DevicesCollection(this.user).getByOrder(id);
	};
	getCases = async (id: string): Promise<Case[]> => {
		return new CasesCollection(this.user).getByOrder(id);
	};
	nextCase = async (id: string): Promise<Case> => {
		return await new CasesCollection(this.user).nextCase(id);
	};
}
