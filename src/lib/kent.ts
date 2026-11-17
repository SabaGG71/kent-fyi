/**
 * Everything kent.fyi says, in one place, in the order Kent set out: a short introduction, the current
 * selection (WINE.FYI, DINNER.FYI, KENT.FYI, LocalEyes), the earlier projects (VOILA, Swift), modeling and
 * acting, about, press and podcasts, the image archive, and how to reach him.
 *
 * All of it comes from Kent: his notes on the site, his portfolio deck, the sites he runs and the podcasts
 * he listed. Where a detail wasn't given (a year, a role) it is left out rather than guessed.
 */

export const EMAIL = "its@kent.fyi";
export const MANAGER = "nini@kent.fyi";
export const INSTAGRAM = "https://www.instagram.com/kent.fyi/";

export type Link = { label: string; href: string };
export type Photo = { src: string; alt: string; position?: string };

export const INTRO = "I’m Kent. I’m currently based in Tbilisi, Georgia, working on various projects.";
/** beside the introduction, until a project is pointed at */
export const INTRO_PHOTO: Photo = { src: "/kent/photos/kent-sky.webp", alt: "Kent in low evening sun against a deep blue sky", position: "56% 50%" };

export type Project = {
  id: string;
  name: string;
  /** what kind of thing it is, in Kent's words */
  kind: string;
  /** what it is */
  what: string;
  /** where to explore it */
  links: Link[];
  photo: Photo;
  /** its own page on this site, if it has one */
  page?: string;
};

/** the current selection, in Kent's order */
export const CURRENT: Project[] = [
  {
    id: "wine",
    name: "WINE.FYI",
    kind: "Natural wine project",
    what: "A natural white wine. Fresh, acidic and white, like the label says.",
    links: [
      { label: "About the wine", href: "/wine" },
      { label: "wine.fyi", href: "https://wine.fyi" },
    ],
    photo: { src: "/kent/photos/wine.webp", alt: "A crate of white wine bottles with lilac caps, one labelled Fresh Acidic White" },
    page: "/wine",
  },
  {
    id: "dinner",
    name: "DINNER.FYI",
    kind: "Dinner series",
    what: "In 18th century Birmingham, the Lunar Society met for dinner once a month: builders, inventors and tinkerers at one table, on the night nearest the full moon, so they could ride home by its light.",
    links: [
      { label: "About the dinners", href: "/dinner" },
      { label: "dinner.fyi", href: "https://dinner.fyi" },
    ],
    photo: { src: "/kent/photos/dinner-table.webp", alt: "A long table set in a courtyard under vines, guests along both sides, candles and wine down the middle", position: "50% 72%" },
    page: "/dinner",
  },
  {
    id: "content",
    name: "KENT.FYI",
    kind: "Content",
    what: "Stories from Georgia through foreign eyes: food, wine, culture and people. A new one every month.",
    links: [
      { label: "@kent.fyi on Instagram", href: INSTAGRAM },
      { label: "Georgia, below", href: "#georgia" },
    ],
    photo: { src: "/kent/photos/kent-street.webp", alt: "A man in a dark jacket on an old street in Georgia, by a shop sign that reads Vintage Crush", position: "55% 50%" },
  },
  {
    id: "localeyes",
    name: "LOCALEYES",
    kind: "Marketing agency",
    what: "The company I needed when I had my coffee cart in 2014. We work only with coffee carts, dessert carts and mobile bars, and get them found on Google and booked for more events.",
    links: [
      { label: "localeyesgrowth.com", href: "https://localeyesgrowth.com" },
      { label: "The LocalEyes Podcast", href: "https://www.youtube.com/watch?v=WtfVjOL8TiU" },
    ],
    photo: { src: "/kent/photos/localeyes-walk.webp", alt: "Kent in a red shirt walking past a colonnade with another man", position: "50% 40%" },
  },
];

