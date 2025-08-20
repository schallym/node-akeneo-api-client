export default {
  get: {
    uuid: '6f37476a-04c2-46c0-b6d0-e18316959068',
    code: 'enrichment_workflow',
    labels: {
      en_US: 'Enrichment workflow',
      fr_FR: "Workflow d'enrichissement",
    },
    enabled: true,
    steps: [
      {
        uuid: 'f626d0e5-84a5-41fc-8215-65508c253edb',
        code: 'marketing_enrichment',
        type: 'enrichment',
        labels: {
          en_US: 'Marketing enrichment',
          fr_FR: 'Enrichissement marketing',
        },
        descriptions: {
          en_US: 'Enrich marketing attributes',
        },
        allotted_time: {
          value: 3,
          unit: 'days',
        },
        channels_and_locales: {
          ecommerce: ['en_US'],
          mobile: ['en_US', 'fr_FR'],
        },
      },
      {
        uuid: 'b2c1f3d4-5e6a-4c8b-9f0e-2d3e4f5a6b7c',
        code: 'marketing_review',
        type: 'review',
        labels: {},
        descriptions: {},
        allotted_time: null,
        channels_and_locales: {
          ecommerce: ['en_US'],
        },
      },
    ],
  },
  listStepsAssignees: {
    _links: {
      self: {
        href: 'https://demo.akeneo.com/api/rest/v1/workflows/steps/f626d0e5-84a5-41fc-8215-65508c253edb/assignees?page=1&limit=10',
      },
      first: {
        href: 'https://demo.akeneo.com/api/rest/v1/workflows/steps/f626d0e5-84a5-41fc-8215-65508c253edb/assignees?page=1&limit=10',
      },
      next: {
        href: 'https://demo.akeneo.com/api/rest/v1/workflows/steps/f626d0e5-84a5-41fc-8215-65508c253edb/assignees?page=2&limit=10',
      },
    },
    current_page: 1,
    _embedded: {
      items: [
        {
          uuid: '25566245-55c3-42ce-86d9-8610ac459fa8',
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
        },
        {
          uuid: 'be6354b0-4545-4aaa-882d-aa14be68642c',
          first_name: 'Julia',
          last_name: 'Stark',
          email: 'julia@example.com',
        },
      ],
    },
  },
  listTasks: {
    _links: {
      self: {
        href: 'https://demo.akeneo.com/api/rest/v1/workflows/tasks?page=1&limit=10&step_uuid=f626d0e5-84a5-41fc-8215-65508c253edb',
      },
      first: {
        href: 'https://demo.akeneo.com/api/rest/v1/workflows/tasks?page=1&limit=10&step_uuid=f626d0e5-84a5-41fc-8215-65508c253edb',
      },
      next: {
        href: 'https://demo.akeneo.com/api/rest/v1/workflows/tasks?page=2&limit=10&step_uuid=f626d0e5-84a5-41fc-8215-65508c253edb',
      },
    },
    current_page: 1,
    _embedded: {
      items: [
        {
          uuid: '8f6c2d18-fbd4-4f7e-81df-cb3dc368fe07',
          status: 'in_progress',
          created_at: '2024-02-22T17:31:00Z',
          product: {
            uuid: '7108ee60-a1ea-4fe1-baca-b39909e23d24',
          },
          due_date: '2024-03-31T18:00:00Z',
          rejected: true,
        },
        {
          uuid: '782dd26a-b58d-40d3-a8e2-c41bb342f20f',
          status: 'in_progress',
          created_at: '2024-02-22T17:31:00Z',
          product_model: {
            code: 'a-product-model-code',
          },
          due_date: '2024-03-28T18:00:00Z',
          rejected: false,
        },
      ],
    },
  },
  completeTask: {
    status: 'completed',
  },
};
