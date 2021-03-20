/* global UInterface */

'use strict'

const TimelineEvents = {}

TimelineEvents.TICK_PERIOD = 300 // 0.5 sec period
TimelineEvents._LISTENER = undefined
TimelineEvents._INACTIVE_TEVENTS = undefined
TimelineEvents._ACTIVE_TEVENTS = undefined

TimelineEvents.stopTimelineListener = async function () {
  window.clearInterval(TimelineEvents._LISTENER)
  for (const tevent of TimelineEvents._ACTIVE_TEVENTS) {
    await tevent.deactivate()
  }
  TimelineEvents._ACTIVE_TEVENTS = undefined
  TimelineEvents._INACTIVE_TEVENTS = undefined
}

TimelineEvents.pushEvent = async function (tevent) {
  // TODO: optimize to push in sorted order
  TimelineEvents._INACTIVE_TEVENTS.push(tevent)
}

TimelineEvents._deactivateActive = async function (ts) {
  if (!TimelineEvents._ACTIVE_TEVENTS) { return }

  const stillActiveTEvents = []

  for (const tevent of TimelineEvents._ACTIVE_TEVENTS) {
    if (ts < tevent.tStart || ts > tevent.tStop) {
      stillActiveTEvents.push(tevent)
      continue
    }
    TimelineEvents._INACTIVE_TEVENTS.push(tevent)
    await tevent.deactivate()
  }

  TimelineEvents._ACTIVE_TEVENTS = stillActiveTEvents
}

TimelineEvents._activateInactive = async function (ts) {
  if (!TimelineEvents._INACTIVE_TEVENTS) { return }

  const stillInactiveTEvents = []

  for (const tevent of TimelineEvents._INACTIVE_TEVENTS) {
    if (ts < tevent.tStart || ts > tevent.tStop) {
      stillInactiveTEvents.push(tevent)
      continue
    }
    TimelineEvents._ACTIVE_TEVENTS.push(tevent)
    await tevent.activate()
  }

  TimelineEvents._INACTIVE_TEVENTS = stillInactiveTEvents
}

TimelineEvents._updateActionStates = async function (ts) {
  // TODO: estimate _TEVENTS index to use for activation later
  await TimelineEvents._deactivateActive(ts)
  // TODO: use hint from _deactivateActivated to know where to look for relevant events
  await TimelineEvents._activateInactive(ts)
}

TimelineEvents.initTimelineListener = async function () {
  if (typeof TimelineEvents._LISTENER !== 'undefined') {
    await TimelineEvents.stopTimelineListener()
  }

  TimelineEvents._INACTIVE_TEVENTS = []
  TimelineEvents._ACTIVE_TEVENTS = []
}

TimelineEvents.runTimelineListener = async function () {
  TimelineEvents._LISTENER = window.setInterval(
    async () => {
      const videoTs = await UInterface.getVideoTimestamp()
      await TimelineEvents._updateActionStates(videoTs)
    },
    TimelineEvents.TICK_PERIOD
  )
}

TimelineEvents.NOOP = async function () {}

class TimelineEvent {
  constructor (tStart, tStop, activate, deactivate) {
    this.tStart = tStart
    this.tStop = tStop
    this.activate = activate
    this.deactivate = deactivate
  }
}
