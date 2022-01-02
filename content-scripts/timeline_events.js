/* global UInterface, CollectionUtils */

'use strict'

const TimelineEvents = {}

TimelineEvents.TAGS = {
  subtitle: 0
}

TimelineEvents.TICK_PERIOD = 300 // 0.5 sec period
TimelineEvents._LISTENER = undefined
TimelineEvents._DISABLED_TEVENTS = undefined
TimelineEvents._INACTIVE_TEVENTS = undefined
TimelineEvents._ACTIVE_TEVENTS = undefined

TimelineEvents.stopTimelineListener = function () {
  window.clearInterval(TimelineEvents._LISTENER)
  for (const tevent of TimelineEvents._ACTIVE_TEVENTS) {
    tevent.deactivate()
  }
  TimelineEvents._DISABLED_TEVENTS = undefined
  TimelineEvents._ACTIVE_TEVENTS = undefined
  TimelineEvents._INACTIVE_TEVENTS = undefined
}

TimelineEvents.replaceEvent = function (oldTEvent, newTEvent) {
  TimelineEvents._DISABLED_TEVENTS = TimelineEvents._DISABLED_TEVENTS.map(
    (e) => { return e === oldTEvent ? newTEvent : e }
  )
  TimelineEvents._INACTIVE_TEVENTS = TimelineEvents._INACTIVE_TEVENTS.map(
    (e) => { return e === oldTEvent ? newTEvent : e }
  )
  TimelineEvents._ACTIVE_TEVENTS = TimelineEvents._ACTIVE_TEVENTS.map(
    (e) => {
      if (e !== oldTEvent) { return e }
      oldTEvent.deactivate()
      newTEvent.activate()
      return newTEvent
    }
  )
}

TimelineEvents.pushEvent = function (tevent) {
  // TODO: optimize to push in sorted order
  TimelineEvents._INACTIVE_TEVENTS.push(tevent)
}

TimelineEvents.pushDisabledEvent = function (tevent) {
  TimelineEvents._DISABLED_TEVENTS.push(tevent)
}

TimelineEvents.getActiveEventsByTags = function (tags) {
  tags = new Set(tags)
  const res = []
  for (const tevent of TimelineEvents._ACTIVE_TEVENTS) {
    if (CollectionUtils.intersectSets(tevent.tags, tags).size === 0) {
      continue
    }
    res.push(tevent)
  }
  return res
}

TimelineEvents.removeEventsByTags = function (tags) {
  tags = new Set(tags)
  const removedActive = TimelineEvents._removeActiveByTags(tags)
  const removedInactive = TimelineEvents._removeInactiveByTags(tags)
  const removedDisabled = TimelineEvents._removeDisabledByTags(tags)
  return {
    active: removedActive,
    inactive: removedInactive,
    disabled: removedDisabled
  }
}

TimelineEvents._removeActiveByTags = function (tags) {
  if (!TimelineEvents._ACTIVE_TEVENTS) { return [] }

  const newActiveTEvents = []
  const removed = []

  for (const tevent of TimelineEvents._ACTIVE_TEVENTS) {
    if (CollectionUtils.intersectSets(tevent.tags, tags).size === 0) {
      newActiveTEvents.push(tevent)
      continue
    }
    removed.push(tevent)
  }

  TimelineEvents._ACTIVE_TEVENTS = newActiveTEvents
  return removed
}

TimelineEvents._removeInactiveByTags = function (tags) {
  if (!TimelineEvents._INACTIVE_TEVENTS) { return [] }

  const newInactiveTEvents = []
  const removed = []

  for (const tevent of TimelineEvents._INACTIVE_TEVENTS) {
    if (CollectionUtils.intersectSets(tevent.tags, tags).size === 0) {
      newInactiveTEvents.push(tevent)
      continue
    }
    removed.push(tevent)
  }

  TimelineEvents._INACTIVE_TEVENTS = newInactiveTEvents
  return removed
}

