import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, useParams } from 'react-router-dom';
import { ApplicationState } from '../store';
import { actionCreators } from '../store/Actions';
import { UriSpaceNode } from '../store/UriSpaceState';

type UriSpaceProps = { uriSpace: UriSpaceNode} & typeof actionCreators ;


const UriSpaceView = (props: UriSpaceProps)  => {

    const renderChild = (node: UriSpaceNode) => {
        const nodeId: string = Math.random().toString();
        const layer: string = node.layer;

        return (<li><label className={layer} htmlFor={nodeId}>{node.segment}</label>
                    <input type="checkbox" id={nodeId} />
            <ul className="collapsibleList">
                        {(node.children|| []).map((node: UriSpaceNode) => renderChild(node))}
                    </ul>
                </li>
        );
    }

    return (<div id="uriSpace">
                <ul>
                    {renderChild(props.uriSpace)}         
                </ul>
            </div>
            );
  };

  const mapStateToProps = (state : ApplicationState)  => state;

  export default connect(mapStateToProps, actionCreators)(UriSpaceView as any)
