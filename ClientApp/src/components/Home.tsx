import * as React from 'react';
import { connect } from 'react-redux';
import { CsdlValidator } from './CsdlValidator';
import { useTypedSelector } from '../store';
import ApiDescription from './ApiDescription';
//import CsdlValidator from './CsdlValidator';



const Home = () =>{

  return (<div>
              <ApiDescription/>
            </div>);
}

export default connect()(Home);

