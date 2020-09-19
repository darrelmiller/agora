import * as React from 'react';
import { connect } from 'react-redux';
import { Editor } from './Editor';
import { Button } from 'reactstrap';
import { ApplicationState } from '../store';
import * as ApiDescriptionStore from '../store/ApiDescription';
import { RouteComponentProps } from 'react-router';
import { useSelector, useDispatch } from 'react-router';

interface IHomeProps {
  submitData: (textValue: string) => Promise<void>;
}

// At runtime, Redux will merge together...
type ApiDescriptionProps =
  ApiDescriptionStore.ApiDescriptionState // ... state we've requested from the Redux store
  & typeof ApiDescriptionStore.actionCreators // ... plus action creators we've requested
  & RouteComponentProps<{}>; // ... plus incoming routing parameters


const CsdlValidator = (props)  => {
  const state = userSel
  
    const [textAreaValue, setTextAreaValue] = React.useState('');
  const process = () => {
    void props.submitData(textAreaValue);
  }
  return (<div>
            <textarea id="csdlEditor" className="Editor" name="csdl" 
                                        value={textAreaValue} 
                                        onChange={(event) => setTextAreaValue(event.target.value)} />
            <button id="csdlButton" onClick={process}>Submit</button>
            <img src="" />  
          </div>);
};

export default connect(
    (state: ApplicationState) => state.apiDescription, // Selects which state properties are merged into the component's props
    ApiDescriptionStore.actionCreators // Selects which action creators are merged into the component's props
  )(CsdlValidator);

//export default connect()(Home);