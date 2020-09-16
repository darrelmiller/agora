import * as React from 'react';
import { connect } from 'react-redux';
import { Editor } from './Editor';
import { Button } from 'reactstrap';

const Home = () => (
  <div>
    <h1>Agora</h1>
    <h2>CSDL to process</h2>
    <textarea id="csdlEditor" className="Editor" name="csdl"/>
    <button onClick={process} />
  </div>
);

export default connect()(Home);

const process = () => {
    var csdl = window.document.getElementById("csdlEditor")?.innerText

  }