export default {
  type: "object",
  properties: {
    courseid: { type: 'string' },
    studentid: { type: 'string' },
    dateofassigment: { type: 'N' }
  },
  required: ['courseid', 'studentid', 'dateofassigment']
} as const;
