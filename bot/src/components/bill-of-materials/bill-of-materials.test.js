import createBillOfMaterials from './bill-of-materials';

test('create bill of actions default',
  () => createBillOfMaterials(
    'https://github.ibm.com/test-rig/hello-flask',
    'nadgowda-patch-31',
    '1b95a26dfb579bde7f1c5bed827b0b0d861825c8',
  )
    .then((res) => {
      expect(res.data.assets[0].manifest).toBe('requirements.txt');
    }));
