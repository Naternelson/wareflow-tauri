import { initializeTestApp } from "@firebase/testing"
import firestoreConfig from "../../firebase.config.json"
beforeAll(()=>{
    initializeTestApp({projectId: firestoreConfig.projectId})
})

describe("CasesCollection", () => {
    it("should create a new case", async () => {
        // Add your test code here
    });
});