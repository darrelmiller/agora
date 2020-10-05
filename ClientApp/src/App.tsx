import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Counter from './components/Counter';
import FetchData from './components/FetchData';

import './custom.css'
import UmlDiagram from './components/UmlDiagram';
import OpenApiDescription from './components/OpenApiDescription';
import SwaggerUIView from './components/SwaggerUIView';

export default () => (
    <Layout>
        <Route exact path='/' component={Home} />
        <Route path='/umldiagram' component={UmlDiagram} />
        <Route path='/openapi' component={OpenApiDescription} />
        <Route path='/swaggerui' component={SwaggerUIView} />
        <Route path='/fetch-data/:startDateIndex?' component={FetchData} />
    </Layout>
);
