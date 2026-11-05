import { fetchSeriesParticipantEventResults } from '../raceSeriesPublic';
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase', () => ({ supabase: { from: jest.fn() } }));

describe('series participant event results', () => {
  const eq = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (supabase.from as jest.Mock).mockReturnValue({ select: jest.fn().mockReturnValue({ eq }) });
  });

  it('sorts multiple dated results newest first and leaves undated events last', async () => {
    const result = (id: string, date: string | null) => ({
      id, series_participant_id: 'athlete', public_race_event_id: `event-${id}`,
      first_name: 'Test', last_name: 'Athlete', race_number: 1,
      public_race_event: date ? { title: id, race_start_date: date } : null,
    });
    eq.mockResolvedValue({ data: [
      result('undated', null), result('earlier', '2025-12-11'),
      result('latest', '2026-01-02'), result('middle', '2025-12-20'),
      result('also-undated', null),
    ], error: null });

    const results = await fetchSeriesParticipantEventResults('athlete');

    expect(eq).toHaveBeenCalledWith('series_participant_id', 'athlete');
    expect(results.map(({ id }) => id)).toEqual([
      'latest', 'middle', 'earlier', 'undated', 'also-undated',
    ]);
    expect(results[0]).toMatchObject({ event_name: 'latest', event_date: '2026-01-02' });
    expect(results[3]).toMatchObject({ event_name: null, event_date: null });
  });

  it('returns an empty list when no results are available', async () => {
    eq.mockResolvedValue({ data: null, error: null });
    await expect(fetchSeriesParticipantEventResults('athlete')).resolves.toEqual([]);
  });
});
