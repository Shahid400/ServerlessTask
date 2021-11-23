export default {
  type: "object",
  properties: {
    coursecode: { type: 'string' },
    coursetitle: { type: 'string' },
    CH: { type: 'N' }
  },
  required: ['coursecode', 'coursetitle', 'CH']
} as const;
