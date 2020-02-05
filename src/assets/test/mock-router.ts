export const MockRouter = {
    navigateByUrl: () => { '/login'; },
    events: {
        filter: () => { return { subscribe: () => { } }; }
    },
    navigate: () => { },
    redirectToPIDetailsPage: () => { },
    snapshot: { params: { productOfferId: 1, bundleId: 2}}
};
