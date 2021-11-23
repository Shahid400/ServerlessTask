export default {
  type: "object",
  properties: {
    courseid: { type: 'string' },
    studentid: { type: 'string' },
    dateofassignment: { type: 'string' }
  },
  required: ['courseid', 'studentid', 'dateofassignment']
} as const;
