

## [1.2.0](https://github.com/tiagoboeing/bull-board/compare/v1.2.0-0...v1.2.0) (2023-06-29)

## [1.2.0-0](https://github.com/tiagoboeing/bull-board/compare/v1.1.0-0...v1.2.0-0) (2023-06-29)


### Features

* :sparkles: Created environment to enable basic auth using login and password ([#3](https://github.com/tiagoboeing/bull-board/issues/3)) ([0b994f7](https://github.com/tiagoboeing/bull-board/commit/0b994f7fc5a78fccca6af30ce97faf0f0b15cf9b))
* :stethoscope: Simple `/healthcheck` endpoint to be used on Kubernetes probes, like `liveness/readiness` ([#4](https://github.com/tiagoboeing/bull-board/issues/4)) ([3cda380](https://github.com/tiagoboeing/bull-board/commit/3cda380d17c2cd416934eef5aa83f7b15d4c2ef2))

## [1.1.0-0](https://github.com/tiagoboeing/bull-board/compare/v1.0.3-0...v1.1.0-0) (2023-04-27)


### Features

* :sparkles: Created environment variable `BASE_PATH` to work when using subpaths ([#2](https://github.com/tiagoboeing/bull-board/issues/2)) ([c236a53](https://github.com/tiagoboeing/bull-board/commit/c236a53011d69f5a9eaaea4d824c191d5ea9422e))

### [1.0.3-0](https://github.com/tiagoboeing/bull-board/compare/v1.0.2...v1.0.3-0) (2022-12-20)


### Others

* :construction_worker: Allow to generate pre-releases on CI ([71aa792](https://github.com/tiagoboeing/bull-board/commit/71aa792537c7510c3127c9115260c5720dc4c0aa))

### [1.0.2](https://github.com/tiagoboeing/bull-board/compare/v1.0.1...v1.0.2) (2022-12-20)


### Others

* :construction_worker: Build workflow now runs tests and build too with Node ([76106a3](https://github.com/tiagoboeing/bull-board/commit/76106a30b60c768d36c4b878e4877cc27c94fba1))
* :construction_worker: Updated Node version from `16` to `18` on GitHub release action ([6def9d3](https://github.com/tiagoboeing/bull-board/commit/6def9d32405bc8e48c580197dd23ace6686e79ec))

### [1.0.1](https://github.com/tiagoboeing/bull-board/compare/v1.0.0...v1.0.1) (2022-12-20)


### Bug Fixes

* :construction_worker: Fixed name of build workflow ([6195e7e](https://github.com/tiagoboeing/bull-board/commit/6195e7ea726a6ab263eb9fe31f384f2c12d01f03))


### Others

* :construction_worker: Created action to build code on push ([bd06b6f](https://github.com/tiagoboeing/bull-board/commit/bd06b6fe83442a9641fb08a003aa4254a8f9ea56))
* :memo: Breaking changes exclusive section on CHANGELOG.md ([afad36d](https://github.com/tiagoboeing/bull-board/commit/afad36d6c14c0dcbd8fe3b2e712d67880215081b))

## 1.0.0 (2022-12-20)


### Features

* :construction: Created template repository with Docker and environments ([3cd7af4](https://github.com/tiagoboeing/bull-board/commit/3cd7af4695966987a4c3fc8554a61f893f9429fb))


### Others

* :bug: Fixed `console.log` with UI link ([917b833](https://github.com/tiagoboeing/bull-board/commit/917b833b94ae9d699b66ca914ff87a0f2bc2bb17))
* :construction_worker: Created file to start release flow ([69ede41](https://github.com/tiagoboeing/bull-board/commit/69ede41904a04345bb6253d3147c463769c93aa5))
* :construction_worker: Created GitHub Action to build and push snapshots ([2f5fd58](https://github.com/tiagoboeing/bull-board/commit/2f5fd5879796b83c4dea2b47548ed05304c3c18f))
* :green_heart: Fixed name of action to create releases ([861baa7](https://github.com/tiagoboeing/bull-board/commit/861baa77863b88673607989a5c50c3a009d498fb))
* :green_heart: Fixed to CI use ref_name from GitHub context ([8c2a116](https://github.com/tiagoboeing/bull-board/commit/8c2a1167b10588e70d56cbef980789437fafefe7))
* :green_heart: Make repository checkout on GitHub Action ([75d0852](https://github.com/tiagoboeing/bull-board/commit/75d0852ee3a4017b06fa479bd1c931a9ef66e626))
* :green_heart: Replace branch name when contains `/` to `-` ([087db4e](https://github.com/tiagoboeing/bull-board/commit/087db4eb04edd23c4ca504688d02ef404787a8df))
* :package: Upgrade to Node version 18 ([0f2cebd](https://github.com/tiagoboeing/bull-board/commit/0f2cebd480495a35a25624e256f7d77d12a82814))
* :recycle: Move files to `src` folder and update Docker ([0d88763](https://github.com/tiagoboeing/bull-board/commit/0d88763c825e32ebc8b5cd967fc161e4f3be855b))
* :rotating_light: Fixes ESLint execution ([e5568da](https://github.com/tiagoboeing/bull-board/commit/e5568da6978a33f07b3167ffb3ca021c44d18409))
* :sparkles: Added Jest configs to enable testing ([26616de](https://github.com/tiagoboeing/bull-board/commit/26616de9aa19262e1d6e41c315a7404f4bd31f32))
* :white_check_mark: Created tests to `split-queue` ([21020b1](https://github.com/tiagoboeing/bull-board/commit/21020b1d0863c7b14df3f918a5a9e2036e1428d4))