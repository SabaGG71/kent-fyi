/**
 * Everything kent.fyi says, in one place. All of it comes from Kent: his portfolio deck, his messages, the
 * sites he runs (swift-demo.com, dinner.fyi) and the podcasts he listed. Nothing here is made up; where a
 * detail wasn't given (a year, a role) it is left out rather than guessed.
 */

export const EMAIL = "its@kent.fyi";
export const MANAGER = "nini@kent.fyi";
export const INSTAGRAM = "https://www.instagram.com/kent.fyi/";
export const YOUTUBE = "https://www.youtube.com/@LocalEyesSEO";

export type Link = { label: string; href: string };
export type Photo = { src: string; alt: string; position?: string };

/** the pictures the hero prints, in order: Kent first, then one per FYI */
export const PRINTS = [
  { key: "kent", src: "/kent/hero/kent.webp", photo: "/kent/photos/kent-portrait.webp", caption: "Kent Sheridan.", alt: "Kent in profile against a blue sky, in a striped shirt" },
  { key: "voila", src: "/kent/hero/voila.webp", photo: "/kent/photos/voila-box.webp", caption: "VOILA Labs: Structured, Complex and Lively espresso.", alt: "A box of three VOILA Labs espressos, wrapped in black and white marble" },
  { key: "swift", src: "/kent/hero/swift.webp", photo: "/kent/photos/swift-reach.webp", caption: "Swift Demolition, on a job in Awbrey, Bend.", alt: "A man in a cap reaching up to a door frame on a demolition job" },
  { key: "localeyes", src: "/kent/hero/localeyes.webp", photo: "/kent/photos/kent-smile.webp", caption: "Kent Sheridan, co-owner of LocalEyes Growth.", alt: "Kent smiling in a white shirt, trees behind him" },
  { key: "dinner", src: "/kent/hero/dinner.webp", photo: "/kent/photos/dinner.webp", caption: "Galileo shows the Doge of Venice his telescope, 1609. From dinner.fyi.", alt: "A painting of Galileo showing his telescope to the Doge of Venice and his court, by moonlight" },
  { key: "wine", src: "/kent/hero/wine.webp", photo: "/kent/photos/wine.webp", caption: "wine.fyi: a crate of fresh acidic white.", alt: "A crate of white wine bottles with lilac caps and a label that reads Fresh Acidic White" },
  { key: "modeling", src: "/kent/hero/model.webp", photo: "/kent/photos/kent-booth.webp", caption: "Kent, arms crossed, in a red booth.", alt: "Kent in a black t-shirt, arms crossed, in a red booth" },
  { key: "tbilisi", src: "/kent/hero/georgia.webp", photo: "/kent/photos/kent-street.webp", caption: "An old street in Georgia, by Vintage Crush.", alt: "A man in a dark jacket on an old street, by a shop sign that reads Vintage Crush" },
  { key: "podcasts", src: "/kent/hero/podcast.webp", photo: "", caption: "Kent on Visitor, Imedi L.", alt: "Kent on a pickleball court, talking to the camera" },
] as const;

/** the hero: things you should know, each pointing at its footnote below */
export const FYIS = [
  { n: 1, id: "voila", text: "I made the highest scoring instant coffee ever." },
  { n: 2, id: "swift", text: "I started a demolition company." },
  { n: 3, id: "localeyes", text: "I help coffee carts get booked." },
  { n: 4, id: "dinner", text: "We’re restarting the Lunar Society." },
  { n: 5, id: "wine", text: "There’s a wine." },
  { n: 6, id: "modeling", text: "I model and act." },
  { n: 7, id: "tbilisi", text: "I moved my family to Tbilisi." },
  { n: 8, id: "podcasts", text: "I talk about all of it on podcasts." },
] as const;

