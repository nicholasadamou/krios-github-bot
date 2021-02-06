import {
  getInstallations,
  getAllAccessibleRepos,
} from './bot';

test('get installations',
  () => getInstallations().then((installations) => {
    expect(installations.status).toBe(200);
  }));

test('get all repos',
  () => getAllAccessibleRepos().then((repos) => {
    expect(repos.length).toBe(1);
  }));
