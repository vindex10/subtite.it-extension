# Architecture decisions

* use background-page instead of backgorund script to support ES6 modules

## Timeline

* Use "interruptTimeline" with a callback "proceedTimeline", that interruptor is responsible to call when done


## Settings

* Content script contains settings that don't change dynamically. While, background script serves dynamic settings
