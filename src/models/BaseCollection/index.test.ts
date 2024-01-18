import { BaseModel } from "./index";
import { User, getAuth } from "firebase/auth";

// import {initializeTestApp} from "@firebase/testing"
import "../../firebase-config"
// import firestoreConfig from "../../firebase.config.json"

// let user:User | null = null;
// beforeEach(async () => {
//     const app = initializeTestApp({
// 		projectId: firestoreConfig.projectId,
// 		auth: {
// 			uid: "testUser",
// 			email: "testEmail@email.com",
//             customClaims: {
//                 orgId: "testOrgId",
//                 role: "admin"
//             }
// 		},
// 	})
// })


describe.skip("BaseModel", () => {
    let userModel: BaseModel<any, any, any>;
    let user: User | null = null;

    beforeEach(() => {
        user = {
            getIdTokenResult: async () => {
                return {
                    claims: {
                        orgId: "testOrgId",
                    },
                };
            },
        } as unknown as User;
        console.log(getAuth().currentUser)
        user = getAuth().currentUser;
        userModel = new BaseModel(user);
    });

    it("should have the correct default values", () => {
        expect(userModel.name).toBe("BaseModel");
        expect(userModel.collectionName).toBe("bases");
        expect(userModel.orgId).toBe("testOrgId");
        expect(userModel.user).toBe(user);
    });

    it("should refresh the organization ID correctly", async () => {
        await userModel.refreshOrgId();
        expect(userModel.orgId).toBe("testOrgId");
    });

    it("should create a collection reference with the correct converter", () => {
        const collectionRef = userModel.collection;
        expect(collectionRef).toBeDefined();
        // Add your assertions for the collection reference here
    });
});


describe.skip("BaseModel", () => {
	let userModel: BaseModel<any, any, any>;
	let user: User | null = null;

	beforeEach(() => {
		user = {
			getIdTokenResult: async () => {
				return {
					claims: {
						orgId: "testOrgId",
					},
				};
			},
		} as unknown as User;
        user = getAuth().currentUser;
		userModel = new BaseModel(user);
	});

	it("should have the correct default values", () => {
		expect(userModel.name).toBe("BaseModel");
		expect(userModel.collectionName).toBe("bases");
		expect(userModel.orgId).toBe("testOrgId");
		expect(userModel.user).toBe(user);
	});

	it("should refresh the organization ID correctly", async () => {
		await userModel.refreshOrgId();
		expect(userModel.orgId).toBe("testOrgId");
	});

	it("should create a collection reference with the correct converter", () => {
		const collectionRef = userModel.collection;
		expect(collectionRef).toBeDefined();
		// Add your assertions for the collection reference here
	});
});
