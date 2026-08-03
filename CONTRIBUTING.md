# Contributing

We are open to any contributions at any time. When contributing, we ask you to please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

Participation is governed by the [Code of Conduct](CODE_OF_CONDUCT.md).

## Pull Request Process

1. Install with `npm ci` and develop against `npm run dev`. See [Setup & Installation](docs/usage/setup.md) for environment variables and path aliases.
2. Run `npm run validate` before opening the pull request and commit whatever it rewrote. Three of its seven gates apply fixes in place while the workflows run read-only equivalents, so an unstaged fix passes locally and fails in continuous integration. [Testing](docs/usage/testing.md) covers the full chain.
3. Update the documentation your change affects: [README.md](README.md) for anything a reader of the repository root would need, [docs/index.md](docs/index.md) for architecture or usage, and [CHANGELOG.MD](CHANGELOG.MD) for a user-visible change.
4. Update the version in [package.json](package.json) and [CITATION.cff](CITATION.cff) when the change warrants a release. The versioning scheme we use is [SemVer](https://semver.org/).
5. You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

## Code of Conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). Read it before your first contribution, and follow it in every interaction with the project. Report unacceptable behaviour to the project team; complaints are reviewed in confidence.
