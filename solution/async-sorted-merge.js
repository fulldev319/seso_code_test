"use strict";

// Print all entries, across all of the *async* sources, in chronological order.

const PriorityQueue = require("./priority-queue");

const sortSources = async (logSources, printer) => {
  let candidates = new PriorityQueue(
    (a, b) => a.entry.date.getTime() < b.entry.date.getTime()
  );

  await Promise.all(
    logSources.map(async (logSource) => {
      const entry = await logSource.popAsync();
      if (entry) candidates.push({ source: logSource, entry: entry });
    })
  );

  while (candidates.size() > 0) {
    const bestCandidate = candidates.pop();
    printer.print(bestCandidate.entry);
    const newEntry = await bestCandidate.source.popAsync();
    if (newEntry)
      candidates.push({ source: bestCandidate.source, entry: newEntry });
  }
  printer.done();
};

module.exports = (logSources, printer) => {
  return new Promise((resolve, reject) => {
    sortSources(logSources, printer)
      .then(() => resolve(console.log("Async sort complete.")))
      .catch(() => reject(console.log("Async sort is failed.")));
  });
};

