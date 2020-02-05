export const breadcrumbsConfig = {
    defaultData: [
        {
            'path': '/ProductCatalog',
            'type': 'dropdown',
            'displayName': 'TEXT_PRODUCT_CATALOG',
            'id': 0,
            'imageType': '',
            'children': [
                {
                    'type': 'link',
                    'displayName': 'TEXT_SUBSCRIBABLE_ITEMS',
                    'active': false,
                    'display': true,
                    'path': '/ProductCatalog/Offerings',
                    'id': 0,
                    'imageType': ''
                },
                {
                    'type': 'link',
                    'displayName': 'TEXT_LOCALIZATION',
                    'active': false,
                    'display': true,
                    'path': '/ProductCatalog/Localization',
                    'id': 0,
                    'imageType': ''
                },
                {
                    'type': 'link',
                    'displayName': 'TEXT_OFFERING_SETUP',
                    'active': false,
                    'display': true,
                    'path': false,
                    'id': 0,
                    'imageType': ''
                },
                {
                    'type': 'link',
                    'displayName': 'TEXT_PI_TEMPLATES',
                    'active': false,
                    'display': true,
                    'path': '/ProductCatalog/PriceableItemTemplates',
                    'id': 0,
                    'imageType': ''
                },
                {
                    'type': 'link',
                    'displayName': 'TEXT_SHARED_RATES',
                    'active': false,
                    'display': true,
                    'path': '/ProductCatalog/SharedRatelist',
                    'id': 0,
                    'imageType': ''
                },
                {
                    'type': 'link',
                    'displayName': 'TEXT_SUBSCRIPTION_PROPERTIES',
                    'active': false,
                    'display': true,
                    'path': '/ProductCatalog/SubscriptionProperties',
                    'id': 0,
                    'imageType': ''
                },
                {
                    'type': 'link',
                    'displayName': 'TEXT_MORE_ADJUSTMENTS_REASONS',
                    'active': false,
                    'display': true,
                    'path': '/ProductCatalog/AdjustmentReasonsGrid',
                    'id': 0,
                    'imageType': ''
                },
                {
                    'type': 'link',
                    'displayName': 'TEXT_CALENDARS',
                    'active': false,
                    'display': true,
                    'path': '/ProductCatalog/Calendars',
                    'id': 0,
                    'imageType': ''
                },
                {
                    'type': 'link',
                    'displayName': 'TEXT_ADMIN',
                    'active': false,
                    'display': true,
                    'path': false,
                    'id': 0,
                    'imageType': ''
                },
                {
                    'type': 'link',
                    'displayName': 'TEXT_AUDIT_LOG',
                    'active': false,
                    'display': true,
                    'path': '/ProductCatalog/AuditLog',
                    'id': 0,
                    'imageType': ''
                },
            ]
        },
        {
            'type': 'link',
            'displayName': 'TEXT_SUBSCRIBABLE_ITEMS',
            'active': false,
            'path': '/ProductCatalog/Offerings',
            'id': 0,
            'imageType': ''
        }],
    localizationAllows: ['ProductOffer', 'bundle', 'subscriptionProperties', 'adjustmentReasons', 'PItemplate', 'LOPIDetails'],
    checkConfigAllows: ['ProductOffer', 'bundle']
};
