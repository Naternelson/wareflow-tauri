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
import { OrdersCollection } from "../Order";
import { CasesCollection } from "../Cases";
import { BaseModel } from "../BaseCollection";
export enum OrderStatus {
	Queued = "Queued",
	Active = "Active",
	Completed = "Completed",
	Cancelled = "Cancelled",
}
export interface DBDevice {
	id: string;
    deviceId: string;
	udi: string | null;
	order: string; 
    case: string; 
    orderId: string;
    caseId: string 
	createdOn: FieldValue;
	updatedOn: FieldValue;
}
export interface DeviceBuild {
	deviceId: string; 
    udi: string | null;
    orderId: string, 
    caseId: string
}
export interface Device extends DeviceBuild {
	id: string;
    case: string;
    order: string;
	createdOn: string;
	updatedOn: string;
}

type Build = DeviceBuild;
type Model = Device;
type DBModel = DBDevice;
export class DevicesCollection extends BaseModel<Model, DBModel, Build> {
	name: string = "Device";
	collectionName = "devices";
	converter: FirestoreDataConverter<Model, DBModel> = {
		toFirestore: (model: Model): DBModel => {
			return {
				id: model.id,
				deviceId: model.deviceId,
                udi: model.udi,
                orderId: model.orderId,
                caseId: model.caseId,
                order: model.order,
                case: model.case,
				createdOn: Timestamp.fromDate(new Date(model.createdOn)),
				updatedOn: serverTimestamp(),
			};
		},
		fromFirestore: (snapshot: any, options: any): Model => {
			const data = snapshot.data(options) as DBModel;
			return {
				id: data.id,
				deviceId: data.deviceId,
                udi: data.udi,
                orderId: data.orderId,
                caseId: data.caseId,
                order: data.order,
                case: data.case,
				createdOn: (data.createdOn as Timestamp).toDate().toLocaleDateString(),
				updatedOn: (data.updatedOn as Timestamp).toDate().toLocaleDateString(),
			};
		},
	};
	add = async (buildModel: Build): Promise<Model> => {
		const docRef = doc(this.collection);
		const model: Model = {
			...buildModel,
			id: docRef.id,
            order: doc(new OrdersCollection(this.user).collection, buildModel.orderId).path, 
            case: doc(new CasesCollection(this.user).collection, buildModel.caseId).path,
			createdOn: new Date().toLocaleDateString(),
			updatedOn: new Date().toLocaleDateString(),
		};
		await addDoc(this.collection, model);
		return model;
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
    getByCase = async (caseId: string): Promise<Model[]> => {
        const docRef = await getDocs(query(this.collection, where("caseId", "==", caseId)));
        return docRef.docs.map((doc) => doc.data());
    }

	update = async (model: Model): Promise<Model> => {
		await setDoc(doc(this.collection, model.id), model);
		return model;
	};
}

