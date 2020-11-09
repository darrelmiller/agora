import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, useParams } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as ApiDescriptionStore from '../store/ApiDescription';
import { GraphTerm } from '../store/ApiDescription';

type GraphVocabulariesProps =
    ApiDescriptionStore.ApiDescriptionState
    & typeof ApiDescriptionStore.actionCreators ;
    //&
    //RouteComponentProps<{}>;

const GraphVocabularies = (props: GraphVocabulariesProps)  => {
    

    return (<div id="graphVocabularySearch">

              <input type="search" id="searchField" className="Editor" name="csdl" 
                                          value={props.vocabulary.searchTerm} 
                                          onChange={(event) =>{props.updateSearchTerm(event.target.value)}}
                                          />
              <button id="searchButton" onClick={(event) =>{props.searchForTerm();}}>Search</button>
              <table id="graphTerms" className='table table-striped' aria-labelledby="tableLabel">
              <thead>
                <tr>
                    <th>Version</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Kind</th>
                    <th>Description</th>
                    <th>Namespace</th>
                </tr>
              </thead>
              <tbody>
                {props.vocabulary.graphTerms.map((term: GraphTerm) =>
                  <tr>
                    <td>{term.version}</td>
                    <td>{term.name}</td>
                    <td>{term.kind}</td>
                     <td>{term.type}</td>
                    <td>{term.description}</td>
                    <td>{term.namespace}</td>
                  </tr>
                )}
              </tbody>
      </table>

            </div>
            );
  };

  const mapStateToProps = (state : ApplicationState)  => state.apiDescription;

  export default connect(mapStateToProps,
      ApiDescriptionStore.actionCreators)(GraphVocabularies as any)
