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
export const VOILA_INSTAGRAM = "https://www.instagram.com/voila.coffee/";

export type Link = { label: string; href: string };
export type Photo = { src: string; alt: string; position?: string };

export const INTRO = "I’m Kent. I’m currently based in Tbilisi, Georgia, working on various projects.";
/** beside the introduction, until a project is pointed at */
export const INTRO_PHOTO: Photo = { src: "/kent/photos/kent-sky-crop.webp", alt: "Kent in low evening sun against a deep blue sky" };

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
  /** where it was written up */
  press?: Link[];
};

/**
 * What Kent would like to work on next, after Playlab's "We would like to". Each has its own page: what the idea
 * is, then the references, one under the other with a short caption, then how to make it happen. References
 * are Kent's to add; until he does, a page is just the idea.
 */
/** a reference image: someone else's work, so it carries a small credit linking back to them */
export type Reference = Photo & { caption?: string; credit?: Link };
export type IdeaSection = { title: string; body: string[] };
export type Idea = {
  slug: string;
  /** finishes the sentence "I would like to…" */
  title: string;
  /** one line, for search and share cards */
  short: string;
  /** its own page, in Kent's words. An idea without one is just a line in the list */
  page?: {
    /** the idea, a paragraph each */
    body: string[];
    sections: IdeaSection[];
    /** the last word: how to get in touch */
    close?: string;
    references: Reference[];
  };
};

export const NEXT: Idea[] = [
  {
    slug: "jewelry",
    title: "Release a limited custom jewelry piece with a Georgian designer",
    short: "One piece, limited, co-designed with a Georgian designer. Something to wear every single day.",
    page: {
      body: [
        "I want to make a piece of jewelry. One piece, limited, co-designed with a Georgian designer. Probably a bracelet but I’m not married to it, could be a ring or a chain if that’s where it goes.",
        "The only real rule is I have to want to wear it every single day. Not a statement piece, not something for photos. The thing on my wrist when I’m at the office, at the court, at a supra, on a plane. And it has to have some connection to my life here and to Georgia. Not in a souvenir way. Nobody wants a tiny qvevri charm. More like, if you know you know.",
      ],
      sections: [
        {
          title: "Where my head is at, taste wise",
          body: [
            "If I had to put it in a sentence: niche luxury you have to be in the know to clock, a bit playful, grounded in daily routine. Weight to it. Texture over polish. Silver probably. Maybe one tiny detail that’s only for me.",
          ],
        },
        {
          title: "How the collab works",
          body: [
            "You design and make it with me. I promote it. I film the whole thing, the workshop, the sketches, us figuring it out, the drop. I take a piece or two or three for myself. You keep the sales. I’m not asking for a cut, maybe we talk about it later if it makes sense but that’s not what this is about. It’s about making something I want to exist and putting someone I believe in on to a bigger audience.",
            "My audience is foreigners living in Georgia and people in Europe and the States who are looking at Georgia. IG is doing around 2M views a month, 16K followers heading to 20K. YouTube is smaller but those people actually move here. When it’s out I want to do a proper press release here and in Europe. Not merch energy, more like Georgian craft meets a guy who built a life here.",
          ],
        },
        {
          title: "Selling it",
          body: [
            "Online I think we lean on whatever you already have, your stockists, Farfetch if you’re on it, plus a page on my site that everything points to. In person I want to do a small launch here, probably a dinner, the piece on the table, and maybe a short pop-up at a store you’re already in.",
          ],
        },
        {
          title: "Timeline",
          body: [
            "Months not weeks. I want to wear the thing for a while before we call it done. I’m very patient with this and I’m only doing it with someone I actually connect with and trust. Not looking for the world. Just want it to be nice.",
          ],
        },
        {
          title: "What comes after",
          body: [
            "This is the first physical thing under FYI. After this it’s fragrance or interior objects. Then interior design, maybe real estate projects. Who knows. But the first one has to be right.",
          ],
        },
      ],
      close: "If this sounds like you, DM me. Coffee, or I come by your studio.",
      references: [
        { src: "/kent/photos/jewelry-bleue-ashdown.webp", alt: "A silver link bracelet of textured, branch-like bars joined by small rings", caption: "Bleue Burnham, Ashdown Oak bracelet", credit: { label: "@bleueburnham", href: "https://www.instagram.com/bleueburnham/" } },
        { src: "/kent/photos/jewelry-bleue-ashdown-wrist.webp", alt: "Two Ashdown Oak bracelets, silver and gold, worn together on a wrist", caption: "Bleue Burnham, Ashdown Oak, worn", credit: { label: "@bleueburnham", href: "https://www.instagram.com/bleueburnham/" } },
        { src: "/kent/photos/jewelry-ninu-signet.webp", alt: "A molten-textured silver signet ring set with a small citrine, NINU stamped inside", caption: "Ninu, silver signet with citrine", credit: { label: "@ninu_the_jeweler", href: "https://www.instagram.com/ninu_the_jeweler/" } },
        { src: "/kent/photos/jewelry-homer-heart.webp", alt: "A heart-shaped stone ring on a ribbed band, shown from the front and the back", caption: "Homer, heart ring", credit: { label: "@homer", href: "https://www.instagram.com/homer/" } },
        { src: "/kent/photos/jewelry-bleue-rose-garden.webp", alt: "A textured signet set with pink stones, on a hand in a jeans pocket", caption: "Bleue Burnham, Rose Garden Signet", credit: { label: "@bleueburnham", href: "https://www.instagram.com/bleueburnham/" } },
        { src: "/kent/photos/jewelry-bleue-sky.webp", alt: "A gold signet with a nugget-textured face set with six blue diamonds", caption: "Bleue Burnham, signet with blue diamonds", credit: { label: "@bleueburnham", href: "https://www.instagram.com/bleueburnham/" } },
        { src: "/kent/photos/jewelry-ron-louis.webp", alt: "Two rings on a hand against concrete, a kite-shaped stone and an emerald-cut blue stone", caption: "Ron Louis, pinky rings", credit: { label: "@ron_louis", href: "https://www.instagram.com/ron_louis/" } },
      ],
    },
  },
  {
    slug: "fragrance",
    title: "Design a memorable fragrance for everyday wear",
    short: "A fragrance of my own: memorable, and made for every day.",
    page: {
      body: ["I’d like to design a fragrance. Something memorable, made for everyday wear."],
      sections: [],
      references: [],
    },
  },
  { slug: "object", title: "Co-design a somewhat useless object for home", short: "A somewhat useless object for the home, co-designed." },
  { slug: "real-estate", title: "Take on a real estate project in Tbilisi", short: "A real estate project in Tbilisi." },
  { slug: "cafe", title: "Collaborate on a forward thinking cafe or coffee concept", short: "A forward thinking cafe or coffee concept." },
];

