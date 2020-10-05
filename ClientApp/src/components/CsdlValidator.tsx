import * as React from 'react';
import { connect, ConnectedProps, MapStateToPropsParam } from 'react-redux';
import { Editor } from './Editor';
import { Button } from 'reactstrap';
import { ApplicationState, useTypedSelector } from '../store';
import * as ApiDescriptionStore from '../store/ApiDescription';
import { RouteComponentProps, StaticContext } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { ApiDescriptionState } from '../store/ApiDescription';


// At runtime, Redux will merge together...
type ApiDescriptionProps =
  ApiDescriptionStore.ApiDescriptionState // ... state we've requested from the Redux store
  & typeof ApiDescriptionStore.actionCreators // ... plus action creators we've requested
  & RouteComponentProps<{}>; // ... plus incoming routing parameters


export const CsdlValidator = ()  => {
  const apiDescriptionState = useTypedSelector(state => state.apiDescription );
  const csdl = useTypedSelector(state => state.apiDescription?.csdl);
  const dispatch = useDispatch();
  
  const process = () => {
    dispatch(ApiDescriptionStore.actionCreators.processCSDL());  
  }

  return (<div>
            <textarea id="csdlEditor" className="Editor" name="csdl" 
                                        value={csdl} 
                                        onChange={(event) => ApiDescriptionStore.actionCreators.updateCsdl(event.target.value)} />
            <button id="csdlButton" onClick={process}>Submit</button>
            <img src={apiDescriptionState?.umlDiagram} />  
          </div>);
};

// const mapState = (state: ApplicationState ) => ({ apiDescription: state.apiDescription });
// const mapDispatch = ApiDescriptionStore.actionCreators

// const connector = connect(
//     mapState, // Selects which state properties are merged into the component's props
//     mapDispatch // Selects which action creators are merged into the component's props
//   )
  
// //type PropsFromRedux = ConnectedProps<ApiDescriptionProps>

// export default connector(CsdlValidator);
