import { User } from "firebase/auth";
import {
	CollectionReference,
	DocumentData,
	FirestoreDataConverter,
	collection,
	getFirestore,
} from "firebase/firestore";

/**
 * The base class for creating data models that interact with Firestore using Firebase.
 * @typeparam Model - The type of the data model.
 * @typeparam DBModel - The type of the Firestore document.
 * @typeparam BuildModel - The type for building the data model.
 */
export class BaseModel<Model extends BuildModel, DBModel extends DocumentData, BuildModel> {
	// Name of the model class, can be overridden in subclasses.
	name: string = "BaseModel";

	// The default collection name, can be overridden in subclasses.
	collectionName = "bases";

	// Firestore data converter for handling model-to-database and database-to-model conversion.
	converter: FirestoreDataConverter<Model, DBModel> = {
		toFirestore: (model: Model): DBModel => model as unknown as DBModel,
		fromFirestore: (snapshot: any, options: any): Model => {
			const data = snapshot.data(options) as DBModel;
			return data as unknown as Model;
		},
	};

	// Collection reference for the Firestore collection associated with this model.
	get collection(): CollectionReference<Model, DBModel> {
		return collection(getFirestore(), "organizations", this.orgId, this.collectionName).withConverter(this.converter);
	}

	// Organization ID, typically derived from the user's token claims.
	orgId: string = "";

	// Reference to the authenticated user or null if not authenticated.
	user: User | null = null;

	/**
	 * Refreshes the organization ID based on the user's ID token claims.
	 * @async
	 */
	refreshOrgId = async () => {
		if (this.user) {
			const token = await this.user.getIdTokenResult();
			this.orgId = (token.claims["orgId"] || "") as string;
		} else {
			this.orgId = "";
		}
	};

	/**
	 * Creates a new instance of the BaseModel class.
	 * @param user - The authenticated user or null if not authenticated.
	 */
	constructor(user: User | null) {
		this.user = user;
		this.refreshOrgId();
	}
}
