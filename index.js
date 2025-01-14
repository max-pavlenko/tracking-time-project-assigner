(function () {
  // Common project IDs mapped by entity names
  const ENTITY_IDS_MAP = {
    MorningCatchup: {project_id: '2006582'},
    WeekCalendarPlanning: {project_id: '2309887'},
    Combinvest: {project_id: '2013916', task_id: '12944812'},
    CombinvestDaily: {project_id: '2007084'},
    AfternoonCatchup: {project_id: '2006786'},
    CodeReview: {project_id: '2006788'},
    CombinvestSprintPlanning: {project_id: '2007185'},
    CombinvestSprintReviewRetro: {project_id: '2007106'},
    Decompress: {project_id: '2015035'},
    KapsysInternalCall: {project_id: '2007116'},
    CombinvestRefinement: {project_id: '2007104'}
  };

  // The word field is used to search for events
  const TASK_MAP = {
    MorningCatchup: {
      word: 'Morning',
      ...ENTITY_IDS_MAP.MorningCatchup
    },
    DailyCalendarFixes: {
      word: 'Daily Ca',
      ...ENTITY_IDS_MAP.WeekCalendarPlanning
    },
    AfternoonCatchup: {
      word: 'Afternoon Ca',
      ...ENTITY_IDS_MAP.AfternoonCatchup
    },
    SelfReview: {
      word: 'Self Review',
      ...ENTITY_IDS_MAP.CodeReview
    },
    Decompress: {
      word: 'Decompress',
      ...ENTITY_IDS_MAP.Decompress
    },
    CalendarSyncCall: {
      word: 'Calendar sync call',
      ...ENTITY_IDS_MAP.KapsysInternalCall
    },
    CodeReview: {
      word: 'Code review',
      ...ENTITY_IDS_MAP.CodeReview
    },
    Combinvest: {
      Daily: {
        word: 'est Daily',
        ...ENTITY_IDS_MAP.CombinvestDaily
      },
      Ticket: {
        word: 'TC-',
        ...ENTITY_IDS_MAP.Combinvest
      },
      Dev: {
        word: 'Combinvest Dev',
        ...ENTITY_IDS_MAP.Combinvest
      },
      SprintPlanning: {
        word: 'Combinvest - Sprint Planning',
        ...ENTITY_IDS_MAP.CombinvestSprintPlanning
      },
      SprintReviewRetro: {
        word: 'Combinvest Sprint Review/Retro',
        ...ENTITY_IDS_MAP.CombinvestSprintReviewRetro
      },
      Refinement: {
        word: 'Combinvest Refinement',
        ...ENTITY_IDS_MAP.CombinvestRefinement
      }
    }
  };

  const TASKS_TO_DELETE_MAP = {
    Lunch: {word: 'Lunch'}
  };

  // flatten TASK_MAP so nested objects in 'Combinvest' group are iterated over
  function* flattenTasks(taskMap) {
    for (const key in taskMap) {
      const value = taskMap[key];
      if (value && typeof value === 'object' && !value.word) {
        // If this property doesn't have a 'word' field, assume object-grouper with tasks
        yield* flattenTasks(value);
      } else {
        yield value;
      }
    }
  }

  function getEventsWithTaskWord(word) {
    const allEvents = document.querySelectorAll('div[data-comp="event"]');
    const matchingEvents = [];

    allEvents.forEach(eventEl => {
      const noteEl = eventEl.querySelector('.notes[data-comp="note"]');
      const taskName = noteEl ? noteEl.textContent.trim() : '';

      if (taskName.toLowerCase().includes(word.toLowerCase())) {
        const eventId = eventEl.getAttribute('data-id');
        if (eventId) {
          matchingEvents.push({id: Number(eventId)});
        }
      }
    });

    if (matchingEvents.length === 0) {
      console.log(`No events with word "${word}" found.`);
      return null;
    }

    return matchingEvents;
  }

  async function makeApiCall(url, body = undefined) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization:
              'Basic bWFrc3ltLnBhdmxlbmtvQGthcHN5cy5pbzo3N2M0ZG00OWJmNjRidTZwaWowMm9yYTAwNw=='
        },
        ...(body && {body: JSON.stringify(body)})
      });

      const result = await response.json();
      console.log('✅ Success! API response:', result);
    } catch (error) {
      console.error('❌ Error during API call:', error);
    }
  }

  function makeApiCallForEvents(map, url) {
    for (const taskApiValue of flattenTasks(map)) {
      (async () => {
        const {word, ...task} = taskApiValue;
        const events = getEventsWithTaskWord(word);

        if (!events) return;

        const payload = {
          ...task,
          data: JSON.stringify(events)
        };

        makeApiCall(url, payload);
      })();
    }
  }

  makeApiCallForEvents(
      TASK_MAP,
      'https://pro.trackingtime.co/api/v4/529757/events/update/batch?ClientApp=TrackingTimeWEB%20PROD%206.94:u=718561&ClientID=78d3951c-0d0e-4cfd-b19d-6243feb1a642'
  );

  Object.values(TASKS_TO_DELETE_MAP).forEach(task => {
    const events = getEventsWithTaskWord(task.word);
    const params = new URLSearchParams({data: JSON.stringify(events)});
    makeApiCall(`https://pro.trackingtime.co/api/v4/529757/events/delete?${params.toString()}`);
  });
})();