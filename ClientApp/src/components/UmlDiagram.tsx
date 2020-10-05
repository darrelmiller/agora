import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as ApiDescriptionStore from '../store/ApiDescription';

// interface ApiDescriptionProps {
//     csdl: string | undefined
// }

type ApiDescriptionProps =
    ApiDescriptionStore.ApiDescriptionState
    & typeof ApiDescriptionStore.actionCreators ;
    //&
    //RouteComponentProps<{}>;

const ApiDescription = (props: ApiDescriptionProps)  => {

    return (<div>
              <img src={props.umlDiagram} />  
            </div>
            );
  };

  const mapStateToProps = (state : ApplicationState)  => state.apiDescription;

  export default connect(mapStateToProps,
    ApiDescriptionStore.actionCreators)(ApiDescription as any)
