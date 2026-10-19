/**
 * Tests for the public registration submit API
 */

import { submitRegistration, type RegistrationPayload } from '../registration';

const payload: RegistrationPayload = {
  eventId: 'event-1',
  turnstileToken: 'token-1',
  firstName: '  Ann ',
  lastName: 'Lee',
  email: ' ann@example.com ',
  sexCategoryId: 1,
  monthOfBirth: 3,
  yearOfBirth: 2000,
};

const reply = (status: number, body: unknown) =>
  jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  });

const send = (fetchImpl: jest.Mock, p: RegistrationPayload = payload) =>
  submitRegistration(p, { baseUrl: 'https://project.supabase.co', fetchImpl: fetchImpl as unknown as typeof fetch });

describe('submitRegistration', () => {
  it('posts JSON to the register-for-event function with trimmed values', async () => {
    const fetchImpl = reply(200, { eventId: 'event-1', entryId: 'entry-1' });
    await send(fetchImpl);
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe('https://project.supabase.co/functions/v1/register-for-event');
    expect(init.method).toBe('POST');
    expect(init.headers).toEqual({ 'Content-Type': 'application/json' });
    expect(JSON.parse(init.body)).toEqual({
      eventId: 'event-1',
      turnstileToken: 'token-1',
      firstName: 'Ann',
      lastName: 'Lee',
      email: 'ann@example.com',
      sexCategoryId: 1,
      monthOfBirth: 3,
      yearOfBirth: 2000,
    });
  });

  it('leaves out optional fields that were not answered', async () => {
    const fetchImpl = reply(200, { eventId: 'event-1', entryId: 'entry-1' });
    await send(fetchImpl, { ...payload, sexCategoryId: null, monthOfBirth: null, yearOfBirth: null });
    const body = JSON.parse(fetchImpl.mock.calls[0][1].body);
    expect(body).not.toHaveProperty('sexCategoryId');
    expect(body).not.toHaveProperty('monthOfBirth');
    expect(body).not.toHaveProperty('yearOfBirth');
  });

  it('returns the ids on success', async () => {
    const result = await send(reply(200, { eventId: 'event-1', entryId: 'entry-1' }));
    expect(result).toEqual({ ok: true, eventId: 'event-1', entryId: 'entry-1' });
  });

  it.each([
    [403, 'turnstile_failed'],
    [409, 'duplicate'],
    [409, 'registration_closed'],
    [409, 'registration_not_available'],
    [404, 'event_not_found'],
    [500, 'server_error'],
  ])('maps %i %s to its error code', async (status, error) => {
    expect(await send(reply(status, { error }))).toEqual({ ok: false, code: error });
  });

  it('passes server field errors through for a validation error', async () => {
    const result = await send(
      reply(400, { error: 'validation_error', errors: { email: 'Enter a valid email address' } })
    );
    expect(result).toEqual({
      ok: false,
      code: 'validation_error',
      fieldErrors: { email: 'Enter a valid email address' },
    });
  });

  it('treats an unknown error code as a server error', async () => {
    expect(await send(reply(418, { error: 'teapot' }))).toEqual({ ok: false, code: 'server_error' });
  });

  it('treats a response that is not JSON as a server error', async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: false,
      status: 502,
      json: async () => {
        throw new Error('not json');
      },
    });
    expect(await send(fetchImpl)).toEqual({ ok: false, code: 'server_error' });
  });

  it('does not treat a 200 without ids as success', async () => {
    expect(await send(reply(200, {}))).toEqual({ ok: false, code: 'server_error' });
  });

  it('reports a network failure', async () => {
    const fetchImpl = jest.fn().mockRejectedValue(new TypeError('Failed to fetch'));
    expect(await send(fetchImpl)).toEqual({ ok: false, code: 'network_error' });
  });
});
