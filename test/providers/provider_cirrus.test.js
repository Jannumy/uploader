const td = require('testdouble')

const providerCirrus = require('../../src/ci_providers/provider_cirrus')

describe('Cirrus Params', () => {
  afterEach(() => {
    td.reset()
  })

  describe('detect()', () => {
    it('does not run without Cirrus env variable', () => {
      const inputs = {
        args: {},
        envs: {},
      }
      const detected = providerCirrus.detect(inputs.envs)
      expect(detected).toBeFalsy()
    })

    it('does run with Cirrus env variable', () => {
      const inputs = {
        args: {},
        envs: {
          CI: true,
          CIRRUS_CI: true,
        },
      }
      const detected = providerCirrus.detect(inputs.envs)
      expect(detected).toBeTruthy()
    })
  })

  it('gets correct params', () => {
    const inputs = {
      args: {},
      envs: {
        CI: true,
        CIRRUS_CI: true,
        CIRRUS_BRANCH: 'master',
        CIRRUS_CHANGE_IN_REPO: 'testingsha',
        CIRRUS_BUILD_ID: 2,
        CIRRUS_PR: 1,
        CIRRUS_REPO_FULL_NAME: 'https:/example.com/repo',
      },
    }
    const expected = {
      branch: 'master',
      build: 2,
      buildURL: '',
      commit: 'testingsha',
      job: '',
      pr: 1,
      service: 'cirrus-ci',
      slug: 'https:/example.com/repo',
    }
    const params = providerCirrus.getServiceParams(inputs)
    expect(params).toMatchObject(expected)
  })

  it('gets correct params for overrides', () => {
    const inputs = {
      args: {
        branch: 'branch',
        build: 3,
        pr: '2',
        sha: 'testsha',
        slug: 'testOrg/testRepo',
      },
      envs: {
        CI: true,
        CIRRUS_CI: true,
        CIRRUS_BRANCH: 'master',
        CIRRUS_CHANGE_IN_REPO: 'testingsha',
        CIRRUS_BUILD_ID: 2,
        CIRRUS_PR: 1,
        CIRRUS_REPO_FULL_NAME: 'https:/example.com/repo',
      },
    }
    const expected = {
      branch: 'branch',
      build: 3,
      buildURL: '',
      commit: 'testsha',
      job: '',
      pr: '2',
      service: 'cirrus-ci',
      slug: 'testOrg/testRepo',
    }

    const params = providerCirrus.getServiceParams(inputs)
    expect(params).toMatchObject(expected)
  })
})
