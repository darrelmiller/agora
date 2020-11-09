import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { ApplicationState } from '../store';
import { actionCreators } from '../store/Actions';

type UmlDiagramProps = { umlDiagram: string } & typeof actionCreators ;

const ApiDescription = (props: UmlDiagramProps)  => {

    return (<div>
              <img src={props.umlDiagram} />  
            </div>
            );
  };

  const mapStateToProps = (state : ApplicationState)  => state.apiDescription;

  export default connect(mapStateToProps, actionCreators)(ApiDescription as any)
