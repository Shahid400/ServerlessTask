import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { Dynamo } from '@libs/dynamodb';
import { middyfy } from '@libs/lambda';
import { v4 } from 'uuid';

import schema from './schema';

//This function adds new Student in DB

const createStudent: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    var id = v4();
    const TableName = 'SEMSTable';
    const name = event.body.name;
    const email = event.body.email;
    const age = event.body.age;
    const dob = event.body.dob;
    const params = {
      TableName,
      Item: {
        id,
        name,
        email,
        age,
        dob
      }
    };
    const params1 = {
      TableName: "SEMSTable",
      FilterExpression: 'email = :tag',
      ExpressionAttributeValues: { ':tag': email }
    };

    // Check if Student already exists or not
    const data = await Dynamo.getList(params1);
    if (data.Count === 0) {
      //Add new Student
      const msg = await Dynamo.createData(params);
      return formatJSONResponse({
        message: `New Student ${msg}`
      });
    } else {
      return formatJSONResponse({
        message: "Student already exist"
      });
    }
  } catch (error) {
    return formatJSONResponse({
      message: "Please sent the right body again"
    });
  }

}

export const main = middyfy(createStudent);
