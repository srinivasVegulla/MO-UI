const fixtureBody = `<div id= 'mainBody' dir='LTR'></div>`;
document.body.insertAdjacentHTML(
    'afterbegin',
    fixtureBody);
export const welcomeComponentData = [
    { target: { id: 'breadcrumbExpDivs' } },
    {
        target: {
            id: 'mobileNavIcon1',
            className: { includes: () => { } }
        }
    }];
