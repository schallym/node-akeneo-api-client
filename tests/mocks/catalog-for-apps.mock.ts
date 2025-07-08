import { Catalog, MappingSchemaForProducts } from '../../src/types';

const catalogMock: Catalog = {
  id: '12351d98-200e-4bbc-aa19-7fdda1bd14f2',
  name: 'My app catalog',
  enabled: false,
  managed_currencies: ['EUR', 'USD', 'GBP'],
  managed_locales: ['fr_FR', 'en_US'],
};

const mappingSchemaForProductsMock: MappingSchemaForProducts = {
  $id: 'https://example.com/product',
  $schema: 'https://api.akeneo.com/mapping/product/1.0.0/schema',
  type: 'object',
  properties: {
    code: {
      title: 'Model ID',
      type: 'string',
    },
    brand: {
      title: 'Brand name',
      type: 'string',
    },
  },
};

export default {
  get: catalogMock,
  list: {
    _links: {
      self: { href: 'https://akeneo.test/api/rest/v1/catalogs?page=2' },
      first: { href: 'https://akeneo.test/api/rest/v1/catalogs' },
    },
    current_page: 2,
    _embedded: {
      items: [catalogMock],
    },
  },
  duplicate: catalogMock,
  catalogProducts: {
    uuids: {
      _links: {
        self: {
          href: 'http://demo.akeneo.com/api/rest/v1/catalogs/12351d98-200e-4bbc-aa19-7fdda1bd14f2/product-uuids',
        },
        first: {
          href: 'http://demo.akeneo.com/api/rest/v1/catalogs/12351d98-200e-4bbc-aa19-7fdda1bd14f2/product-uuids',
        },
        next: {
          href: 'http://demo.akeneo.com/api/rest/v1/catalogs/12351d98-200e-4bbc-aa19-7fdda1bd14f2/product-uuids?search_after=eddfbd2a-abc7-488d-b9e3-41289c824f80',
        },
      },
      _embedded: {
        items: [
          '844c736b-a19b-48a6-a354-6056044729f0',
          'b2a683ef-4a91-4ed3-b3fa-76dab065a8d5',
          'eddfbd2a-abc7-488d-b9e3-41289c824f80',
        ],
      },
    },
    products: {
      _links: {
        self: {
          href: 'https://demo.akeneo.com/api/rest/v1/catalogs/65f5a521-e65c-4d7b-8be8-1f267fa2729c/products?limit=3',
        },
        first: {
          href: 'https://demo.akeneo.com/api/rest/v1/catalogs/65f5a521-e65c-4d7b-8be8-1f267fa2729c/products?limit=3',
        },
        next: {
          href: 'https://demo.akeneo.com/api/rest/v1/catalogs/65f5a521-e65c-4d7b-8be8-1f267fa2729c/products?search_after=0059d30f-6874-4277-81ed-3b3657c83f5e&limit=3',
        },
      },
      _embedded: {
        items: [
          {
            uuid: '00073089-1310-4340-bcf0-9e33e4019b79',
            enabled: true,
            family: 'mens_clothing',
            categories: ['Cloths'],
            groups: [],
            parent: null,
            values: {
              Default_Price: [
                {
                  locale: null,
                  scope: null,
                  data: [
                    {
                      amount: '10.00',
                      currency: 'USD',
                    },
                  ],
                },
              ],
              sku: [
                {
                  locale: null,
                  scope: null,
                  data: 'product_416',
                },
              ],
              Name: [
                {
                  locale: null,
                  scope: null,
                  data: 'Product 416',
                },
              ],
              Weight: [
                {
                  locale: null,
                  scope: null,
                  data: {
                    amount: 10,
                    unit: 'KILOGRAM',
                  },
                },
              ],
            },
            created: '2022-03-14T15:25:45+00:00',
            updated: '2022-06-24T12:54:58+00:00',
            associations: {
              PACK: {
                products: [],
                product_models: [],
                groups: [],
              },
              UPSELL: {
                products: [],
                product_models: [],
                groups: [],
              },
              X_SELL: {
                products: [],
                product_models: [],
                groups: [],
              },
              SUBSTITUTION: {
                products: [],
                product_models: [],
                groups: [],
              },
            },
            quantified_associations: {},
          },
          {
            uuid: '00248acf-f1f7-45cb-b409-c8c4b9a17a86',
            enabled: true,
            family: 'mens_clothing',
            categories: ['Cloths'],
            groups: [],
            parent: null,
            values: {
              Default_Price: [
                {
                  locale: null,
                  scope: null,
                  data: [
                    {
                      amount: '10.00',
                      currency: 'USD',
                    },
                  ],
                },
              ],
              sku: [
                {
                  locale: null,
                  scope: null,
                  data: 'product_470',
                },
              ],
              Name: [
                {
                  locale: null,
                  scope: null,
                  data: 'Product 470',
                },
              ],
              Weight: [
                {
                  locale: null,
                  scope: null,
                  data: {
                    amount: 10,
                    unit: 'KILOGRAM',
                  },
                },
              ],
            },
            created: '2022-03-14T15:25:45+00:00',
            updated: '2022-06-24T12:55:01+00:00',
            associations: {
              PACK: {
                products: [],
                product_models: [],
                groups: [],
              },
              UPSELL: {
                products: [],
                product_models: [],
                groups: [],
              },
              X_SELL: {
                products: [],
                product_models: [],
                groups: [],
              },
              SUBSTITUTION: {
                products: [],
                product_models: [],
                groups: [],
              },
            },
            quantified_associations: {},
          },
        ],
      },
    },
    product: {
      uuid: 'a5eed606-4f98-4d8c-b926-5b59f8fb0ee7',
      family: 'tshirt',
      groups: [],
      parent: null,
      categories: [],
      enabled: true,
      values: {
        name: [
          {
            data: 'Top',
            locale: 'en_US',
            scope: null,
          },
        ],
      },
    },
    mappedProducts: {
      _links: {
        self: {
          href: 'https://demo.akeneo.com/api/rest/v1/catalogs/d259aecf-3ec1-4b07-ae0f-ce234b86c025/mapped-products?limit=100',
        },
        first: {
          href: 'https://demo.akeneo.com/api/rest/v1/catalogs/d259aecf-3ec1-4b07-ae0f-ce234b86c025/mapped-products?limit=100',
        },
      },
      _embedded: {
        items: [
          {
            uuid: '04f47a54-8cc9-4c51-90e9-eb9aace0865f',
            title: 'Canon Video Visualiser RE-455X',
            code: 'sku-1234',
          },
          {
            uuid: '06dc8c5b-9e2f-4423-b9dd-31a3aaa0a048',
            title: 'Trust Cuby Pro',
            code: 'sku-1235',
          },
          {
            uuid: '0c3635f9-fedc-4bbd-96ab-856f69746b56',
            title: 'Trust Urban Revolt',
            code: 'sku-1236',
          },
          {
            uuid: '0e957ed4-fa44-48de-b6c7-7149d890fb3a',
            title: 'Microsoft LifeCam Studio',
            code: 'sku-1237',
          },
        ],
      },
    },
    mappedModels: {
      _links: {
        first: {
          href: 'https://demo.akeneo.com/api/rest/v1/catalogs/232be0b2-093c-4591-a506-2a2ed5176721/mapped-models?limit=3',
        },
        next: {
          href: 'https://demo.akeneo.com/api/rest/v1/catalogs/232be0b2-093c-4591-a506-2a2ed5176721/mapped-models?search_after=apollon&limit=3',
        },
        self: {
          href: 'https://demo.akeneo.com/api/rest/v1/catalogs/232be0b2-093c-4591-a506-2a2ed5176721/mapped-models?limit=3',
        },
      },
      _embedded: {
        items: [
          {
            code: 'tshirt_akeneo',
            title: 'Beautiful t-shirt with Akeneo logo',
            variants:
              'https://demo.akeneo.com/api/rest/v1/catalogs/232be0b2-093c-4591-a506-2a2ed5176721/mapped-models/tshirt_akeneo/variants',
            variation_axes: [
              {
                code: 'color',
                label: [
                  {
                    locale: 'en_US',
                    value: 'Color',
                  },
                  {
                    locale: 'fr_FR',
                    value: 'Couleur',
                  },
                ],
              },
              {
                code: 'size',
                label: [
                  {
                    locale: 'en_US',
                    value: 'Size',
                  },
                  {
                    locale: 'fr_FR',
                    value: 'Taille',
                  },
                ],
              },
            ],
          },
          {
            code: 'tshirt_pim',
            title: 'Beautiful t-shirt with PIM logo',
            variants:
              'https://demo.akeneo.com/api/rest/v1/catalogs/232be0b2-093c-4591-a506-2a2ed5176721/mapped-models/tshirt_pim/variants',
            variation_axes: [
              {
                code: 'color',
                label: [
                  {
                    locale: 'en_US',
                    value: 'Color',
                  },
                  {
                    locale: 'fr_FR',
                    value: 'Couleur',
                  },
                ],
              },
              {
                code: 'size',
                label: [
                  {
                    locale: 'en_US',
                    value: 'Size',
                  },
                  {
                    locale: 'fr_FR',
                    value: 'Taille',
                  },
                ],
              },
            ],
          },
        ],
      },
    },
    mappedModel: {
      variants: {
        _links: {
          first: {
            href: 'https://demo.akeneo.com/api/rest/v1/catalogs/232be0b2-093c-4591-a506-2a2ed5176721/mapped-models/tshirt_akeneo/variants?limit=100',
          },
          self: {
            href: 'https://demo.akeneo.com/api/rest/v1/catalogs/232be0b2-093c-4591-a506-2a2ed5176721/mapped-models/tshirt_akeneo/variants?limit=100',
          },
        },
        _embedded: {
          items: [
            {
              is_published: true,
              sku: 'AK10BLXL',
              uuid: '6b025a71-537f-48d4-aa26-a6617d6199e9',
              variant_axes_values: [
                {
                  code: 'color',
                  label: [
                    {
                      locale: 'en_US',
                      value: 'Blue',
                    },
                    {
                      locale: 'fr_FR',
                      value: 'Bleu',
                    },
                  ],
                  value: 'blue',
                },
                {
                  code: 'size',
                  label: [
                    {
                      locale: 'en_US',
                      value: 'XL',
                    },
                    {
                      locale: 'fr_FR',
                      value: 'XL',
                    },
                  ],
                  value: 'xl',
                },
              ],
            },
            {
              is_published: true,
              sku: 'AK10YEXL',
              uuid: '6b025a71-537f-48d4-aa26-a6617d6199e9',
              variant_axes_values: [
                {
                  code: 'color',
                  label: [
                    {
                      locale: 'en_US',
                      value: 'Yellow',
                    },
                    {
                      locale: 'fr_FR',
                      value: 'Jaune',
                    },
                  ],
                  value: 'yellow',
                },
                {
                  code: 'size',
                  label: [
                    {
                      locale: 'en_US',
                      value: 'XL',
                    },
                    {
                      locale: 'fr_FR',
                      value: 'XL',
                    },
                  ],
                  value: 'xl',
                },
              ],
            },
          ],
        },
      },
    },
  },
  mappingSchemas: {
    product: {
      get: mappingSchemaForProductsMock,
    },
  },
};
