/** @type {import('@lhci/cli').LHCIConfig} */
module.exports = {
  ci: {
    collect: {
      // Serve the static dist/ directory locally — no deploy step needed.
      staticDistDir: './dist',
      url: [
        'http://localhost/',
        'http://localhost/blog/the-architecture-boundary-problem/',
      ],
      // One run per URL keeps CI fast. Increase to 3 if you want median scoring.
      numberOfRuns: 1,
    },
    upload: {
      // Results uploaded to LHCI temporary public storage.
      // A link is posted as a GitHub check annotation for each run.
      target: 'temporary-public-storage',
    },
    // No assertions — this workflow is report-only and must not block deploys.
  },
};
