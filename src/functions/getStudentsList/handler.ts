import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { Dynamo } from '@libs/dynamodb';
import { middyfy } from '@libs/lambda';

import schema from './schema';

//This function Get the List of Students from DB

const getStudentsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  try {
    const params = {
      TableName: 'SEMSTable'
    }
    //Get All Data
    const data = await Dynamo.getList(params);
    const students = [];
    data.Items.map(item => {
      //Filter Student Data
      if (item.name !== undefined) {
        const name = item.name;
        const email = item.email;
        const age = item.age;
        const dob = item.dob;

        //Push required data in array
        students.push(
          {
            name,
            email,
            age,
            dob
          }
        );
      }
    });

    return formatJSONResponse({
      message: "List of the students", students
    });
  } catch (error) {
    return formatJSONResponse({
      message: "Data not found in DB"
    });
  }
}

export const main = middyfy(getStudentsList);