/** the earlier projects */
export const EARLIER: Project[] = [
  {
    id: "voila",
    name: "VOILA",
    kind: "Specialty instant coffee",
    what: "Coffee Review scored it 90 points, the highest an instant coffee has scored. We learned ecommerce the hard way: conversion rates, brand, and earning trust before anyone tastes a cup.",
    links: [{ label: "The 90-point review", href: "https://www.coffeereview.com/review/cirque-tarrazu-f1-natural/" }],
    photo: { src: "/kent/photos/voila-glass.webp", alt: "A VOILA Labs box wrapped in black and white marble, lying on blue glass" },
  },
  {
    id: "swift",
    name: "SWIFT DEMOLITION",
    kind: "Demolition company",
    what: "Commercial and residential demolition in Bend, Oregon: quick, dust-free, and cleaned up before we leave, so the next trade can get straight to work.",
    links: [{ label: "swift-demo.com", href: "https://www.swift-demo.com/" }],
    photo: { src: "/kent/photos/swift-reach.webp", alt: "A man in a cap reaching up to a door frame on a Swift job" },
  },
];

/** Georgia: the content, in photographs */
export const GEORGIA = {
  title: "Georgia",
  line: "Following my curiosity for people and stories.",
  body: "I find Georgia to be one of the most interesting places to live. This small country is so rich with amazing food, wine and people.",
  links: [
    { label: "@kent.fyi on Instagram", href: INSTAGRAM },
    { label: "From Georgia to Georgia, on Imported Opinions", href: "https://www.youtube.com/watch?v=VlE71KWUACk" },
  ] satisfies Link[],
  // for now; Kent is sending a selection from his Instagram
  photos: [
    { src: "/kent/photos/kent-street.webp", alt: "A man in a dark jacket on an old street in Georgia, by a shop sign that reads Vintage Crush", position: "55% 50%" },
    { src: "/kent/photos/kent-red.webp", alt: "Kent and a friend with glasses of red wine, in red light", position: "40% 50%" },
    { src: "/kent/photos/kent-balcony.webp", alt: "Two men at a railing, looking out into fog" },
  ] satisfies Photo[],
};

export const MODELING = {
  photo: { src: "/kent/photos/kent-train.webp", alt: "Kent in a white shirt in profile, a train passing behind him", position: "78% 50%" } satisfies Photo,
  photos: [
    { src: "/kent/photos/kent-walk.webp", alt: "Kent walking past a red parasol on a terrace" },
    { src: "/kent/photos/kent-chama.webp", alt: "On set for Chama: Kent at a table, a photographer and a crew member with a light", position: "45% 50%" },
  ] satisfies Photo[],
  card: [
    { label: "Based in", value: "Tbilisi, Georgia" },
    { label: "Management", value: MANAGER, href: `mailto:${MANAGER}` },
    { label: "Instagram", value: "@kent.fyi", href: INSTAGRAM },
  ],
  numbers: [
    { figure: "12.4K", label: "followers" },
    { figure: "2.8M", label: "total views" },
    { figure: "410K", label: "top reel" },
  ],
  numbersNote: "Instagram, as of August.",
  work: [
    {
      name: "Borjomi",
      role: "Campaign",
      links: [
        { label: "Reel 1", href: "https://www.instagram.com/reel/DaQQ6Ols8hV/" },
        { label: "Reel 2", href: "https://www.instagram.com/reel/DaclWzrMyX8/" },
        { label: "Reel 3", href: "https://www.instagram.com/reel/Daclz2_sFl-/" },
      ],
    },
    {
      name: "Selkirk Sports × MZE Pickleball Club",
      role: "Creative direction and campaign production",
      links: [{ label: "View", href: "https://www.instagram.com/p/DVgh9zJiOjh/" }],
    },
    {
      name: "Imedi L, Visitor",
      role: "Television",
      links: [
        { label: "Watch", href: "https://www.youtube.com/watch?v=-5ziV7NblKw" },
        { label: "Reel", href: "https://www.instagram.com/p/DWOlM0xCEem/" },
      ],
    },
    { name: "Chama", role: "Campaign", links: [] as Link[], note: "More soon" },
  ],
};

