import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { Dynamo } from '@libs/dynamodb';
import { middyfy } from '@libs/lambda';

import schema from './schema';

//This function Delete Student from DB

const deleteStudent: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const { id } = event.pathParameters;
    const params = {
      TableName: 'SEMSTable',
      Key: {
        id
      }
    }
    //Check if Student Exists in DB or not
    const data = await Dynamo.getData(params);
    if (data.Item.id === id) {
      //Delete Student
      const msg = await Dynamo.deleteData(params);
      return formatJSONResponse({
        message: `Student ${msg}`
      });
    }
  } catch (error) {
    return formatJSONResponse({
      message: "student not found"
    });
  }
}

export const main = middyfy(deleteStudent);
