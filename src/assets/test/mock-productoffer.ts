export const ProductOfferData = {
    productOffer: { nonsharedPlId: 1, offerId: 1, availableStartDate: '', bundleId: 1, itemInstanceId: 1 },
    cardController: { itemInstanceId: 1, templateId: 1, pIInstance: 'RC' },
    localization: {
        Offering: 'PO', localeFlagData: [{ langCode: 'en-us', description: 'English' }],
        tableQuery: [{ 'kind=in': '', property: 'Name' }],
        localizeMap: [{ propertyNameValueId: 1, propId: 1, localizationMap: { jp: true } }],
        localFunc: { onEditComplete: { emit: () => { } }, switchCellToViewMode: () => { }, target: '' }
    },
    billingInformation: { dayOfMonth: 31, recCycle: { child: { 0: { attr: 'dayOfMonth' } } } },
    oneTimeCharges: {
        unsubscription: true, onsubscription: null, displayName: 'Sample PI', description: 'Sample desc',
        '_value': { itemInstanceDisplayName: 'Sample PI', itemInstanceDescription: 'Sample desc' }
    },
    piDetails: {
        kind: 'UNIT_DEPENDENT_RECURRING', data: { isPitemplate: true, 'body': { kindType: 'DISCOUNT' } },
        piId: 1, addRemovePoPi: false
    },
    priceableItemAdj: {
        data: {
            piId: 1, isPIInstance: false, ItemTemplateId: 1, propId: 1, itemTypeId: 1,
            adjustmentTypeId: 1, deleteCheck: true, reasonCodes: [0], splice: (adjustmentIndex, index) => { },
            target: { checked: true }, srcElement: { checked: false }
        },
    },
    piTemplateForm: {
        '_value': {
            name: 'Sample Name', displayName: 'Sample Display Name', description: 'sample description',
            piId: 12, valueType: 1, eventType: 2
        },
        selectedPItemplate: { data: { templateId: 1, kind: 'RC', delete: true, PItemplateName: 'sample', 0: { code: 100 } } },
        error: [{ 0: { 'error': '' } }]
    },
    externdedProps: {
        extendedProperties: [], extendedProps: [], properties: [], values: { value: 1, dn: 0 },
        nativeElement: { autofocus: true }
    },
    permissions: {
        effDateId: 729, show: () => { }, hide: () => { },
        poPartitions: [{ accountId: 1, typeId: 1, lastname: null, firstname: null }], partitions: { 0: { accountId: 1 } }
    },
    recurringCharges: {
        RECURRING: { dataRC: { concat: (UDRC) => { } } }, UNIT_DEPENDENT_RECURRING: false
    },
    properties: {
        name: 'Sample Name', displayName: 'Sample Display Name', description: 'sample description',
        effStartDate: '06/30/2001', effEndDate: '06/30/2018', currency: 'USD',
        hidden: false, partitionId: 1, currencies: [{ name: 'USD', enumDataId: 1 }],
        poPartitions: [{ accountId: 1 }],
        defaultCurrency: { currencies: { 0: { name: 'USD' } }, partitions: { 0: { login: 'root' } } }
    },
    subsciptions: {
        specId: 1,
        _body: '{"message": "Failed"}',
        error: { 0: { error: 'error' } }
    },
    rateTables: {
        default: 'ecb-rateDefaultRow', drag: true, error: 'errorDeleteRow',
        schedule: {
            schedId: 991, pricelistId: 986, itemTemplateId: 989, ptId: 33, rulesCount: 2, ratesTables: [], ptName: 'metratech.com/BulkUnitRatesPT'
        }, parameterTableMetaData: {
            0: { enumData: { 0: { name: 'PI' } } }
        },
        records: [{
            scheduleId: 991, auditId: 1607, order: 0,
            conditions: { UnitValue: { operator: 'LESS_THAN_EQUALS', value: 3.0 }, name: 'sampleCond' },
            actions: { UnitAmount: 10, action: { name: 'sampleaction' } }
        }],
        opParmeter: { RCAmount: { _opParameterTableMetadata: [], columnoperator: '=' } },
        defRates: { rates: { 0: { pricelistName: 'Sample PI' } }, pricelistId: 986, dirty: () => { } },
        metaData: [{dataType:'int',ConditionColumn:false, enumData:null, name:'rate', displayName:'rate source'},{dataType:'decimal',ConditionColumn:false, enumData:null, name:'Actions', displayName:'TEXT_ACTION'}],
    },
    ratesData: {
        rates: [{
            properties: [{ dataType: 'decimal', paramTableId: 33 }],
            itemTemplateId: 989, paramTableId: 33, pricelistId: 986, paramtableDisplayName: 'UDRC',
            pricelistType: ''
        }],
        paramTable: { selected: false }
    },
    ratelist: {
        pricelistId: 5, name: 'Dummy Shared Pricelist', inUseProductOffersSize: 0,
        inUseSubscribersSize: 0, sppartitionid: 1, properties: true,
        displayName: '', templateId: '', id: 1,
        pricelistUrl: 'www.metratech.com', check: 'N',
        value: '1', dn: 0, inUseSubscribers: null, plpartitionid: 1, error: 'sample'
    }
};
