import axios from 'axios';

const createBillOfMaterials = async (gitURL, gitBranch, commitID) => {
	const url = 'http://apiservice-ykt.gitsecureapi.com/v1/compliance/bom';
	const data = JSON.stringify({
		giturl: gitURL,
		gitbranch: gitBranch,
		commitid: commitID,
	});

	return axios({
			method: 'GET',
			url,
			data,
		})
		.then((res) => res.data);
	};

export default createBillOfMaterials;
