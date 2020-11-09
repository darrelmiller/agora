import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as ApiDescriptionStore from '../store/ApiDescription';


type ApiDescriptionProps =
    ApiDescriptionStore.ApiDescriptionState
    & typeof ApiDescriptionStore.actionCreators ;
    //&
    //RouteComponentProps<{}>;

const OpenApiDescription = (props: ApiDescriptionProps)  => {

    return (<div id="openApiDescription">
              <textarea id="openApiEditor" className="Editor" name="csdl" 
                                          value={props.openApi.OpenApi}
                                          readOnly 
                                          />
            </div>
            );
  };

  const mapStateToProps = (state : ApplicationState)  => state.apiDescription;

  export default connect(mapStateToProps,
    ApiDescriptionStore.actionCreators)(OpenApiDescription as any)