export const ABOUT = "Kent is a multi-hyphenate creative and entrepreneur that follows his curiosities to tell compelling stories through products, content, and experiences.";

/** features: where VOILA was written up */
export const FEATURES: Link[] = [
  { label: "The Wall Street Journal", href: "https://web.archive.org/web/20210410233709/https://graphics.wsj.com/image-grid/off-duty-coffee/" },
  { label: "Forbes", href: "https://www.forbes.com/sites/lmowery/2020/12/31/six-instant-coffees-to-seek-out/" },
  { label: "Food & Wine", href: "https://www.foodandwine.com/coffee/instant-coffee-taste-test" },
  { label: "NPR’s How I Built This", href: "" },
  { label: "Chicago Tribune", href: "https://www.chicagotribune.com/2018/09/10/specialty-instant-coffee-startups-aim-to-change-the-way-you-drink-a-cup-of-joe/" },
  { label: "Good Housekeeping", href: "https://www.goodhousekeeping.com/what-to-buy/kitchen-products/g32403995/best-instant-coffee/" },
  { label: "Coffee Review, 90 points", href: "https://www.coffeereview.com/review/cirque-tarrazu-f1-natural/" },
];

export const PODCASTS = [
  { show: "Imedi L", title: "Visitor: Kent Sheridan", id: "-5ziV7NblKw" },
  { show: "Imported Opinions", title: "From Georgia to Georgia: why this American moved his family to Tbilisi", id: "VlE71KWUACk" },
  { show: "ტვინის გასაღები", title: "Episode 11, with Kent Sheridan", id: "0ttH09QwcCg" },
  { show: "OWNR OPS", title: "This ex coffee entrepreneur started a 7 figure demolition business", id: "Np93LmxEh98" },
  { show: "Coffee Sometimes, Valor Coffee", title: "Kent Sheridan, the titan of specialty instant coffee", id: "ODMo_lVLnTk" },
  { show: "Keys to the Shop", title: "Instant specialty coffee, with VOILA founder Kent Sheridan", id: "g4SObFBLcMk" },
  { show: "The LocalEyes Podcast", title: "What 3 years of catering SEO taught us", id: "WtfVjOL8TiU" },
  { show: "Mobile Business School", title: "The SEO secrets that put mobile carts on page one", id: "fDq7nGVi3rQ" },
  { show: "Mobile Business School", title: "Stop using Instagram: why Google is better for your catering business", id: "-z_AungLovM" },
  { show: "Valor Coffee", title: "SEO for coffee companies: website changes you need to make today", id: "LY-r2F0tBc8" },
] as const;

/**
 * The image archive, issue by issue, like Benjamin Edgar's image exports. This first issue is a stand-in
 * from the photographs already here; Kent is sending his own.
 */
export const ARCHIVE = {
  issue: 1,
  line: "Coffee, demolition, a few faces. Completely unorganized.",
  photos: [
    { src: "/kent/photos/voila-sculpture.webp", alt: "A cup, capsules and boxes balanced into a sculpture" },
    { src: "/kent/photos/swift-van.webp", alt: "A Swift van and a dumpster at a job site" },
    { src: "/kent/photos/voila-stir.webp", alt: "A hand stirring a mug of black coffee with a green straw" },
    { src: "/kent/photos/swift-plans.webp", alt: "Two crew members in hard hats reading plans on the floor" },
    { src: "/kent/photos/voila-sage.webp", alt: "A box of VOILA instant coffee among stones on a sage background" },
    { src: "/kent/photos/voila-metal.webp", alt: "Coffee capsules stacked in rows on black" },
    { src: "/kent/photos/swift-ladder.webp", alt: "A crew member carrying a yellow bucket past orange ladders" },
    { src: "/kent/photos/voila-pour.webp", alt: "Water poured into a glass mug of instant coffee" },
    { src: "/kent/photos/voila-concrete.webp", alt: "A VOILA Labs box on a cork disc" },
    { src: "/kent/photos/voila-pouch.webp", alt: "Two hands opening a coffee pouch against a blue sky" },
    { src: "/kent/photos/voila-tray.webp", alt: "VOILA Labs boxes in a white moulded tray" },
    { src: "/kent/photos/voila-brick.webp", alt: "A VOILA Labs box on bricks against black and white marble" },
  ] satisfies Photo[],
};

