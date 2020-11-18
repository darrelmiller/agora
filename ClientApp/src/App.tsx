import * as React from 'react';
import { Route, useLocation } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';

import './custom.css'
import UmlDiagram from './components/UmlDiagram';
import OpenApiDescription from './components/OpenApiDescription';
import SwaggerUIView from './components/SwaggerUIView';
import GraphVocabularies from './components/GraphVocabularies';
import { useDispatch } from 'react-redux';
import UriSpace from './components/UriSpace';
import { actionCreators } from './store/Actions';


export default () => {
    const location = useLocation();
    console.log(location.search);
    var parameters = new URLSearchParams(location.search);
    var search = parameters.get("search")

    if (search) {
        const dispatch = useDispatch();
        dispatch(actionCreators.updateSearchTerm(search));
        dispatch(actionCreators.searchForTerm());
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

// <!--        <Route path='/urispace' component={UriSpace} /> -->