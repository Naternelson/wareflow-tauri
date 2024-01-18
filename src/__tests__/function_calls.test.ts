import { initializeTestApp } from "@firebase/testing"
import firestoreConfig from "../firebase.config.json"

describe("createOrganizationWithUser Call", () => {
	test("should create an organization with a user", async () => {
		const db = initializeTestApp(firestoreConfig);
		expect(db).toBeDefined();
		db.functions().useFunctionsEmulator("http://localhost:5001");
		const fn = db.functions().httpsCallable("createOrganizationWithUser");
		const data: {
			email: string;
			password: string;
			passwordConfirm: string;
			displayName: string;
			firstName: string;
			lastName: string;
			phoneNumber: string;
			orgName: string;
		} = {
			email: "test@example.com",
			password: "password",
			passwordConfirm: "password",
			displayName: "Test User",
			firstName: "John",
			lastName: "Doe",
			phoneNumber: "1234567890",
			orgName: "Test Organization",
		};

		try {
			expect(fn(data)).resolves.toBeDefined();
			await fn(data);
		} catch (err) {
			console.log(err);
			expect(err).toBeUndefined();
		}
	});
});
