import * as React from 'react';
import { connect } from 'react-redux';
import { Editor } from './Editor';
import { Button } from 'reactstrap';

interface IHomeProps {
  submitData: (textValue: string) => Promise<void>;
}

const Home = (props: IHomeProps) => {
  const [textAreaValue, setTextAreaValue] = React.useState('');
  const process = () => {
    void props.submitData(textAreaValue);
  }
  return (<div>
            <h1>Agora</h1>
            <h2>CSDL to process</h2>
            <textarea id="csdlEditor" className="Editor" name="csdl" value={textAreaValue} onChange={(val) => setTextAreaValue(val)} />
            <button onClick={process} />
          </div>);
};

export default connect()(Home);