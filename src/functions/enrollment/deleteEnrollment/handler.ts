import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { Dynamo } from '@libs/dynamodb';
import { middyfy } from '@libs/lambda';

import schema from './schema';

//This function Delete Enrollment from DB

const deleteEnrollment: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const { id } = event.pathParameters;
    const params = {
      TableName: 'SEMSTable',
      Key: {
        id
      }
    }
    //Check if Enrollment Exists in DB or not
    const data = await Dynamo.getData(params);
    if (data.Item.id === id) {
      //Delete Enrollment
      const msg = await Dynamo.deleteData(params);
      return formatJSONResponse({
        message: `Enrollment ${msg}`
      });
    }
  } catch (error) {
    return formatJSONResponse({
      message: "enrollment not found"
    });
  }
}

export const main = middyfy(deleteEnrollment);