export const VOILA = {
  body: "Zane and I spent six years building VOILA, a specialty instant coffee. We learned ecommerce the hard way: conversion rates, brand, and earning trust before anyone tastes a cup.",
  score: { points: "90", source: "Coffee Review", href: "https://www.coffeereview.com/review/cirque-tarrazu-f1-natural/" },
  press: [
    { label: "The Wall Street Journal", href: "https://web.archive.org/web/20210410233709/https://graphics.wsj.com/image-grid/off-duty-coffee/" },
    { label: "Forbes", href: "https://www.forbes.com/sites/lmowery/2020/12/31/six-instant-coffees-to-seek-out/" },
    { label: "Food & Wine", href: "https://www.foodandwine.com/coffee/instant-coffee-taste-test" },
    { label: "NPR’s How I Built This", href: "" },
    { label: "Chicago Tribune", href: "https://www.chicagotribune.com/2018/09/10/specialty-instant-coffee-startups-aim-to-change-the-way-you-drink-a-cup-of-joe/" },
    { label: "Good Housekeeping", href: "https://www.goodhousekeeping.com/what-to-buy/kitchen-products/g32403995/best-instant-coffee/" },
  ] satisfies Link[],
  photos: [
    { src: "/kent/photos/voila-box.webp", alt: "Three VOILA Labs espressos in a box wrapped in blue marble, on black" },
    { src: "/kent/photos/voila-brick.webp", alt: "A VOILA Labs box on bricks against black and white marble" },
    { src: "/kent/photos/voila-pour.webp", alt: "Water poured into a glass mug of instant coffee" },
    { src: "/kent/photos/voila-glass.webp", alt: "A VOILA Labs box lying on blue glass" },
    { src: "/kent/photos/voila-sculpture.webp", alt: "A cup, capsules and boxes balanced into a sculpture" },
    { src: "/kent/photos/voila-sage.webp", alt: "A box of VOILA instant coffee among stones on a sage background", position: "60% 50%" },
    { src: "/kent/photos/voila-stir.webp", alt: "A hand stirring a mug of black coffee with a green straw" },
    { src: "/kent/photos/voila-packing.webp", alt: "A marbled VOILA Labs box on brown packing paper" },
  ] satisfies Photo[],
};

export const SWIFT = {
  href: "https://www.swift-demo.com/",
  body: "Swift does commercial and residential demolition in Bend, Oregon: quick, dust-free, and cleaned up before we leave, so the next trade can get straight to work.",
  photos: [
    { src: "/kent/photos/swift-reach.webp", alt: "A man in a cap reaching up to a door frame on a job" },
    { src: "/kent/photos/swift-ladder.webp", alt: "A crew member carrying a yellow bucket past orange ladders" },
    { src: "/kent/photos/swift-plans.webp", alt: "Two crew members in hard hats reading plans on the floor" },
    { src: "/kent/photos/swift-van.webp", alt: "A Swift van and a dumpster at a job site", position: "35% 50%" },
  ] satisfies Photo[],
};

export const LOCALEYES = {
  href: "https://localeyesgrowth.com",
  body: "LocalEyes Growth is the company I needed when I had my coffee cart in 2014. We work only with coffee carts, dessert carts and mobile bars, and get them found on Google and booked for more events.",
  quote: "You rarely lose to the better cart. You lose to the one that shows up first.",
  listen: [
    { label: "The LocalEyes Podcast: what 3 years of catering SEO taught us", href: "https://www.youtube.com/watch?v=WtfVjOL8TiU" },
    { label: "The SEO secrets that put mobile carts on page one", href: "https://www.youtube.com/watch?v=fDq7nGVi3rQ" },
    { label: "Stop using Instagram: why Google is better for your catering business", href: "https://www.youtube.com/watch?v=-z_AungLovM" },
  ] satisfies Link[],
};

export const DINNER = {
  href: "https://dinner.fyi",
  painting: {
    src: "/kent/photos/dinner.webp",
    alt: "A painting of Galileo showing his telescope to the Doge of Venice and his court, by moonlight",
  } satisfies Photo,
  caption: "Galileo shows the Doge of Venice his telescope, 1609. The painting on dinner.fyi.",
  body: "In 18th century Birmingham, the Lunar Society met for dinner once a month: builders, inventors and tinkerers at one table, on the night nearest the full moon, so they could ride home by its light. We’re restarting it.",
  terms: "Monthly. Invite only.",
};

export const WINE = {
  href: "https://wine.fyi",
  body: "Fresh, acidic and white, like the label says. More at wine.fyi.",
  photo: { src: "/kent/photos/wine.webp", alt: "A crate of white wine bottles with lilac caps, one labelled Fresh Acidic White" } satisfies Photo,
};

