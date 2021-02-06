import createBillOfActions from './bill-of-actions';
import testBOA from '../../../resources/billofmaterials.json';

test('create bill of actions default',
  () => createBillOfActions(testBOA)
    .then((res) => {
      res.map((i) => {
        expect(typeof i.latest_release_number).toBe('string');
        return i;
      });
    }));
