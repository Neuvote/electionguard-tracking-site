import { useQuery } from 'react-query';
import { Election } from '../models/election';
import { ElectionResultsSummary } from '../models/tally';
import { TrackedBallot } from '../models/tracking';
import { useDataAccess } from './DataAccessProvider';

export const QUERIES = {
    ELECTIONS: 'ELECTIONS',
    ELECTION_RESULTS: 'ELECTION_RESULTS',
    SEARCH_BALLOTS: 'SEARCH_BALLOTS',
};

export interface QueryResult<T> {
    data: T | undefined;
    isError: boolean;
    isLoading: boolean;
    isIdle: boolean;
}

/**
 * Fetch the available elections
 * @param condition An optional boolean value which, if false, will prevent the query from running.
 */
export function useElections(condition: boolean = true): QueryResult<Election[]> {
    const dataAccess = useDataAccess();
    return useQuery(QUERIES.ELECTIONS, () => dataAccess.getElections(), { enabled: condition });
}

/**
 * Fetch the results (if any) for an election.
 *
 * @param electionId The ID of the election to pull results for
 * @param condition An optional boolean value which, if false, will prevent the query from running.
 */
export function useElectionResults(electionId: string, condition: boolean = true): QueryResult<ElectionResultsSummary> {
    const dataAccess = useDataAccess();
    return useQuery([QUERIES.ELECTION_RESULTS, electionId], () => dataAccess.getElectionResults(electionId), {
        enabled: condition && electionId,
    });
}

/**
 * Search for ballots by querying their tracking code
 *
 * @param electionId The ID of the election to search
 * @param trackerQuery A query string to match against the ballot's tracker
 * @param condition An optional boolean value which, if false, will prevent the query from running.
 */
export function useSearchBallots(
    electionId: string,
    trackerQuery: string,
    condition: boolean = true
): QueryResult<TrackedBallot[]> {
    const dataAccess = useDataAccess();
    return useQuery(
        [QUERIES.SEARCH_BALLOTS, electionId, trackerQuery],
        () => dataAccess.searchBallots(electionId, trackerQuery),
        {
            // The search will stay in 'idle' state until this is satisfied
            enabled: condition && electionId,
            // Results for each query are cached for this time
            staleTime: 60 * 1000,
        }
    );
}
