export default {
  name: 'filters',
  title: 'Filters',
  type: 'document',
  fields: [
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{type: 'string'}],
    },
    {
      name: 'materials',
      title: 'Materials',
      type: 'array',
      of: [{type: 'string'}],
    },
    {
      name: 'priceRanges',
      title: 'Price Ranges',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Label',
              type: 'string',
            },
            {
              name: 'min',
              title: 'Min',
              type: 'number',
            },
            {
              name: 'max',
              title: 'Max',
              type: 'number',
            },
          ],
        },
      ],
    },
  ],
}
