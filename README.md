# Wordle

Wordle clone to experiment with Ports & Adapters design pattern in TypeScript code.

# Ports & Adapters / Hexagonal

> Intent
> 
> Allow an application to equally be driven by users, programs, automated test or batch scripts, and to be developed and tested in isolation from its eventual run-time devices and databases.

The main and abiding win for this pattern is that it provides clear lines that separate your domain concepts from your implementation details.

This can help you to realise when you are leaking information between these levels and creating incidental coupling rather than modelling inherent coupling between concepts.

The reason I like this pattern over others is not huge, it enshrines the principles;

* "inversion of control"
* "code to interfaces"
* "make your code modular" 
* "high cohesion is good"
* "low coupling is good"

It is actually quite simple and is a pattern that a lot of developers reach in their own way over time. 

It just gives it a handy name so that we can talk about it with a couple of words rather than describing in longform what we mean each time when onboarding new people.

## Resources 

[Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/)

[A Color Coded Guide](https://8thlight.com/insights/a-color-coded-guide-to-ports-and-adapters)

[Wikipedia Entry](https://en.wikipedia.org/wiki/Hexagonal_architecture_(software))

# Goals

Show the complete structure of a very simple app with a small Domain model in terms of how it is used with different adapters in a hexagonal architecture without getting bogged down in lots of detail.

# Non-Goals

Production level code. Formatting and linting are ignored.

Source code is organised for ease of browsing not necessarily what would be approriate for a larger project.

# Preempted Questions

## Q: So many shared packages...

Yeah, this is an example, you can organise your code however you want.

I wanted to show explicitly (through the package dependencies) that the domain code relies on **NONE** of the implementation code...it can't, it doesn't know it exists.

In a larger project where the adapters are more beefy it also starts to make sense to split things up like this to allow for easier incremental builds....err...type checking.

## Q: Why have you ripped off Rust's Result type?

It's not a DDD or Hexagonal pattern, you could use Exceptions.

I'm a fan of returning results as values instead of exception based systems. 

This code could easily be rewritten to use Exceptions. The `unwrapResult` method does just this and throws an `Error` based on the contents of the `Result`

## Q: Do I need all this crap?

The ratio of "crap" to domain code will be much lower in a real system - the Wordle domain is **tiny** - this code is just for exposition, I'm not suggesting this game **NEEDS** this level of thought/care/planning...

## Q: Where are the Tests at? I thought one of the main things was testability?!?!?

Inversion of control patterns can help with testing but that is a separate matter from what we think a Hexagonal app looks like in TypeScript.

Clearly being able to test my Domain service with a mocked Repository is easy in this code. 

Since the service cannot rely on anything that is not defined in the Repository interface it should work for any implementation it is provided. Real, mocked, network connected etc

## Q: Where are the Promises at? You're blocking all the time!?!?!?!

This is example code, async/await is not _really_ an issue here.

TODO: we could make this more realistic - and maybe more important if/when we have a real DB underneath.

## Q: Did you know _CODE_SNIPPET_ is not idiomatic TypeScript code?

Let's talk.

I'm new to TS, this is for me to try and express a pattern in TS.

If something is not idiomatic it may be;

* my imperfect grasp of the language
* that this is the only way I found to express something in TS
* there are multiple ways and I chose this one

## Q: Did you know you should use _THIS_TOOL_ to build your code?

Irrelevant to the purpose of this project right now.

## Building

Install dependencies.

```shell
pnpm install
```

Build all packages.

```shell
pnpm -r build
```

Run an ephemeral API server - no data is persisted between runs.

```shell
pnpm -F @wordle/api run start
```

Run an in-browser game bundle web server

```shell
pnpm -F @wordle/web run start
```

Open the previous in-browser game in web browser (on Linux)

```shell
pnpm -F @wordle/web run view
```

# TODO

Obvious extensions are already outlined;

* Add RDBMS store
* Create HTTP-client adapter for the Game Service so our web game can talk to the API
* Promise-based APIs
* Example of how we pass config through the system - i.e. not exposing ENV vars, files, process.env
* Linting
* Formatting
* Tests!
* Maybe have more than one target word...