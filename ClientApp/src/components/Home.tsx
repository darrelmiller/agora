import * as React from 'react';
import { connect } from 'react-redux';
import ApiDescription from './ApiDescription';

const Home = () =>{

  return (<div id="agoraPane">
              <ApiDescription/>
            </div>);
}

export default connect()(Home);

