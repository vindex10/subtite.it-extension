/* global UInterface */

'use strict'

const TimelineEvents = {}

TimelineEvents.TICK_PERIOD = 300 // 0.5 sec period
TimelineEvents._LISTENER = undefined
TimelineEvents._INACTIVE_TEVENTS = undefined
TimelineEvents._ACTIVE_TEVENTS = undefined

TimelineEvents.stopTimelineListener = function () {
  window.clearInterval(TimelineEvents._LISTENER)
  for (const tevent of TimelineEvents._ACTIVE_TEVENTS) {
    tevent.deactivate()
  }
  TimelineEvents._ACTIVE_TEVENTS = undefined
  TimelineEvents._INACTIVE_TEVENTS = undefined
}

TimelineEvents.pushEvent = function (tevent) {
  // TODO: optimize to push in sorted order
  TimelineEvents._INACTIVE_TEVENTS.push(tevent)
}

TimelineEvents._deactivateActive = function (ts) {
  if (!TimelineEvents._ACTIVE_TEVENTS) { return }

  const stillActiveTEvents = []

  for (const tevent of TimelineEvents._ACTIVE_TEVENTS) {
    if (ts < tevent.tStart || ts > tevent.tStop) {
      stillActiveTEvents.push(tevent)
      continue
    }
    TimelineEvents._INACTIVE_TEVENTS.push(tevent)
    tevent.deactivate()
  }

  TimelineEvents._ACTIVE_TEVENTS = stillActiveTEvents
}

TimelineEvents._activateInactive = function (ts) {
  if (!TimelineEvents._INACTIVE_TEVENTS) { return }

  const stillInactiveTEvents = []

  for (const tevent of TimelineEvents._INACTIVE_TEVENTS) {
    if (ts < tevent.tStart || ts > tevent.tStop) {
      stillInactiveTEvents.push(tevent)
      continue
    }
    TimelineEvents._ACTIVE_TEVENTS.push(tevent)
    tevent.activate()
  }

  TimelineEvents._INACTIVE_TEVENTS = stillInactiveTEvents
}

TimelineEvents._updateActionStates = function (ts) {
  // TODO: estimate _TEVENTS index to use for activation later
  TimelineEvents._deactivateActive(ts)
  // TODO: use hint from _deactivateActivated to know where to look for relevant events
  TimelineEvents._activateInactive(ts)
}

TimelineEvents.initTimelineListener = function () {
  if (typeof TimelineEvents._LISTENER !== 'undefined') {
    TimelineEvents.stopTimelineListener()
  }

  TimelineEvents._INACTIVE_TEVENTS = []
  TimelineEvents._ACTIVE_TEVENTS = []
}

TimelineEvents.runTimelineListener = function () {
  TimelineEvents._LISTENER = window.setInterval(
    () => {
      const videoTs = UInterface.getVideoTimestamp()
      TimelineEvents._updateActionStates(videoTs)
    },
    TimelineEvents.TICK_PERIOD
  )
}

TimelineEvents.NOOP = function () {}

class TimelineEvent {
  constructor (tStart, tStop, activate, deactivate) {
    this.tStart = tStart
    this.tStop = tStop
    this.activate = activate
    this.deactivate = deactivate
  }
}
