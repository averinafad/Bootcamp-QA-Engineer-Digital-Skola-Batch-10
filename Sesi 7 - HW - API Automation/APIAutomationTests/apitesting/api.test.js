import fetch from "node-fetch"
import { expect } from "chai";
import Ajv from "ajv";
import schema_getngambildatauser from "../schema/get.schema.js";
import schema_postbikinuserbaru from "../schema/post.schema.js";
import schema_putupdatedatauser from "../schema/put.schema.js";

describe("API Test Suite", function () {
    const baseURL = `https://reqres.in`;

    it("GET Single User", async function () {
        //Start timer
        const startTime = Date.now();
        //Fetch API
        const responseGet = await fetch(`${baseURL}/api/users/2`);
        //End timer
        const endTime = Date.now();
        const responseTimeGet = endTime - startTime;
        console.log(`Response Time: ${responseTimeGet}ms`);

        //Validasi status code, http statusnya harus 200
        expect(responseGet.status, "ada yang salah nih dari method GET").to.equal(200)

        //Validasi response time < 500ms
        expect(responseTimeGet, "Response time lebih dari 500ms").to.be.lessThan(500);

        // Parse response body
        const dataGet = await responseGet.json();
        //Tambahkan validasi data ID
        expect(dataGet.data.id, "User ID tidak sesuai").to.equal(2);

        //Validasi JSON Schema
        const ajvGet = new Ajv()
        // const dataGet = await responseGet.json();
        const cekcekGet = ajvGet.compile(schema_getngambildatauser)
        const hasil_schemaGet = cekcekGet(dataGet)
        expect(hasil_schemaGet, `schema is not valid from method GET`).to.be.true
    });

    it("POST Create User", async function () {
        //Start timer
        const startTime = Date.now();
        //Fetch API
        const newPost = {
            "name": "morpheus",
            "job": "leader"
        }
        const responsePost = await fetch(`${baseURL}/api/users`, {
            method: "POST",
            headers: {
                "x-api-key": "reqres-free-v1",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newPost)
        })
        //End timer
        const endTime = Date.now();
        const responseTimePost = endTime - startTime;
        console.log(`Response Time: ${responseTimePost}ms`);

        //Validasi status code, http statusnya harus 201
        // expect(responsePost.status, "ada yang salah nih dari method POST").to.equal(200)
        expect(responsePost.status, "Status code tidak sesuai").to.be.oneOf([201, 202]);

        //Validasi response time < 500ms
        expect(responseTimePost, "Response time lebih dari 500ms").to.be.lessThan(500);

        // Parse response body
        const dataPost = await responsePost.json();
        //Tambahkan validasi data ID
        expect(dataPost.job, "Job tidak sesuai").to.equal("leader");

        //Validasi JSON Schema
        const ajvPost = new Ajv()
        // const dataPost = await responsePost.json();
        const cekcekPost = ajvPost.compile(schema_postbikinuserbaru)
        const hasil_schemaPost = cekcekPost(dataPost)
        expect(hasil_schemaPost, `schema is not valid from method Post`).to.be.true
    });

    it("PUT Update Info User", async function () {
        //Start timer
        const startTime = Date.now();
        //Fetch API
        const newPut = {
            "name": "morpheus",
            "job": "zion resident"
        }
        const responsePut = await fetch(`${baseURL}/api/users/2`, {
            method: "PUT",
            headers: {
                "x-api-key": "reqres-free-v1",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newPut)
        })
        //End timer
        const endTime = Date.now();
        const responseTimePut = endTime - startTime;
        console.log(`Response Time: ${responseTimePut}ms`);

        //Validasi status code, http statusnya harus 200
        expect(responsePut.status, "ada yang salah nih dari method Put").to.equal(200)

        //Validasi response time < 500ms
        expect(responseTimePut, "Response time lebih dari 500ms").to.be.lessThan(500);

        // Parse response body
        const dataPut = await responsePut.json();
        //Tambahkan validasi data ID
        expect(dataPut.job, "Job tidak sesuai").to.equal("zion resident");

        //validasi json schema
        const ajvPut = new Ajv()
        // const dataPut = await responsePut.json();
        const cekcekPut = ajvPut.compile(schema_putupdatedatauser)
        const hasil_schemaPut = cekcekPut(dataPut)
        expect(hasil_schemaPut, `schema is not valid from method PUT`).to.be.true
    })

    it("DELETE Delete Info User", async function () {
        //Start timer
        const startTime = Date.now();
        //Fetch API
        const responseDelete = await fetch(`${baseURL}/api/users/2`, {
            method: "DELETE",
            headers: {
                "x-api-key": "reqres-free-v1",
                "Content-Type": "application/json"
            },
        })
        //End timer
        const endTime = Date.now();
        const responseTimeDelete = endTime - startTime;
        console.log(`Response Time: ${responseTimeDelete}ms`);

        //validasi http statusnya harus 204
        expect(responseDelete.status, "ada yang salah nih dari method DELETE").to.equal(204)

        //Validasi response time < 500ms
        expect(responseTimeDelete, "Response time lebih dari 500ms").to.be.lessThan(500);
    })
});