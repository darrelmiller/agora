import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as AgoraStore from '../store/ApiDescription';
import { actionCreators } from '../store/Actions';


type ApiDescriptionProps =
    AgoraStore.ApiDescriptionState
    & typeof actionCreators ;
    //&
    //RouteComponentProps<{}>;

const ApiDescription = (props: ApiDescriptionProps)  => {

    return (<div id="apiDescription">

              <textarea id="csdlEditor" className="Editor" name="csdl" 
                                          value={props.csdl} 
                                          onChange={(event) =>{props.updateCsdl(event.target.value)}}
                                          />
               <button id="csdlButton" onClick={(event) =>{
                 props.processCSDL();}}>Submit</button>

              <table id="csdlWarnings" className='table table-striped' aria-labelledby="tabelLabel">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Message</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {props.errors.map((error: AgoraStore.CSDLError) =>
                  <tr>
                    <td>{error.Code}</td>
                    <td>{error.Message}</td>
                    <td>{JSON.stringify(error.Target)}</td>
                  </tr>
                )}
              </tbody>
      </table>

            </div>
            );
  };

  const mapStateToProps = (state : ApplicationState)  => state.apiDescription;

  export default connect(mapStateToProps, actionCreators)(ApiDescription as any)
