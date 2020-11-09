import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, useParams } from 'react-router-dom';
import { ApplicationState } from '../store';
import * as ApiDescriptionStore from '../store/ApiDescription';
import { Grid } from 'react-redux-grid';
import { actionCreators } from '../store/Actions';

type UriSpaceProps =
    ApiDescriptionStore.ApiDescriptionState
    & typeof actionCreators ;
    //&
    //RouteComponentProps<{}>;

const treeConfig = {
    stateKey: 'tree-grid-1',
    gridType: 'tree', // either `tree` or `grid`,
    showTreeRootNode: false, // dont display root node of tree
    columns: [
        {
            dataIndex: 'category',
            name: 'Category',
            expandable: true // this will be the column that shows the nested hierarchy
        },
        {
            dataIndex: 'categoryCode',
            name: 'Category Code',
            expandable: true // can be set on multiple columns
        },
        {
            dataIndex: 'editable',
            name: 'Editable',
            expandable: false // will be displayed as flat data
        }
    ],
    data: {
        root: {
            id: -1,
            parentId: null,
            children: [
                {
                    id: 1,
                    parentId: -1,
                    name: 'Category 1',
                    categoryCode: 'as-ffw-34neh-',
                    editable: true,
                    children: [
                        {
                            id: 12,
                            parentId: 1,
                            leaf: false
                        },
                        {
                            id: 13,
                            parentId: 1
                        }
                    ]
                }
            ]
        }
    }
};
const UriSpace = (props: UriSpaceProps)  => {

    return (<div id="uriSpace">
        <Grid {...treeConfig} />

            </div>
            );
  };

  const mapStateToProps = (state : ApplicationState)  => state.apiDescription;

  export default connect(mapStateToProps, actionCreators)(UriSpace as any)
