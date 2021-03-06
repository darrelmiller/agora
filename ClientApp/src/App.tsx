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
import UriSpace from './components/UriSpaceView';
import { actionCreators } from './store/Actions';
import UriSpaceView from './components/UriSpaceView';


export default () => {
    const location = useLocation();
    console.log(location.search);
    var parameters = new URLSearchParams(location.search);
    var search = parameters.get("search")

    const dispatch = useDispatch();
    if (search) {
        dispatch(actionCreators.updateSearchTerm(search));
        dispatch(actionCreators.searchForTerm());
    }

    dispatch(actionCreators.updateUriSpace());

    return (
        <Layout>
            <Route exact path='/' component={Home} />
            <Route path='/umldiagram' component={UmlDiagram} />
            <Route path='/openapi' component={OpenApiDescription} />
            <Route path='/swaggerui' component={SwaggerUIView} />
            <Route path='/urispaceview' component={UriSpaceView} />
            <Route path='/vocabulary' component={GraphVocabularies} />
        </Layout>
    )
};

// <!--        <Route path='/urispace' component={UriSpace} /> -->