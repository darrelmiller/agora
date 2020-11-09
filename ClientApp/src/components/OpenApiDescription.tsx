import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { ApplicationState } from '../store';
import { actionCreators } from '../store/Actions';
import { OpenApiState } from '../store/OpenApiState';

type OpenApiProps = OpenApiState & typeof actionCreators ;

const OpenApiDescription = (props: OpenApiProps)  => {

    return (<div id="openApiDescription">
              <textarea id="openApiEditor" className="Editor" name="csdl" 
                                          value={props.OpenApi}
                                          readOnly 
                                          />
            </div>
            );
  };

  const mapStateToProps = (state : ApplicationState)  => state.openApi;

  export default connect(mapStateToProps, actionCreators)(OpenApiDescription as any)
