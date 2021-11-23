import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { Dynamo } from '@libs/dynamodb';

//This function Get Student by id

const getOneStudent: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const { id } = event.pathParameters;
    const params = {
      TableName: 'SEMSTable',
      Key: {
        id
      },
    }
    //Get Student by id
    const data = await Dynamo.getData(params);
    const student = {
      name: data.Item.name,
      email: data.Item.email,
      age: data.Item.age,
      dob: data.Item.dob
    };
    if (data.Item) {
      const msg = "Student Found";
      return formatJSONResponse({
        message: msg, student
      });
    }
  } catch (error) {
    return formatJSONResponse({
      message: "Wrong ID"
    });
  }
}

export const main = middyfy(getOneStudent);
