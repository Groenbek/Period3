const expect = require("chai").expect;
import app from "./whattodo";
const request = require("supertest")(app);
import nock from "nock";

describe("What to do endpoint", function () {
    before(() => {
        nock('https://www.boredapi.com/')
            .get('/api/activity')
            .reply(200, { "activity": "drink a single beer", "type": "education", "participants": 1, "price": 0.1, "link": "", "key": "4704256", "accessibility": 0.2 })
    })
    it("Should eventually provide 'drink a single beer'", async function () {
        const response = await request.get("/whattodo")
        expect(response.body.activity).to.be.equal("drink a single beer");
    })
})

describe("name info endpoint", function () {
    before(() => {
        nock('https://api.genderize.io')
            .get('/?name=Jürgen')
            .reply(200, { "name": "Jürgen", "gender": "male", "probability": 0.99, "count": 23421 })
        nock('https://api.nationalize.io')
            .get('/?name=Michael')
            .reply(200, { "name": "Jürgen", "country": [{ "country_id": "DE", "probability": 0.08986482266532715 }, { "country_id": "AU", "probability": 0.05976757527083082 }, { "country_id": "NZ", "probability": 0.04666974820852911 }] })
        nock('https://api.agify.io')
            .get('/?name=Michael')
            .reply(200, { "name": "Jürgen", "age": 80, "count": 23421 })

    })
    it("Should eventually provide 'male, DE, 80'", async function () {
        const response = await request.get("/nameinfo/Jürgen")
        expect(response.body.gender).to.be.equal("male");
        expect(response.body.country).to.be.equal("DE");
        expect(response.body.age).to.be.equal(80);
    })
})