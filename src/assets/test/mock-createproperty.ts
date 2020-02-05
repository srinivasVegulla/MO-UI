export const CreatePropertyData = {
    categoryNames: ['Category-Int', 'category-test1', 'category-test3', 'shared Category11', 'Categorytest17'],
    specTypes: { 0: 'String', 1: 'Integer', 2: 'Decimal', 3: 'List', 4: 'Boolean', 5: 'DateTime' },
    sampleValues: { values: { slice: () => { return { 0: { value: '' } }; } } },
    specDefTypes: { specType: 0, values: { 0: { value: '' } } },
    updateProperty: { specType: '0', values: '0',  value: '03/15/2018',
    minValue: '03/15/2018', maxValue: '03/15/2018',  list: '1 /n 2' },
    processSubscription: { category: 'Sample Category', specId: 1, entityCount: 1, list: '1 /n 2', userVisible: true,
    values: [{valueId: 1, scvId: 1} ]}
};
