export default {
  type: "object",
  properties: {
    name: { type: 'string' },
    email: { type: 'string' },
    age: { type: 'N' },
    dob: { type: 'string' }
  },
  required: ['name', 'email', 'age', 'dob']
} as const;
