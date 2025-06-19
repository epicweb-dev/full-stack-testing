<div>
  <h1 align="center"><a href="https://www.epicweb.dev/workshops/web-application-testing">🧪 Full Stack Testing</a></h1>
  <strong>
    Confidently ship your full-stack app with automated tests
  </strong>
  <p>
    In this workshop you'll get practical skills you need to write tests well.
    So it's less of a chore you dread, and more of a part of the process of
    developing quality software in which you can have confidence.
  </p>
</div>

<div align="center">
  <a
    alt="Epic Web logo with the words Deployed Version"
    href="https://testing.epicweb.dev/"
  >
    <img
      width="300px"
      src="https://github-production-user-asset-6210df.s3.amazonaws.com/1500684/254000390-447a3559-e7b9-4918-947a-1b326d239771.png"
    />
  </a>
</div>

<hr />

<!-- prettier-ignore-start -->
[![Build Status][build-badge]][build]
[![GPL 3.0 License][license-badge]][license]
[![Code of Conduct][coc-badge]][coc]
<!-- prettier-ignore-end -->

## Prerequisites

- Some
  [experience with JavaScript](https://kentcdodds.com/blog/javascript-to-know-for-react)
- Some [experience with React](https://kcd.im/beginner-react)
- Some [experience with Node.js](https://nodejs.dev/en/learn)

## Pre-workshop Resources

Here are some resources you can read before taking the workshop to get you up to
speed on some of the tools and concepts we'll be covering:

- [Playwright](https://playwright.dev)
- [Vitest](https://vitest.dev/)
- [Testing Library](https://testing-library.com)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [But really, what is a JavaScript test?](https://kentcdodds.com/blog/but-really-what-is-a-javascript-test)
- [But really, what is a JavaScript mock?](https://kentcdodds.com/blog/but-really-what-is-a-javascript-mock)
- [Testing Implementation Details](https://kentcdodds.com/blog/testing-implementation-details)
- [Avoid the Test User](https://kentcdodds.com/blog/avoid-the-test-user)
- [Common mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-testing-mistakes)

## System Requirements

- [git][git] v2.18 or greater
- [NodeJS][node] v20 or greater
- [npm][npm] v8 or greater

All of these must be available in your `PATH`. To verify things are set up
properly, you can run this:

```shell
git --version
node --version
npm --version
```

If you have trouble with any of these, learn more about the PATH environment
variable and how to fix it here for [windows][win-path] or
[mac/linux][mac-path].

## Setup

This is a pretty large project (it's actually many apps in one) so it can take
several minutes to get everything set up the first time. Please have a strong
network connection before running the setup and grab a snack.

> **Warning**: This repo is _very_ large. Make sure you have a good internet
> connection before you start the setup process. The instructions below use
> `--depth` to limit the amount you download, but if you have a slow connection,
> or you pay for bandwidth, you may want to find a place with a better
> connection.

Follow these steps to get this set up:

```sh nonumber
git clone --depth 1 https://github.com/epicweb-dev/full-stack-testing.git
cd full-stack-testing
npm run setup
```

If you experience errors here, please open [an issue][issue] with as many
details as you can offer.

## Exercises

You'll find all the exercises in the `exercises` directory. The structure of the
workshop apps is described below, but most of the time you should be able to
simply run the app and navigate around the different exercises using the
application (there are even buttons to open the right exercise file right in
your editor).

The purpose of the exercise is **not** for you to work through all the material.
It's intended to get your brain thinking about the right questions to ask me as
_I_ walk through the material.

## Running the app

To get the app up and running (and really see if it worked), run:

```shell
npm start
```

Now open your browser to the address that's logged out for you and you're good
to get started!

## Running the tests

The test script in the `package.json` runs the tests on the solutions (these
should all pass). To run the tests against your own work, you simply open the
problem page and click the "Test" tab.

## Launching your editor

The application has several buttons which will launch your editor to the right
file. There are a lot of files in this workshop so you'll be using this feature
a lot to get to the right place at the right time.

This should just work™️, but if it doesn't it could be that our editor guessing
isn't working for you. If that's the case, create a `.env` file in the root of
this project and add an environment variable called `EPICSHOP_EDITOR` with the
value being set to the path to your editor's executable. For example, if you're
using VS Code on Windows, you'd add this to your `.env` file:

```
EPICSHOP_EDITOR="C:\Program Files\Microsoft VS Code\bin\code.cmd"
```

Make certain that if the path includes spaces that you wrap the path in quotes
as above.

### Remote Playwright Server

If you're using DevContainers, can't install Playwright binaries/dependencies or can't launch the UI mode natively, check this [issue](https://github.com/epicweb-dev/full-stack-testing/issues/41) for information on how to run Playwright in a container and/or launch the UI mode in the browser.

## Exercises

- `exercises/*.*/README.md`: Exercise background information
- `exercises/*.*/*.problem.*/README.*.md`: Problem Instructions
- `exercises/*.*/*.problem.*/*.tsx`: Exercise with Emoji helpers 👈 You spend
  most of your time here.
- `exercises/*.*/*.solution.*/*.tsx`: Solved version

The purpose of the exercise is **not** for you to work through all the material.
It's intended to get your brain thinking about the right questions to ask me as
_I_ walk through the material.

## Helpful Emoji 🐨 🦺 💰 📝 🦉 📜 💣 💪 🏁 👨‍💼 🚨 🧝‍♀️

Each exercise has comments in it to help you get through the exercise. These fun
emoji characters are here to help you.

- **Kody the Koala** 🐨 will tell you when there's something specific you should
  do
- **Lily the Life Jacket** 🦺 will help you with any TypeScript-specific parts
  of the exercises
- **Marty the Money Bag** 💰 will give you specific tips (and sometimes code)
  along the way
- **Nancy the Notepad** 📝 will encourage you to take notes on what you're
  learning
- **Olivia the Owl** 🦉 will give you useful tidbits/best practice notes
- **Dominic the Document** 📜 will give you links to useful documentation
- **Barry the Bomb** 💣 will be hanging around anywhere you need to blow stuff
  up (delete code)
- **Matthew the Muscle** 💪 will indicate that you're working with an exercise
- **Chuck the Checkered Flag** 🏁 will indicate that you're working with a final
- **Peter the Product Manager** 👨‍💼 helps us know what our users want
- **Alfred the Alert** 🚨 will occasionally show up in the test failures with
  potential explanations for why the tests are failing
- **Kellie the Co-worker** 🧝‍♀️ your co-worker who sometimes does work ahead of
  your exercises

## Workshop Feedback

Each exercise has an Elaboration and Feedback link. Please fill that out after
the exercise and instruction.

At the end of the workshop, please go
[here to give overall feedback](https://docs.google.com/forms/d/e/1FAIpQLSdRmj9p8-5zyoqRzxp3UpqSbC3aFkweXvvJIKes0a5s894gzg/viewform).

<!-- prettier-ignore-start -->
[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[git]: https://git-scm.com/
[build-badge]: https://img.shields.io/github/actions/workflow/status/epicweb-dev/full-stack-testing/validate.yml?branch=main&logo=github&style=flat-square
[build]: https://github.com/epicweb-dev/full-stack-testing/actions?query=workflow%3Avalidate
[license-badge]: https://img.shields.io/badge/license-GPL%203.0%20License-blue.svg?style=flat-square
[license]: https://github.com/epicweb-dev/full-stack-testing/blob/main/LICENSE
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://kentcdodds.com/conduct
[win-path]: https://www.howtogeek.com/118594/how-to-edit-your-system-path-for-easy-command-line-access/
[mac-path]: http://stackoverflow.com/a/24322978/971592
[issue]: https://github.com/epicweb-dev/full-stack-testing/issues/new
<!-- prettier-ignore-end -->
