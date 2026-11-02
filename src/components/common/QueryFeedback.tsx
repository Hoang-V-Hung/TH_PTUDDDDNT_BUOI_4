import type { QueryFeedbackProps } from '../../types/componentProps';
import React from 'react';
import LoadingView from './LoadingView';
import ErrorView from './ErrorView';
import LastUpdatedText from './LastUpdatedText';

/** @param {{query: Object}} props query bắt buộc, lấy từ useCachedQuery. */
export default function QueryFeedback({
  query,
  showTimestamp = true,
}: QueryFeedbackProps) {
  return (
    <>
      {query.loading ? <LoadingView /> : null}
      {query.error ? (
        <ErrorView message={query.error.message} onRetry={query.refresh} />
      ) : null}
      {showTimestamp ? <LastUpdatedText timestamp={query.lastUpdated} /> : null}
    </>
  );
}