/** the current selection, in Kent's order */
export const CURRENT: Project[] = [
  {
    id: "wine",
    name: "WINE.FYI",
    kind: "Natural wine project",
    what: "Ori Tsolikouri, a natural white made from two kinds of one grape. Bright, fresh, acidic, stark, crunchy, salty, intense. 2025 vintage, 222 bottles.",
    links: [
      { label: "About the wine", href: "/wine" },
    ],
    photo: { src: "/kent/photos/wine.webp", alt: "A turquoise crate of white wine bottles with lilac caps, one labelled Fresh Acidyc White, Ori Tsolikouri" },
    page: "/wine",
  },
  {
    id: "dinner",
    name: "DINNER.FYI",
    kind: "Dinner series",
    what: "A recurring dinner series that seats 18 of Tbilisi’s most interesting people at one table. Each edition has a theme carried through the room, the menu and the wine.",
    links: [
      { label: "About the dinners", href: "/dinner" },
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
    photo: { src: "/kent/photos/kent-booth.webp", alt: "Kent, arms crossed, in a red leather booth under old wooden windows", position: "50% 40%" },
  },
  {
    id: "localeyes",
    name: "LOCALEYES",
    kind: "Growth agency",
    what: "A boutique growth agency for mobile event businesses. We've stacked #1 rankings for clients in almost every major city in the US, and built the industry's leading websites for caterers and ecommerce brands.",
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
    // shortened from the story Kent wrote for voila.coffee
    what: "Specialty instant coffee. I started VOILA in 2016 to make great coffee approachable, then spent almost two years developing a new processing technique so instant could taste like the coffee it came from. It launched in 2017: a clean, transparent, vibrant filter-style cup, and proof that instant could be specialty.",
    links: [
      { label: "@voila.coffee on Instagram", href: VOILA_INSTAGRAM },
      { label: "The 90-point review", href: "https://www.coffeereview.com/review/cirque-tarrazu-f1-natural/" },
    ],
    press: [
      { label: "Chicago Tribune", href: "https://www.chicagotribune.com/2018/09/10/specialty-instant-coffee-startups-aim-to-change-the-way-you-drink-a-cup-of-joe/" },
      { label: "Forbes", href: "https://www.forbes.com/sites/lmowery/2020/12/31/six-instant-coffees-to-seek-out/" },
      { label: "The Wall Street Journal", href: "https://web.archive.org/web/20210410233709/https://graphics.wsj.com/image-grid/off-duty-coffee/" },
      { label: "Food & Wine", href: "https://www.foodandwine.com/coffee/instant-coffee-taste-test" },
      { label: "Good Housekeeping", href: "https://www.goodhousekeeping.com/what-to-buy/kitchen-products/g32403995/best-instant-coffee/" },
      { label: "NPR’s How I Built This", href: "" },
    ],
    photo: { src: "/kent/photos/voila-hand.webp", alt: "Two hands passing a VOILA Discovery box against a warm cream wall, one lifting its lid", position: "50% 42%" },
  },
  {
    id: "swift",
    name: "SWIFT DEMOLITION",
    kind: "Demolition company",
    what: "Commercial and residential demolition in Bend, Oregon: quick, dust-free, and cleaned up before we leave, so the next trade can get straight to work.",
    links: [{ label: "swift-demo.com", href: "https://www.swift-demo.com/" }],
    photo: { src: "/kent/photos/swift-bucket.webp", alt: "A Swift crew member in a hard hat carrying a yellow bucket past orange and blue ladders" },
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
    { src: "/kent/photos/georgia-horse.webp", alt: "A boy riding a horse bareback across a mountain meadow, a village and pine forest behind", position: "45% 50%" },
    { src: "/kent/photos/georgia-church.webp", alt: "A small wooden church with a cross on its roof, under white clouds" },
    { src: "/kent/photos/kent-red.webp", alt: "Kent and a friend with glasses of red wine, in red light", position: "40% 50%" },
    { src: "/kent/photos/georgia-cow-hill.webp", alt: "A brown cow grazing on a steep green hillside, pines and cloud above" },
    { src: "/kent/photos/kent-balcony.webp", alt: "Two men at a railing, looking out into fog" },
    { src: "/kent/photos/georgia-meadow.webp", alt: "A cow grazing on a rolling green meadow, a mast on the hilltop", position: "65% 50%" },
    { src: "/kent/photos/vines.webp", alt: "Kent and a friend under autumn grapevines, in red work gloves", position: "45% 55%" },
    { src: "/kent/photos/georgia-cows.webp", alt: "Three brown cows on a road by a mossy rock face", position: "70% 50%" },
    { src: "/kent/photos/georgia-bmw.webp", alt: "A red BMW with its door open in a mountain car park, a bouncy castle behind it", position: "35% 50%" },
    { src: "/kent/photos/dinner-table.webp", alt: "A long table set in a courtyard under vines, guests along both sides, candles and wine down the middle", position: "50% 72%" },
  ] satisfies Photo[],
};

/** KENT.FYI on YouTube: the channel, and three videos */
export const YOUTUBE = {
  channel: "https://www.youtube.com/@kentfyi",
  handle: "@kentfyi",
  videos: [
    { id: "s7SWJymYjB0", title: "This Is Where Wine Was Born (I Made It Here)" },
    { id: "RqTxR8iGoVQ", title: "Cost of Living in Tbilisi, Georgia: Budget to Luxury Living" },
    { id: "TDlQuTra2WI", title: "I Changed Specialty Coffee… but Still Lost It All" },
  ],
};

export const MODELING = {
  photo: { src: "/kent/photos/kent-pool.webp", alt: "Kent in a pink shirt on a lounger by a pool at golden hour, a woman in yellow walking past behind him", position: "60% 50%" } satisfies Photo,
  photos: [
    { src: "/kent/photos/kent-walk.webp", alt: "Kent walking past a red parasol on a terrace" },
    { src: "/kent/photos/kent-chama.webp", alt: "On set for Chama: Kent at a table, a photographer and a crew member with a light", position: "45% 50%" },
  ] satisfies Photo[],
  /** the Borjomi campaign reel, played on the page */
  reel: { title: "Borjomi, campaign", url: "https://www.instagram.com/reel/DaQQ6Ols8hV/" },
  card: [
    { label: "Based in", value: "Tbilisi, Georgia" },
    { label: "Management", value: MANAGER, href: `mailto:${MANAGER}` },
    { label: "Instagram", value: "@kent.fyi", href: INSTAGRAM },
  ],
  numbers: [
    { figure: "16.5K", label: "followers" },
    { figure: "2.8M", label: "total views" },
    { figure: "410K", label: "top reel" },
  ],
  numbersNote: "Instagram, as of November.",
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

/**
 * Features: the conversations worth hearing, newest first, kept short. The VOILA write-ups live under VOILA.
 */
export const FEATURES = [
  { show: "ტვინის გასაღები", title: "Episode 11, with Kent Sheridan", id: "0ttH09QwcCg", year: 2026 },
  { show: "Imported Opinions", title: "From Georgia to Georgia: why this American moved his family to Tbilisi", id: "VlE71KWUACk", year: 2025 },
  { show: "OWNR OPS", title: "This ex coffee entrepreneur started a 7 figure demolition business", id: "Np93LmxEh98", year: 2025 },
  { show: "Coffee Sometimes, Valor Coffee", title: "Kent Sheridan, the titan of specialty instant coffee", id: "ODMo_lVLnTk", year: 2022 },
  { show: "Keys to the Shop", title: "Instant specialty coffee, with VOILA founder Kent Sheridan", id: "g4SObFBLcMk", year: 2018 },
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
    { src: "/kent/photos/voila-stir.webp", alt: "A hand stirring a glass mug of black coffee with a green straw" },
    { src: "/kent/photos/voila-cirque.webp", alt: "A packet of VOILA Cirque tipped into a teal glass mug held by another hand" },
    { src: "/kent/photos/swift-plans.webp", alt: "Two crew members in hard hats reading plans on the floor" },
    { src: "/kent/photos/voila-sage.webp", alt: "A box of VOILA instant coffee among stones on a sage background" },
    { src: "/kent/photos/voila-metal.webp", alt: "Coffee capsules stacked in rows on black" },
    { src: "/kent/photos/swift-ladder.webp", alt: "A crew member carrying a yellow bucket past orange ladders" },
    { src: "/kent/photos/voila-pour.webp", alt: "Water poured into a glass mug of instant coffee" },
    { src: "/kent/photos/voila-concrete.webp", alt: "A VOILA Labs box on a cork disc" },
    { src: "/kent/photos/voila-pouch.webp", alt: "Two hands opening a coffee pouch against a blue sky" },
    { src: "/kent/photos/voila-tray.webp", alt: "VOILA Labs boxes in a white moulded tray" },
    { src: "/kent/photos/voila-brick.webp", alt: "A VOILA Labs box on bricks against black and white marble" },
    { src: "/kent/photos/kent-sea.webp", alt: "Two men on pale rocks above clear turquoise water" },
    { src: "/kent/photos/voila-lotus.webp", alt: "VOILA boxes and pouches among lotus-root slices on blue, seen from above" },
    { src: "/kent/photos/swift-team.webp", alt: "Kent in a Swift t-shirt, arms crossed, in a stripped-out kitchen" },
    { src: "/kent/photos/voila-bichroic.webp", alt: "Coffee capsules stacked on iridescent red and violet film" },
    { src: "/kent/photos/kent-snow.webp", alt: "Kent in ski goggles and a grey shell jacket, in a snowy birch wood" },
    { src: "/kent/photos/voila-blue.webp", alt: "A VOILA Labs box in black and white marble paper against rippled blue glass" },
    { src: "/kent/photos/kent-train-bw.webp", alt: "Kent in profile in black and white, a train passing behind him", position: "78% 50%" },
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
  description: [
    "Ori Tsolikouri is a single grape blend: two kinds of Tsolikouri in one bottle. A third is Golden Tsolikouri from Imereti, two thirds Green Tsolikouri from Lechkhumi.",
    "Bright, fresh, acidic, stark, crunchy, salty, intense. Fresh, acidic and white, like the label says.",
  ],
  links: [],
  sections: [
    {
      id: "the-wine",
      title: "The wine",
      details: [
        { label: "Name", value: "Ori Tsolikouri" },
        { label: "Style", value: "Natural white" },
        { label: "Vintage", value: "2025" },
        { label: "Bottles", value: "222" },
        { label: "Release", value: "December 2026" },
      ],
    },
    {
      id: "the-grape",
      title: "The grape",
      details: [
        { label: "Grape", value: "Tsolikouri, a single grape blend" },
        { label: "One third", value: "Golden Tsolikouri, from Imereti" },
        { label: "Two thirds", value: "Green Tsolikouri, from Lechkhumi" },
      ],
    },
    {
      id: "tasting",
      title: "In the glass",
      body: "Bright, fresh, acidic, stark, crunchy, salty, intense.",
    },
    { id: "where-to-buy", title: "Where to buy", body: null },
    {
      id: "the-making",
      title: "The making",
      details: [{ label: "Watch", value: "This Is Where Wine Was Born (I Made It Here)", href: "https://www.youtube.com/watch?v=s7SWJymYjB0" }],
    },
  ],
  photos: [
    wine.photo,
    { src: "/kent/photos/wine-label.webp", alt: "The label: Fresh Acidyc White, Ori Tsolikouri, in black on lilac" },
    { src: "/kent/photos/wine-chat-plans.webp", alt: "A screenshot of the IGAVI x KENT.FYI group chat planning releases: 222 bottles of Ori Tsolikouri in November, more in spring and fall" },
    { src: "/kent/photos/winery-thief.webp", alt: "Kent filming as the winemaker draws wine from a barrel with a glass thief at the cellar door" },
    { src: "/kent/photos/winery-taste.webp", alt: "Kent nosing a glass of white wine outside the stone cellar" },
    { src: "/kent/photos/wine-pour.webp", alt: "A glass poured for two people at a tasting, plants in the window behind" },
    { src: "/kent/photos/winery-dog.webp", alt: "A wooden granary and a stone cellar in a green yard, a dog in the grass" },
    { src: "/kent/photos/wine-glasses.webp", alt: "Two glasses of pale pink wine and a dark bottle on a blue table, from above" },
    { src: "/kent/photos/winery-sip.webp", alt: "Kent tasting from a glass against the cellar wall, camera in hand" },
    { src: "/kent/photos/wine-laptop.webp", alt: "A bottle of Fresh Acidyc White on a laptop screen, the label design open beside it" },
    { src: "/kent/photos/winery-walk.webp", alt: "Someone walking into the stone cellar past the wooden granary" },
    { src: "/kent/photos/wine-table.webp", alt: "Hands pouring and reaching across a table crowded with bottles and glasses" },
    { src: "/kent/photos/winery-pour.webp", alt: "The winemaker holding up a glass of white wine by the cellar door" },
    { src: "/kent/photos/wine-chat-styles.webp", alt: "A screenshot of the group chat trading reference bottles for a spring Nuria style and a winter Dzelshavi style" },
    { src: "/kent/photos/wine-laugh.webp", alt: "A woman in glasses laughing at a tasting, a man smiling behind her" },
    { src: "/kent/photos/winery-table.webp", alt: "Glasses of rosé and a bottle on a wooden table in the yard, the cellar behind" },
    { src: "/kent/photos/vines.webp", alt: "Kent and a friend under autumn grapevines, in red work gloves" },
    { src: "/kent/photos/wine-bar.webp", alt: "A wooden bar lined with open bottles and glasses, lit by flash at night" },
    { src: "/kent/photos/wine-orange.webp", alt: "Glasses of amber wine and a bottle on a pale table" },
  ],
};

export const DINNER_PAGE: ProjectPageData = {
  id: dinner.id,
  name: dinner.name,
  kind: dinner.kind,
  description: [
    "DINNER.FYI is a recurring dinner series by kent.fyi that seats 18 of Tbilisi’s most interesting people at one table. Each edition has a theme carried through the room, the menu and the wine.",
    "No. 2 is a winter dinner at Poliphonia: an evening that travels from cold to warm.",
  ],
  links: [],
  sections: [
    {
      id: "format",
      title: "The format",
      details: [
        { label: "City", value: "Tbilisi" },
        { label: "At the table", value: "18 people, one table" },
        { label: "Each edition", value: "A theme carried through the room, the menu and the wine" },
      ],
    },
    {
      id: "no-2",
      title: "No. 2",
      aside: "Upcoming",
      details: [
        { label: "Season", value: "Winter" },
        { label: "Place", value: "Poliphonia" },
        { label: "Theme", value: "From cold to warm" },
        { label: "Date", value: null },
      ],
    },
    {
      id: "no-1",
      title: "No. 1",
      body: null,
      details: [
        { label: "Date", value: null },
        { label: "Place", value: null },
        { label: "Theme", value: null },
      ],
    },
  ],
  photos: [dinner.photo],
};

/** the site's share card, for pages that set their own share title */
export const SHARE_CARD = {
  url: "/opengraph-image.jpg",
  width: 1200,
  height: 630,
  alt: "kent.fyi. I'm Kent, based in Tbilisi, Georgia. Current selection: WINE.FYI, DINNER.FYI, KENT.FYI, LocalEyes. Before that, VOILA and Swift Demolition.",
};
