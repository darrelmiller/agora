import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as ApiDescriptionStore from '../store/ApiDescription';
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"

type ApiDescriptionProps =
    ApiDescriptionStore.ApiDescriptionState
    & typeof ApiDescriptionStore.actionCreators ;
    //&
    //RouteComponentProps<{}>;

const SwaggerUIView = (props: ApiDescriptionProps)  => {

    return (<SwaggerUI url={props.openApi.OpenApiUrl} /> );
  };

  const mapStateToProps = (state : ApplicationState)  => state.apiDescription;

  export default connect(mapStateToProps,
    ApiDescriptionStore.actionCreators)(SwaggerUIView as any)
