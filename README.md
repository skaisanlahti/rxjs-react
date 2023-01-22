# RxJS + React architecture ideas

## Table of Contents

- [Ideas for modular architecture using RxJS and React](#ideas-for-modular-architecture-using-rxjs-and-react)
  - [Application layers](#application-layers)
  - [Dependency injection](#dependency-injection)
  - [Case for observable interfaces](#case-for-observable-interfaces)
- [Implementation details](#implementation-details)
  - [State modules](#state-modules)
  - [Event handling](#event-handling)
  - [RxJS-React integrations](#rxjs-react-integrations)
  - [Folder structure](#folder-structure)

## Ideas for modular architecture using RxJS and React

This is an example project implementing frontend architecture ideas using React and RxJS. This is not meant to be another state management library, but rather an exploration of architecture and organization strategy.

**Content and examples in short:**

- Split application into view and logic layer
- Use dependency injection to keep features and parts of each feature modular
- Split each feature into
  - View: React component
  - Module: State interface composed of RxJS Subjects and Observables
  - Handler: Function that composes RxJS streams into a reactive system
  - Core: Pure functions, operations and types
- Angular-inpired folder structure
- Features can be nested for organization

### Application layers

A lot of React projects mix concerns within views which can result in large and hard-to-understand components. Component state is also prone to result in data flows that are difficult to follow if props are drilled through many components. If state and application logic is moved to a different scope, components can remain more lightweight and focus on implementing visual aspects and dispatching events.

Separating concerns also helps with modularization. When state is decoupled from component life-cycle, rerenders can be better optimized and application logic can be composed with more freedom. Centralized data store also allows easy implementation of caching strategies and reduces network traffic when fetching operations aren't tied to rendering cycles.

### Dependency injection

Dependency injection is often made more complex than it needs to be. We can increase composability simply by passing dependencies as function arguments. By doing this, we can increase our options for composition and replacing implementations.

For the application layer we can use a factory function that composes other factory functions from other modules and handlers together.

React Context API can be used as dependency injection for the component tree. This strategy allows us to instantiate the application layer at the entry point and pass it to the React system. Components can also be tested in isolation by wrapping them in a mock context.

### Case for observable interfaces

If we want to make state management easily configurable and extendable, we have to separate state containers from state operations. Redux pattern does this through a dispatcher, effects, and reducers. However, implementing Redux requires us to define action creators to get type safety benefits and event filtering because of the singular event bus that the dispatcher is. The same pattern can be implemented with RxJS subjects as event bus and state containers. However, the same requirements for action serialization and filtering apply so the boilerplate remains.

One alternative would be to use **multiple event streams**. This saves us the trouble of event filtering since the streams are separate to begin with. Events still need to be mapped to actual functionality, but RxJS offers probably the most extensive library of operations on the market to get this done. Not only can emissions from streams be mapped to functions similar to reducers, they can be combined, split, and operated on with RxJS or custom operators.

Subjects are also multicast, so reusing events and state containers is very easy. Complex features can be split into atomic pieces, if desired, and then composed together. RxJS observables are also lazily evaluated like functions, they don't run until `.subscribe()` is called, which means we can have total control over when they run and stop running, for example linked to useEffect mount and clean up.

## Implementation details

Details of about this example implementation.

### State modules

State containers are implemented with RxJS Subjects as event emitters and BehaviorSubjects as state containers.

RxJS Subjects are multicasting observables that can be used to emit values to callbacks. Calling `subject.next(params)` emits the params to all observers that have been registered with the subject using `subject.subscribe()`.

RxJS BehaviorSubjects are like plain Subjects but have the additional ability to keep the last emitted value in memory and pass that to subscribers immediately when they start observing the subject. BehaviorSubjects also implement `.getValue()` method, which allows us to get the current value from the subject. This conveniently allows us to provide a default value for React's useState hook or extract a snapshot with the new useSyncExternalStore hook.

One inconvenient thing about BehaviorSubjects is that observables can't be turned into BehaviorSubjects. Piping RxJS operators to create derived state returns an observable, and the only way to turn that back to a BehaviorSubject that can be passed to React components is to subscribe to the result observable and emit a value to the second subject.

Plain observables _can_ be used with React components, but initial value must be provided manually for the useState hook.

### Event handling

Event handling is implemented by passing a state container to a function that composes RxJS streams into one or multiple systems, subscribes to the stream, and returns a clean up function that unsubscribes from the system.

This pattern allows for the logic to be broken into arbitrarily sized reactive systems so that it can be organized and extended freely. All logic is asyncronous and unblocking.

### RxJS-React integrations

React Context API is used as a dependency injection method to give all the components access to the application layer through a custom hook.

When components have access to the application, they can access the state containers by subscribing via another custom hook that injects values from the external state into component state to trigger rerenders as new values arrive. This custom subscribing hook can also take a selector function to get maximum control over renders with larger state objects.

Dispatching events does not require additional effort. Components can access the application event emitters through the application object and simply call `.next()` with the required parameters.

### Folder structure

This project uses Angular-inspired feature folders. Each feature is split into a React view, state module, event handler, and styles. Shared functionalities use a `shared` folder.

Splitting files by kind seems to be quite common in React + .NET projects but I think many would benefit from more feature-based organization especially when the number of files grows.
