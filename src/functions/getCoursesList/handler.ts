import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { Dynamo } from '@libs/dynamodb';
import { middyfy } from '@libs/lambda';

import schema from './schema';

//This function Get the List of Courses from DB

const getCoursesList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  try {
    const params = {
      TableName: 'SEMSTable'
    }
    // Get All Data
    const data = await Dynamo.getList(params);
    const courses = [];
    data.Items.map(item => {
      //Filter course data
      if (item.coursetitle !== undefined) {
        const courseid = item.id;
        const coursename = item.coursetitle;
        const coursech = item.CH;

        //Push required data in array
        courses.push(
          {
            courseid,
            coursename,
            coursech
          }
        );
      }
    });

    return formatJSONResponse({
      message: "List of the courses", courses
    });
  } catch (error) {
    return formatJSONResponse({
      message: "Not Found"
    });
  }
}

export const main = middyfy(getCoursesList);
