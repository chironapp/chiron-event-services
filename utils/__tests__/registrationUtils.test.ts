/**
 * Tests for the public registration helpers
 */

import {
  getContactHref,
  getRegistrationAvailability,
  getRegistrationTarget,
  isHttpUrl,
  isPlausibleEmail,
  REGISTRATION_ERROR_MESSAGES,
  validateRegistrationForm,
  type RegistrationEvent,
  type RegistrationFormValues,
} from '../registrationUtils';

const event = (overrides: Partial<RegistrationEvent> = {}): RegistrationEvent => ({
  id: 'event-1',
  race_status: 'registration_open',
  registration_mode: 'chiron',
  registration_url: null,
  ...overrides,
});

describe('getRegistrationAvailability', () => {
  it('shows the form for the Chiron page while registration is open', () => {
    expect(getRegistrationAvailability(event())).toBe('open');
  });

  it.each(['paused', 'registration_closed', 'started', 'draft', null])(
    'is closed for the Chiron page when the status is %s',
    (status) => {
      expect(getRegistrationAvailability(event({ race_status: status }))).toBe('closed');
    }
  );

  it('points to the organiser for their own link, whatever the status', () => {
    expect(getRegistrationAvailability(event({ registration_mode: 'custom' }))).toBe('elsewhere');
    expect(
      getRegistrationAvailability(event({ registration_mode: 'custom', race_status: 'paused' }))
    ).toBe('elsewhere');
  });

  it('is unavailable with no registration option, or an unknown one', () => {
    expect(getRegistrationAvailability(event({ registration_mode: 'none' }))).toBe('unavailable');
    expect(getRegistrationAvailability(event({ registration_mode: 'something-else' }))).toBe(
      'unavailable'
    );
  });
});

describe('isHttpUrl', () => {
  it.each(['https://example.com/r', 'http://example.com', ' https://example.com ', 'HTTPS://EXAMPLE.COM'])(
    'accepts %p',
    (url) => expect(isHttpUrl(url)).toBe(true)
  );
  it.each(['javascript:alert(1)', 'ftp://example.com', 'mailto:a@b.co', 'example.com', 'https://', '', null, undefined])(
    'rejects %p',
    (url) => expect(isHttpUrl(url)).toBe(false)
  );
});

describe('getRegistrationTarget', () => {
  it('goes to the hosted registration page in Chiron mode', () => {
    expect(getRegistrationTarget(event())).toEqual({
      kind: 'internal',
      href: '/events/event-1/register',
    });
  });

  it('ignores a stored custom link in Chiron mode', () => {
    expect(getRegistrationTarget(event({ registration_url: 'https://own.test/r' }))).toEqual({
      kind: 'internal',
      href: '/events/event-1/register',
    });
  });

  it("goes to the organiser's own link in custom mode", () => {
    expect(
      getRegistrationTarget(event({ registration_mode: 'custom', registration_url: ' https://own.test/r ' }))
    ).toEqual({ kind: 'external', url: 'https://own.test/r' });
  });

  it('has no button for a custom link that is not http(s)', () => {
    expect(
      getRegistrationTarget(event({ registration_mode: 'custom', registration_url: 'javascript:alert(1)' }))
    ).toBeNull();
    expect(getRegistrationTarget(event({ registration_mode: 'custom', registration_url: null }))).toBeNull();
  });

  it('has no button with no registration option, even if a link is stored', () => {
    expect(
      getRegistrationTarget(event({ registration_mode: 'none', registration_url: 'https://stale.test/r' }))
    ).toBeNull();
  });

  it.each(['paused', 'registration_closed', 'started', null])(
    'has no button when the status is %s',
    (status) => {
      expect(getRegistrationTarget(event({ race_status: status }))).toBeNull();
      expect(
        getRegistrationTarget(event({ race_status: status, registration_mode: 'custom', registration_url: 'https://own.test/r' }))
      ).toBeNull();
    }
  );
});

