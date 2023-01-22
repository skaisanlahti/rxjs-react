# Architecture

## Signals -> Handlers

Subjects that emit events such as user input or on going game loop events.

- user input
- ui buttons
- keyboard events
- game loop ticks

## Handlers -> State

Handlers that react to signals and push results into state to provide updates for the UI. Handlers subscribe to signals to handle the events.

- subscribe to signals
- push updates to state

## State -> Views

BehaviorSubjects that define the current state of the app. The state is updated by pushing new values into the behavior subjects which updates the UI since the views subscribe to the state changes.

- game state
- ui state

## Views -> Signals

Views subscribe to state observables to show the current state of the application to the user.
