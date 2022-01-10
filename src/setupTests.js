import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {createSerializer} from 'enzyme-to-json';

 
Enzyme.configure({ adapter: new Adapter() });

expect.addSnapshotSerializer(createSerializer({mode: 'deep'}));

// mock para que el modal pueda ser dibujado ya que no contaba con un contexto
HTMLCanvasElement.prototype.getContext = () => {};

