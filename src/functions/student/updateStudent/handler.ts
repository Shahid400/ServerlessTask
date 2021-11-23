import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { Dynamo } from '@libs/dynamodb';
import { middyfy } from '@libs/lambda';

import schema from './schema';

//This function Updates Student in DB

const updateStudent: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const { id } = event.pathParameters;
    const name = event.body.name;
    const email = event.body.email;
    const age = event.body.age;
    const dob = event.body.dob;
    const params = {
      TableName: 'SEMSTable',
      Key: {
        id
      },
      UpdateExpression: "set #n = :n, #e = :e, #a = :a, #d = :d",
      ExpressionAttributeNames: {
        '#n': 'name',
        '#e': 'email',
        '#a': 'age',
        '#d': 'dob'
      },
      ExpressionAttributeValues: {
        ":n": name,
        ":e": email,
        ":a": age,
        ":d": dob,
      },
    }
    const params1 = {
      TableName: 'SEMSTable',
      Key: {
        id
      }
    }
    // Check Student Exists in DB or not
    const data = await Dynamo.getData(params1);
    if (data.Item.id === id) {
      // Check the new Data matches the existing Data in DB or not
      if (data.Item.name === name && data.Item.email === email && data.Item.age === age && data.Item.dob === dob) {
        return formatJSONResponse({
          message: "Student already exits"
        })
      } else {
        const msg = await Dynamo.updateData(params);
        return formatJSONResponse({
          message: `Student ${msg}`
        });
      }
    }
  } catch (error) {
    return formatJSONResponse({
      message: "Student not found"
    });
  }
}

export const main = middyfy(updateStudent);
