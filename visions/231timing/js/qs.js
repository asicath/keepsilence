const getQueryParams = ( params, url = window.location.href ) => {

    let href = url;
    //this expression is to get the query strings
    let reg = new RegExp( '[?&]' + params + '=([^&#]*)', 'i' );
    let queryString = reg.exec(href);
    return queryString ? queryString[1] : null;
};

const getQSBool = (params, defaultValue = false) => {
    let v = getQueryParams(params);
    if (v === null) return defaultValue;
    if (v === 'true') return true;
    if (v === 'false') return false;
    return defaultValue;
};