import {
	getDocs,
	where,
	query,
	setDoc,
	addDoc,
	deleteDoc,
	doc,
	FirestoreDataConverter,
	FieldValue,
	serverTimestamp,
	Timestamp,
} from "firebase/firestore";
import { DevicesCollection } from "../Devices";
import { BaseModel } from "../BaseCollection";
export enum OrderStatus {
	Queued = "Queued",
	Active = "Active",
	Completed = "Completed",
	Cancelled = "Cancelled",
}
export interface DBCase {
	id: string;
	orderId: string;
	count: number;
	customId: string;
	createdOn: FieldValue;
	updatedOn: FieldValue;
}
export interface CaseBuild {
	orderId: string;
	count: number;
	customId: string;
}
export interface Case extends CaseBuild {
	id: string;
	createdOn: string;
	updatedOn: string;
}

type Build = CaseBuild;
type Model = Case;
type DBModel = DBCase;
export class CasesCollection extends BaseModel<Model, DBModel, Build> {
	name: string = "Case";
	collectionName = "cases";
	converter: FirestoreDataConverter<Model, DBModel> = {
		toFirestore: (model: Model): DBModel => {
			return {
				id: model.id,
				orderId: model.orderId,
				count: model.count,
				customId: model.customId,
				createdOn: Timestamp.fromDate(new Date(model.createdOn)),
				updatedOn: serverTimestamp(),
			};
		},
		fromFirestore: (snapshot: any, options: any): Model => {
			const data = snapshot.data(options) as DBModel;
			return {
				id: data.id,
				orderId: data.orderId,
				count: data.count,
				customId: data.customId,
				createdOn: (data.createdOn as Timestamp).toDate().toLocaleDateString(),
				updatedOn: (data.updatedOn as Timestamp).toDate().toLocaleDateString(),
			};
		},
	};
	add = async (buildModel: Build): Promise<Model> => {
		const docRef = doc(this.collection);
		const productWithID: Model = {
			...buildModel,
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
	get = async (id: string): Promise<Model> => {
		const docRef = await getDocs(query(this.collection, where("id", "==", id)));
		if (docRef.docs.length === 0) {
			throw new Error(`${this.name} not found`);
		}
		return docRef.docs[0].data();
	};
	getAll = async (): Promise<Model[]> => {
		const docRef = await getDocs(this.collection);
		return docRef.docs.map((doc) => doc.data());
	};
	getByOrder = async (orderId: string): Promise<Model[]> => {
		const docRef = await getDocs(query(this.collection, where("orderId", "==", orderId)));
		return docRef.docs.map((doc) => doc.data());
	};

	update = async (model: Model): Promise<Model> => {
		await setDoc(doc(this.collection, model.id), model);
		return model;
	};
	genCaseID = (): string => {
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, "0");
		const day = String(now.getDate()).padStart(2, "0");
		return `${year}${month}${day}001`;
	};
	nextCase = async (orderId: string): Promise<Model> => {
		const standardId = this.genCaseID();
		const docRef = await getDocs(query(this.collection, where("order", "==", orderId)));
		if (docRef.docs.length === 0) {
			const model = await this.add({ orderId: orderId, count: 0, customId: standardId });
			return model;
		} else {
			// Find the highest case number, based off of the customId
			const cases = docRef.docs.map((doc) => doc.data());
			const highestCase = cases.reduce((prev, current) => {
				return prev.customId > current.customId ? prev : current;
			});
			const highestCaseId = parseInt(highestCase.customId);
			if (parseInt(standardId) > highestCaseId) {
				const model = await this.add({ orderId: orderId, count: 0, customId: standardId });
				return model;
			} else {
				const model = await this.add({ orderId: orderId, count: 0, customId: String(highestCaseId + 1) });
				return model;
			}
		}
	};
	resyncCaseCount = async (model: Model): Promise<Model> => {
		const q = query(new DevicesCollection(this.user).collection, where("caseId", "==", model.customId));
		const devices = await getDocs(q);
		const count = devices.docs.length;
		model.count = count;
		await this.update(model);
		return model;
	};
}