describe('isPlausibleEmail', () => {
  it.each(['a@b.co', 'first.last+tag@sub.example.com', '  a@b.co  '])('accepts %p', (v) =>
    expect(isPlausibleEmail(v)).toBe(true)
  );
  it.each(['', '   ', 'plain', 'a@b', '@b.com', 'a b@c.com', 'a@@b.com', `${'a'.repeat(250)}@b.co`])(
    'rejects %p',
    (v) => expect(isPlausibleEmail(v)).toBe(false)
  );
});

describe('getContactHref', () => {
  it('links an email address with mailto:', () => {
    expect(getContactHref('club@example.com')).toBe('mailto:club@example.com');
    expect(getContactHref('  club@example.com ')).toBe('mailto:club@example.com');
  });

  it('links a website as is', () => {
    expect(getContactHref('https://club.example.com/contact')).toBe('https://club.example.com/contact');
  });

  it.each([
    'javascript:alert(1)',
    'javascript:alert(1)//@x.co',
    'mailto:club@example.com',
    'a/b@example.com',
    'ftp://example.com',
    'not a contact',
    '',
    '   ',
    null,
    undefined,
  ])('does not link %p', (value) => {
    expect(getContactHref(value)).toBeNull();
  });

  it('does not link an over-long value', () => {
    expect(getContactHref(`https://example.com/${'a'.repeat(500)}`)).toBeNull();
  });
});

describe('validateRegistrationForm', () => {
  const values = (overrides: Partial<RegistrationFormValues> = {}): RegistrationFormValues => ({
    firstName: 'Ann',
    lastName: 'Lee',
    email: 'ann@example.com',
    sexCategoryId: null,
    monthOfBirth: null,
    yearOfBirth: null,
    ...overrides,
  });
  const simple = { record_sex_category: false, record_age_category: false };
  const full = { record_sex_category: true, record_age_category: true };
  const now = new Date('2026-10-19T00:00:00Z');

  it('accepts name and email when the event records nothing else', () => {
    expect(validateRegistrationForm(values(), simple, now)).toEqual({});
  });

  it('requires name and a plausible email', () => {
    expect(validateRegistrationForm(values({ firstName: ' ', lastName: '', email: '' }), simple, now)).toEqual({
      firstName: 'First name is required',
      lastName: 'Last name is required',
      email: 'Email is required',
    });
    expect(validateRegistrationForm(values({ email: 'nope' }), simple, now)).toEqual({
      email: 'Enter a valid email address',
    });
  });

  it('requires sex and birth month/year only when the event records them', () => {
    expect(validateRegistrationForm(values(), full, now)).toEqual({
      sexCategoryId: 'Select a sex',
      monthOfBirth: 'Select a month of birth',
      yearOfBirth: 'Enter a valid year of birth',
    });
    expect(
      validateRegistrationForm(values({ sexCategoryId: 1, monthOfBirth: 3, yearOfBirth: 2000 }), full, now)
    ).toEqual({});
  });

  it('bounds the year of birth', () => {
    const ok = { sexCategoryId: 2, monthOfBirth: 1 };
    expect(validateRegistrationForm(values({ ...ok, yearOfBirth: 1899 }), full, now).yearOfBirth).toBeDefined();
    expect(validateRegistrationForm(values({ ...ok, yearOfBirth: 2027 }), full, now).yearOfBirth).toBeDefined();
    expect(validateRegistrationForm(values({ ...ok, yearOfBirth: 1900 }), full, now)).toEqual({});
    expect(validateRegistrationForm(values({ ...ok, yearOfBirth: 2026 }), full, now)).toEqual({});
  });

  it('does not ask for sex or birth when the event does not record them', () => {
    expect(validateRegistrationForm(values(), { record_sex_category: false, record_age_category: false }, now)).toEqual({});
  });
});

describe('REGISTRATION_ERROR_MESSAGES', () => {
  it('has a message for every error code', () => {
    expect(Object.keys(REGISTRATION_ERROR_MESSAGES).sort()).toEqual(
      [
        'duplicate',
        'event_not_found',
        'network_error',
        'registration_closed',
        'registration_not_available',
        'server_error',
        'turnstile_failed',
        'validation_error',
      ].sort()
    );
  });

  it('does not reveal why a registration counts as a duplicate', () => {
    expect(REGISTRATION_ERROR_MESSAGES.duplicate).not.toMatch(/email|birth|name match/i);
  });
});
