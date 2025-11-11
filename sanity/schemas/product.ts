export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'id',
      title: 'ID',
      type: 'string',
    },
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'detailedDescription',
      title: 'Detailed Description',
      type: 'text',
    },
    {
      name: 'negotiable',
      title: 'Negotiable',
      type: 'boolean',
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
    },
    {
      name: 'salePrice',
      title: 'Sale Price',
      type: 'number',
    },
    {
      name: 'sku',
      title: 'SKU',
      type: 'string',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'array',
      of: [{type: 'string'}],
    },
    {
      name: 'subCategory',
      title: 'Sub-Category',
      type: 'string',
    },
    {
      name: 'material',
      title: 'Material',
      type: 'string',
    },
    {
      name: 'rating',
      title: 'Rating',
      type: 'number',
    },
    {
      name: 'reviewCount',
      title: 'Review Count',
      type: 'number',
    },
    {
      name: 'stock',
      title: 'Stock',
      type: 'number',
    },
    {
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{type: 'image'}],
    },
    {
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
    },
    {
      name: 'specs',
      title: 'Specs',
      type: 'object',
      fields: [
        {
          name: 'meshSize',
          title: 'Mesh Size',
          type: 'string',
        },
        {
          name: 'iodineNumber',
          title: 'Iodine Number',
          type: 'string',
        },
        {
          name: 'bulkDensity',
          title: 'Bulk Density',
          type: 'string',
        },
        {
          name: 'applications',
          title: 'Applications',
          type: 'array',
          of: [{type: 'string'}],
        },
      ],
    },
    {
      name: 'documents',
      title: 'Documents',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Name',
              type: 'string',
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
            },
          ],
        },
      ],
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    },
  ],
}
