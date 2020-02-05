const fixtureBody = `<div class="ebBreadcrumbs-list"></div>`;
document.body.insertAdjacentHTML(
    'afterbegin',
    fixtureBody);
export const breadCrumbData = {
    displayInfo: '{"imageType": "","currentPage":""}',
    breadcrumbObject: '{"path ": "path"}',
    svcData: {
        offerId: 1, bundle: 'Sample', grid: 'sub', Level: 'sub', obj: '', path: 'path',
        displayName: 'productOffer', chargeType: 'chargeType', kindType: 'kindType',
        POObj: { 'offerId': 1 }, PIObj: { 'offerId': 1 }, PIType: 'PIType', CPIObj: [],
        childs: 1, children: {}, nodeType: 'this.widget["Po"]', id: 1,
        onPopState: { path: { 0: { location: { pathname: 'path' } } } }, parentId: 1, templateParentId: null
    }
};
