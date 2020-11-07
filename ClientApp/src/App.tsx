import * as React from 'react';
import { Route, useLocation } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';

import './custom.css'
import UmlDiagram from './components/UmlDiagram';
import OpenApiDescription from './components/OpenApiDescription';
import SwaggerUIView from './components/SwaggerUIView';
import GraphVocabularies from './components/GraphVocabularies';
import { RouteComponentProps, useParams } from 'react-router-dom';
import * as ApiDescriptionStore from './store/ApiDescription';
import { useDispatch } from 'react-redux';


export default () => {
    const location = useLocation();
    console.log(location.search);
    var parameters = new URLSearchParams(location.search);
    var search = parameters.get("search")

    if (search) {
        const dispatch = useDispatch();
        dispatch(ApiDescriptionStore.actionCreators.updateSearchTerm(search));
        dispatch(ApiDescriptionStore.actionCreators.searchForTerm());
    }

    return (
        <Layout>
            <Route exact path='/' component={Home} />
            <Route path='/umldiagram' component={UmlDiagram} />
            <Route path='/openapi' component={OpenApiDescription} />
            <Route path='/swaggerui' component={SwaggerUIView} />
            <Route path='/vocabulary' component={GraphVocabularies} />
        </Layout>
    )
};

function parseQueryString(queryString: string) {
    var params = {}, i, l;

    // Split into key/value pairs
    const queries: string[] = queryString.split("&");

    // Convert the array of strings into an object
    for (i = 0, l = queries.length; i < l; i++) {
        const temp: string[] = queries[i].split('=');
        params[temp[0]] = temp[1];
    }

    return params;
};