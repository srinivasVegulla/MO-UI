export const scheduleInfo = {
    schedule: {
        ptId: 1, ptName: 'samplept', schedId: 20159, startDate: '02/28/2018', paramtableId: 1, ruleCount: 8,
        startDateType: 'NOT_SET', endDateType: 'NOT_SET', rulesCount: 2, pricelistId: 986, itemTemplateId: 989,
        name: null, displayName: null, startDateOffset: 0, endDate: null, endDateOffset: 0, ratesTables: []
    },
    metaData: {
        0: {
            'enumData': [{ 0: { name: 'English', enumDataId: 1 } },
            { 1: { name: 'Some', enumDataId: 2 } }]
        }
    }, pricelist: { name: 'RC' },
    login: { user: 'admin' },
    rateChangeItems: {
        0: {
            revisedItems: { 0: { originalItem: 'item1', type: 'Added' } },
            originalItems: { 0: { type: 'Removed' } }, type: 'Removed'
        }
    },
    types: [{ type: 'Added' }, { type: 'Changed' }, { type: 'Removed' }],
    conditions: { conditions: [{ 0: { displayName: 'RC', name: 'RC' } }], actions: [] },
    ruleChangeData: {
        order: 0, change: [{ enumData: {} }, {}, { change: { _opParameterTableMetadata: '', columnoperator: '' } }],
        col: { field: 'change|RC' }, index: { 0: { change: 'change', dataType: 'char' } }
    }
};
