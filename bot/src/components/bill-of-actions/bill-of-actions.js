import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const fetchDependencyVersion = async (target, name) => {
  const platform = (target === 'package.json') ? 'NPM' : 'Pypi';

	return fetch(`https://libraries.io/api/${platform}/${name}?api_key=${process.env.LIBRARIES_IO_API_KEY}`)
    .then((res) => res.json())
    .then((res) => {
			if (res.versions) delete res.versions;

      return res;
    })
    .catch((err) => {
      console.error(err);
    });
};

const createBillOfActions = async (billOfMaterials) => {
	let billOfActions = billOfMaterials;

  const assets = await Promise.all(billOfActions.assets.map(async (asset) => {
    if (asset.manifest === 'requirements.txt') {
      asset['pip-packages'] = await Promise.all(asset['pip-packages'].map((dependency) => fetchDependencyVersion(dependency.manifest, dependency.name)
      .then((result) => ({
        latest_release_number: result.latest_release_number,
        ...dependency,
			}))));

      return asset;
		}

    return undefined;
	}));

	billOfActions.assets = assets;

  return billOfActions;
};

export default createBillOfActions;
