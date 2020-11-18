import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import { actionCreators } from '../store/Actions';
import { VocabularyState, GraphTerm } from '../store/VocabularyState';

type GraphVocabulariesProps = VocabularyState & typeof actionCreators ;

const GraphVocabularies = (props: GraphVocabulariesProps)  => {
    

    return (<div id="graphVocabularySearch">

              <input type="search" id="searchField" className="Editor" name="csdl" 
                                          value={props.searchTerm} 
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
                {props.graphTerms.map((term: GraphTerm) =>
                  <tr>
                    <td>{term.version}</td>
                        <td><a target='_blank' href={'https://metadataexplorerstorage.blob.core.windows.net/$web/beta.html#search:'+term.name}> {term.name}</a></td>
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

  const mapStateToProps = (state : ApplicationState)  => state.vocabulary;

  export default connect(mapStateToProps, actionCreators)(GraphVocabularies as any)