export const MODELING = {
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
  projects: [
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
    { name: "Chama", role: "Campaign, more soon", links: [] },
  ],
  photos: [
    { src: "/kent/photos/kent-portrait.webp", alt: "Kent in a striped shirt, in profile against a blue sky", position: "50% 30%" },
    { src: "/kent/photos/kent-walk.webp", alt: "Kent walking past a red parasol on a terrace" },
    { src: "/kent/photos/kent-booth.webp", alt: "Kent in a black t-shirt, arms crossed, in a red booth" },
    { src: "/kent/photos/kent-train.webp", alt: "Kent in a white shirt in profile, a train passing behind him", position: "78% 50%" },
    { src: "/kent/photos/kent-smile.webp", alt: "Kent smiling in a white shirt, trees behind him" },
    { src: "/kent/photos/kent-chama.webp", alt: "On set for Chama: Kent at a table, a photographer and a crew member with a light", position: "45% 50%" },
  ] satisfies Photo[],
};

export const TBILISI = {
  body: "I moved my family from Georgia, the state, to Georgia, the country. On Instagram I tell stories from here through foreign eyes: wine, food, culture, people. A new story every month.",
  links: [
    { label: "@kent.fyi on Instagram", href: INSTAGRAM },
    { label: "From Georgia to Georgia, on Imported Opinions", href: "https://www.youtube.com/watch?v=VlE71KWUACk" },
  ] satisfies Link[],
  photos: [
    { src: "/kent/photos/kent-street.webp", alt: "A man in a dark jacket on an old street in Georgia, by a shop sign that reads Vintage Crush", position: "55% 50%" },
    { src: "/kent/photos/kent-red.webp", alt: "Kent and a friend with glasses of red wine, in red light", position: "40% 50%" },
    { src: "/kent/photos/kent-balcony.webp", alt: "Two men at a railing, looking out into fog" },
  ] satisfies Photo[],
};

export const PODCASTS = [
  { show: "Imedi L", title: "Visitor: Kent Sheridan", id: "-5ziV7NblKw" },
  { show: "Imported Opinions", title: "From Georgia to Georgia: why this American moved his family to Tbilisi", id: "VlE71KWUACk" },
  { show: "ტვინის გასაღები", title: "Episode 11, with Kent Sheridan", id: "0ttH09QwcCg" },
  { show: "OWNR OPS", title: "This ex coffee entrepreneur started a 7 figure demolition business", id: "Np93LmxEh98" },
  { show: "Coffee Sometimes, Valor Coffee", title: "Kent Sheridan, the titan of specialty instant coffee", id: "ODMo_lVLnTk" },
  { show: "Keys to the Shop", title: "Instant specialty coffee, with VOILA founder Kent Sheridan", id: "g4SObFBLcMk" },
  { show: "Mobile Business School", title: "The SEO secrets that put mobile carts on page one", id: "fDq7nGVi3rQ" },
  { show: "Mobile Business School", title: "Stop using Instagram: why Google is better for your catering business", id: "-z_AungLovM" },
  { show: "Valor Coffee", title: "SEO for coffee companies: website changes you need to make today", id: "LY-r2F0tBc8" },
] as const;

/** the about page, after JJJJound's: a few plain paragraphs */
export const ABOUT = [
  "Kent Sheridan started in 2014 with a coffee cart on the back of a bike. He spent that year fixing burst water lines and popped circuits at farmers markets, then closed it. Outside the few dozen people who walked past on a Saturday, nobody knew the cart was there.",
  "So he started over. With Zane he spent six years building VOILA, a specialty instant coffee that Coffee Review scored 90 points, the highest an instant coffee has scored, and that The Wall Street Journal, Forbes and NPR’s How I Built This wrote and talked about.",
  "Then came Swift, a demolition company in Bend, Oregon, and LocalEyes Growth, the company he needed in 2014: it gets coffee carts, dessert carts and mobile bars found on Google and booked for more events.",
  "He moved his family from Georgia, the state, to Georgia, the country. From Tbilisi he models and acts, tells stories about Georgia on Instagram, is restarting the Lunar Society at dinner.fyi, and has a wine at wine.fyi.",
];
