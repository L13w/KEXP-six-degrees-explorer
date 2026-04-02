// Highlighted artist for each show during Six Degrees Week 2026.
// Source: https://www.kexp.org/sixdegrees/2026-six-degrees-week/
//
// Keyed by filename prefix (date_time-Show-Name) to match show data.
// Variety Mix shows are matched by date+time since the program name repeats.

const HIGHLIGHTED_ARTISTS = {
  // Friday, March 20
  '2026-03-20_08-00-00-Variety-Mix': null, // pre-Six Degrees
  '2026-03-20_12-00-00-Early': null, // duplicate
  '2026-03-20_13-00-00-Early': null,
  '2026-03-20_13-00-00-The-Morning-Show': null, // Six Degrees hadn't fully started
  '2026-03-20_17-00-00-The-Midday-Show': null,
  '2026-03-20_20-00-00-The-Afternoon-Show': null,
  '2026-03-20_23-00-00-Drive-Time': null,

  // Friday night / Saturday March 21
  '2026-03-21_02-00-00-The-Continent': 'Ebo Taylor',
  '2026-03-21_05-00-00-Street-Sounds': 'A Tribe Called Quest',
  '2026-03-21_06-00-00-Street-Sounds': 'A Tribe Called Quest',
  '2026-03-21_08-00-00-Mechanical-Breakdown': 'Skinny Puppy',
  '2026-03-21_10-00-00-Variety-Mix': 'Sonic Youth', // 3am-6am PT → 10:00 UTC
  '2026-03-21_13-00-00-90TEEN': null,
  '2026-03-21_14-00-00-Sounds-of-Survivance': 'Elisapie',
  '2026-03-21_16-00-00-Positive-Vibrations': "Fat Freddy's Drop",
  '2026-03-21_19-00-00-Variety-Mix': 'Serge Gainsbourg', // 12pm-3pm PT
  '2026-03-21_22-00-00-Variety-Mix': 'El Michaels Affair', // 3pm-6pm PT
  '2026-03-22_01-00-00-Audioasis': 'Alien Crime Syndicate',
  '2026-03-22_01-00-00-Vinelands': 'Alien Crime Syndicate',
  '2026-03-22_01-00-00-Variety-Mix-Weekends': null,
  '2026-03-22_04-00-00-Sonic-Reducer': 'The Gits',

  // Sunday, March 22
  '2026-03-22_07-00-00-Seek-And-Destroy': 'Motorhead',
  '2026-03-22_07-00-00-Seek-Destroy': 'Motorhead',
  '2026-03-22_09-00-00-Variety-Mix': 'Emma Ruth Rundle & Thou', // 2am-6am PT
  '2026-03-22_13-00-00-Pacific-Notions': 'Laraaji',
  '2026-03-22_16-00-00-The-Roadhouse': 'Jerry Garcia',
  '2026-03-22_19-00-00-Variety-Mix': 'Rosalia', // 12pm-3pm PT
  '2026-03-22_22-00-00-Variety-Mix': 'The Cure', // 3pm-6pm PT
  '2026-03-23_01-00-00-Sunday-Soul': 'Roy Ayers',
  '2026-03-23_04-00-00-Expansions': 'Waajeed',

  // Monday, March 23
  '2026-03-23_07-00-00-Midnight-in-a-Perfect-World': 'Funkadelic',
  '2026-03-23_08-00-00-Jazz-Theater': "M'Lumbo",
  '2026-03-23_08-00-00-Jazz-Theatre': "M'Lumbo",
  '2026-03-23_10-00-00-Variety-Mix': 'Don Cherry', // 3am-5am PT
  '2026-03-23_12-00-00-Early': 'Mozart',
  '2026-03-23_14-00-00-The-Morning-Show': 'The Cars',
  '2026-03-23_17-00-00-The-Midday-Show': 'Burt Bacharach',
  '2026-03-23_20-00-00-The-Afternoon-Show': 'Mazzy Star',
  '2026-03-23_23-00-00-Drive-Time': 'Janelle Monae',
  '2026-03-24_02-00-00-El-Sonido': 'Mexican Institute of Sound',
  '2026-03-24_05-00-00-Variety-Mix': 'Ela Minus', // 10pm-1am PT

  // Tuesday, March 24
  '2026-03-24_08-00-00-Variety-Mix': 'Madlib', // 1am-5am PT
  '2026-03-24_12-00-00-Early': 'The Funkees',
  '2026-03-24_14-00-00-The-Morning-Show': 'Simple Minds',
  '2026-03-24_17-00-00-The-Midday-Show': 'My Bloody Valentine',
  '2026-03-24_19-00-00-The-Afternoon-Show': 'Lauryn Hill',
  '2026-03-24_19-00-00-The-Midday-Show': 'Lauryn Hill',
  '2026-03-24_23-00-00-Drive-Time': 'Yukimi',
  '2026-03-25_02-00-00-Wo-Pop': 'Goran Bregovic',
  '2026-03-25_05-00-00-Variety-Mix': 'The Birthday Party', // 10pm-1am PT

  // Wednesday, March 25
  '2026-03-25_08-00-00-Variety-Mix': 'Boyz II Men', // 1am-5am PT
  '2026-03-25_12-00-00-Early': 'Joy Division',
  '2026-03-25_14-00-00-The-Morning-Show': 'Prince',
  '2026-03-25_17-00-00-The-Midday-Show': 'Britney Spears',
  '2026-03-25_20-00-00-The-Afternoon-Show': 'Little Richard',
  '2026-03-25_23-00-00-Drive-Time': 'Karen O',
  '2026-03-26_02-00-00-Astral-Plane': 'Spiritualized',
  '2026-03-26_05-00-00-Variety-Mix': 'David Bowie', // 10pm-1am PT

  // Thursday, March 26
  '2026-03-26_08-00-00-Variety-Mix': 'Sylvester', // 1am-5am PT
  '2026-03-26_12-00-00-Early': 'Kraftwerk',
  '2026-03-26_14-00-00-The-Morning-Show': 'Gorillaz',
  '2026-03-26_17-00-00-The-Midday-Show': 'Carrie Brownstein',
  '2026-03-26_20-00-00-The-Afternoon-Show': 'Black Sabbath',
  '2026-03-26_23-00-00-Drive-Time': 'The Muppets',
  '2026-03-27_02-00-00-Eastern-Echoes': 'Asha Puthli',
  '2026-03-27_05-00-00-Variety-Mix': 'Steve Farrone', // 10pm-1am PT

  // Friday, March 27
  '2026-03-27_08-00-00-Variety-Mix': 'Mndsgn', // 1am-5am PT
  '2026-03-27_12-00-00-Early': 'Blind Willie Johnson',
  '2026-03-27_14-00-00-The-Morning-Show': 'Mint Royale',
  '2026-03-27_17-00-00-The-Midday-Show': 'Cocteau Twins',
  '2026-03-27_20-00-00-The-Afternoon-Show': 'Oasis',
  '2026-03-27_23-00-00-Drive-Time': 'Madonna',

  // Saturday, March 28 (tail end, outside main week)
  '2026-03-28_02-00-00-The-Continent': null,
  '2026-03-28_05-00-00-Street-Sounds': null,
};

export function getHighlightedArtist(filename) {
  return HIGHLIGHTED_ARTISTS[filename] || null;
}
