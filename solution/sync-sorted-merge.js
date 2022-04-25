"use strict";

// Print all entries, across all of the sources, in chronological order.

const PriorityQueue = require("./priority-queue");

module.exports = (logSources, printer) => {
  let candidates = new PriorityQueue(
    (a, b) => a.entry.date.getTime() < b.entry.date.getTime()
  );

  logSources.forEach((logSource) => {
    const entry = logSource.pop();
    if (entry) candidates.push({ source: logSource, entry: entry });
  });

  while (candidates.size() > 0) {
    const bestCandidate = candidates.pop();
    printer.print(bestCandidate.entry);
    const newEntry = bestCandidate.source.pop();
    if (newEntry)
      candidates.push({ source: bestCandidate.source, entry: newEntry });
  }
  printer.done();
  return console.log("Sync sort complete.");
};

