import * as React from 'react';
import { connect } from 'react-redux';
import { CsdlValidator } from './CsdlValidator';


const Home = () => (<div>
            <h1>Agora</h1>
            <h2>CSDL to process</h2>
            <CsdlValidator submitData={getData}  />
          </div>);

export default connect()(Home);

 function getData(csdl:string) : Promise<void> {
  console.log(csdl);
  const opts:RequestInit = {
    method: "POST",
    body: csdl 
  };

  return fetch("https://localhost:5001/CsdlImage", opts)
      .then(response => console.log(response.body))
  
  //return null;
} 