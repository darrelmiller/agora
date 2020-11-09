import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { ApplicationState } from '../store';
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"
import { actionCreators } from '../store/Actions';
import { OpenApiState } from '../store/OpenApiState';

type OpenApiProps = OpenApiState & typeof actionCreators ;

const SwaggerUIView = (props: OpenApiProps)  => {

    return (<SwaggerUI url={props.OpenApiUrl} /> );
  };

  const mapStateToProps = (state : ApplicationState)  => state.openApi;

  export default connect(mapStateToProps, actionCreators)(SwaggerUIView as any)
