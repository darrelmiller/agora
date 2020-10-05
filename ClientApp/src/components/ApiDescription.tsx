import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as ApiDescriptionStore from '../store/ApiDescription';
import { CSDLError } from '../store/ApiDescription';

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
              <div>
              <textarea id="csdlEditor" className="Editor" name="csdl" 
                                          value={props.csdl} 
                                          onChange={(event) =>{props.updateCsdl(event.target.value)}}
                                          />
               <button id="csdlButton" onClick={(event) =>{
                 props.processCSDL();}}>Submit</button>
              </div>
              <table className='table table-striped' aria-labelledby="tabelLabel">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Message</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {props.errors.map((error: CSDLError) =>
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

  export default connect(mapStateToProps,
    ApiDescriptionStore.actionCreators)(ApiDescription as any)
