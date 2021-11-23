const AWS = require('aws-sdk')

const documentClient = new AWS.DynamoDB.DocumentClient({
    //Local DB
    region: "localhost",
    endpoint: "http://localhost:8000",
});

export const Dynamo = {

    //Save Data in DB
    async createData(params) {
        await documentClient.put(params).promise();
        const msg = "Created";
        return msg;
    },

    //Get Data from DB
    async getData(params) {
        const data = await documentClient.get(params).promise();
        return data;
    },

    //Get All Data from DB
    async getList(params) {
        const list = await documentClient.scan(params).promise();
        return list;
    },

    //Delete Data by id from DB
    async deleteData(params) {
        await documentClient.delete(params).promise();
        const msg = "deleted";
        return msg;
    },

    //Update Data by id in DB
    async updateData(params) {
        await documentClient.update(params).promise();
        const msg = "updated";
        return msg;
    },

}