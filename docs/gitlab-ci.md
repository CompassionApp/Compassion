# CI

Our project is currently using Gitlab CI for our continuous integration (CI) and continuous development (CD) needs. The configuration for our project can be found at the project root in the `.gitlab-ci.yml` file.

### Limitations

The limitation we face with our free project is that we're limited to only **400 CI minutes per month**, meaning that past that quota we won't be able to get verification for each commit pushed. So this naturally pushes us to keep our CI processes fast and reliable (not flaky).

If we exceed the quota, there are other means of adding additional CI horsepower without purchasing CI minutes from Gitlab outright...

### Gitlab Runner via Docker

Developers can contribute their own resources & machines by running a Docker image tied to the project. This Docker container will run in the background and will run CI jobs ad-hoc.

If you're interested, follow these steps:

- Follow instructions found here to pull a Docker image with the Gitlab CI executor: https://docs.gitlab.com/runner/install/docker.html#install-the-docker-image-and-start-the-container
- Register the runner
  - https://docs.gitlab.com/runner/register/index.html#docker
  - https://gitlab.com/compassion-in-oakland/compassionapp/-/settings/ci_cd
    - Use the URL `https://gitlab.com/` and the token `UJUH568uDSVCWUdtexYf`
- Tail the logs with `docker logs gitlab-runner -f` or just let it run quietly!