export const CONTACT = {
  line: "For partnerships, collaborations, speaking arrangements and modeling.",
};

/*
  The project pages: a title, what it is, then the particulars, and a few photographs. A value of null is
  one Kent hasn't given yet. It stays off the page until he does, so nothing on these pages is a guess.
*/
export type Detail = { label: string; value: string | null; href?: string };
export type PageSection = { id: string; title: string; aside?: string; body?: string | null; details?: Detail[] };
export type ProjectPageData = {
  id: string;
  name: string;
  kind: string;
  /** what it is, a paragraph each */
  description: string[];
  links: Link[];
  sections: PageSection[];
  photos: Photo[];
};

const wine = CURRENT[0];
const dinner = CURRENT[1];

export const WINE_PAGE: ProjectPageData = {
  id: wine.id,
  name: wine.name,
  kind: wine.kind,
  description: [wine.what],
  links: [{ label: "wine.fyi", href: "https://wine.fyi" }],
  sections: [
    {
      id: "the-wine",
      title: "The wine",
      details: [
        { label: "Style", value: "Natural white" },
        { label: "Vintage", value: null },
        { label: "Release date", value: null },
        { label: "Grape", value: "Tsolikouri" },
      ],
    },
    { id: "the-grape", title: "The grape", body: null },
    { id: "where-to-buy", title: "Where to buy", body: null },
  ],
  photos: [wine.photo, { src: "/kent/photos/vines.webp", alt: "Kent and a friend under autumn grapevines, in red work gloves", position: "45% 55%" }],
};

export const DINNER_PAGE: ProjectPageData = {
  id: dinner.id,
  name: dinner.name,
  kind: dinner.kind,
  description: [
    dinner.what,
    "We’re restarting it: a monthly dinner for builders and experimenters early in their journeys. Ten to fifteen people, highly curated, and one remarkable guest. People around the table have been working on reversing brain ageing, building rocket ships and discovering new materials with AI.",
  ],
  links: [{ label: "dinner.fyi", href: "https://dinner.fyi" }],
  sections: [
    {
      id: "format",
      title: "The format",
      details: [
        { label: "Invitation", value: "Invite only" },
        { label: "How often", value: "Monthly" },
        { label: "At the table", value: "Ten to fifteen people, and one remarkable guest" },
      ],
    },
    {
      id: "no-1",
      title: "No. 1",
      body: null,
      details: [
        { label: "Date", value: null },
        { label: "Place", value: null },
        { label: "Guest", value: null },
      ],
    },
    {
      id: "no-2",
      title: "No. 2",
      aside: "Upcoming",
      details: [
        { label: "Date", value: "The next full moon" },
        { label: "Place", value: null },
        { label: "Guest", value: null },
      ],
    },
  ],
  photos: [dinner.photo, { src: "/kent/photos/dinner.webp", alt: "A painting of Galileo showing his telescope to the Doge of Venice and his court, by moonlight" }],
};

/** the site's share card, for pages that set their own share title */
export const SHARE_CARD = {
  url: "/opengraph-image.jpg",
  width: 1200,
  height: 630,
  alt: "kent.fyi. I'm Kent, based in Tbilisi, Georgia. Current selection: WINE.FYI, DINNER.FYI, KENT.FYI, LocalEyes. Before that, VOILA and Swift Demolition.",
};