TimelineEvents._removeDisabledByTags = function (tags) {
  if (!TimelineEvents._DISABLED_TEVENTS) { return [] }

  const newDisabledTEvents = []
  const removed = []

  for (const tevent of TimelineEvents._DISABLED_TEVENTS) {
    if (CollectionUtils.intersectSets(tevent.tags, tags).size === 0) {
      newDisabledTEvents.push(tevent)
      continue
    }
    removed.push(tevent)
  }

  TimelineEvents._DISABLED_TEVENTS = newDisabledTEvents
  return removed
}

TimelineEvents.disableEventsByTags = function (tags) {
  tags = new Set(tags)
  const disabledActive = TimelineEvents._disableActiveByTags(tags)
  const disabledInactive = TimelineEvents._disableInactiveByTags(tags)
  return {
    active: disabledActive,
    inactive: disabledInactive
  }
}

TimelineEvents._disableActiveByTags = function (tags) {
  if (!TimelineEvents._ACTIVE_TEVENTS) { return }

  const newActiveTEvents = []
  const disabledNow = []

  for (const tevent of TimelineEvents._ACTIVE_TEVENTS) {
    if (CollectionUtils.intersectSets(tevent.tags, tags).size === 0) {
      newActiveTEvents.push(tevent)
      continue
    }
    tevent.deactivate()
    disabledNow.push(tevent)
    TimelineEvents._DISABLED_TEVENTS.push(tevent)
  }

  TimelineEvents._ACTIVE_TEVENTS = newActiveTEvents
  return disabledNow
}

TimelineEvents._disableInactiveByTags = function (tags) {
  if (!TimelineEvents._INACTIVE_TEVENTS) { return }

  const newInactiveTEvents = []
  const disabledNow = []

  for (const tevent of TimelineEvents._INACTIVE_TEVENTS) {
    if (CollectionUtils.intersectSets(tevent.tags, tags).size === 0) {
      newInactiveTEvents.push(tevent)
      continue
    }
    disabledNow.push(tevent)
    TimelineEvents._DISABLED_TEVENTS.push(tevent)
  }

  TimelineEvents._INACTIVE_TEVENTS = newInactiveTEvents
  return disabledNow
}

TimelineEvents.enableEventsByTags = function (tags) {
  tags = new Set(tags)
  if (!TimelineEvents._DISABLED_TEVENTS) { return }

  const newDisabledTEvents = []

  for (const tevent of TimelineEvents._DISABLED_TEVENTS) {
    if (CollectionUtils.intersectSets(tevent.tags, tags).size === 0) {
      newDisabledTEvents.push(tevent)
      continue
    }
    TimelineEvents._INACTIVE_TEVENTS.push(tevent)
  }

  TimelineEvents._DISABLED_TEVENTS = newDisabledTEvents
}

TimelineEvents._deactivateActive = function (ts) {
  if (!TimelineEvents._ACTIVE_TEVENTS) { return }

  const stillActiveTEvents = []

  for (const tevent of TimelineEvents._ACTIVE_TEVENTS) {
    if (ts >= tevent.tStart && ts < tevent.tStop) {
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
    if (ts < tevent.tStart || ts >= tevent.tStop) {
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
  TimelineEvents._DISABLED_TEVENTS = []
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
  constructor (tStart, tStop, activate, deactivate, tags = new Set()) {
    this.tStart = tStart
    this.tStop = tStop
    this.activate = activate
    this.deactivate = deactivate
    this.tags = new Set(tags)
  }

  static fromEvent (e, replacements) {
    const tStart = (replacements.tStart === undefined) ? e.tStart : replacements.tStart
    const tStop = (replacements.tStop === undefined) ? e.tStop : replacements.tStop
    const activate = (replacements.activate === undefined) ? e.activate : replacements.activate
    const deactivate = (replacements.deactivate === undefined) ? e.deactivate : replacements.deactivate
    const tags = (replacements.tags === undefined) ? e.tags : replacements.tags
    return new TimelineEvent(tStart, tStop, activate, deactivate, tags)
  }
}
