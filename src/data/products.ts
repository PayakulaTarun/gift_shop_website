import categoryPhoto from "@/assets/category-photo-gifts.jpg";
import categoryLed from "@/assets/category-led-gifts.jpg";
import categoryCrystal from "@/assets/category-crystal-gifts.jpg";
import categoryWooden from "@/assets/category-wooden.jpg";
import categoryArtistic from "@/assets/category-artistic.jpg";
import categoryHomeDecor from "@/assets/category-home-decor.jpg";

export interface Product {
    id: string;
    name: string;
    price: number;
    displayPrice: string;
    image: string;
    category: string;
    description: string;
    features: string[];
    rating: number;
    reviewsCount: number;
    customizationPrompt: string;
}

export const CATEGORIES = [
    "All",
    "Photo Gifts",
    "LED Gifts",
    "Crystal Gifts",
    "Wooden Engravings",
    "Artistic Gifts",
    "Home Decor"
];

export const PRODUCTS: Product[] = [
    {
        id: "led-photo-frame-1",
        name: "Classic LED Photo Frame",
        price: 1299,
        displayPrice: "₹1,299",
        image: categoryLed,
        category: "LED Gifts",
        description: "Illuminate your precious memories with this premium LED photo frame. Perfect as a bedside lamp or a living room centerpiece.",
        features: ["Warm white LED light", "Acrylic glass front", "USB powered", "Customizable text engraving"],
        rating: 4.8,
        reviewsCount: 124,
        customizationPrompt: "Enter the name, date, or short message (max 30 chars) to engrave on the acrylic frame:"
    },
    {
        id: "crystal-heart-3d",
        name: "Crystal Heart 3D Engraving",
        price: 2499,
        displayPrice: "₹2,499",
        image: categoryCrystal,
        category: "Crystal Gifts",
        description: "A stunning 3D laser-engraved heart crystal that captures details vividly. Comes with a glowing light base.",
        features: ["K9 premium crystal", "Includes LED light base", "3D laser engraving technology", "Gift-ready packaging"],
        rating: 4.9,
        reviewsCount: 208,
        customizationPrompt: "Enter up to 2 names or a short quote to be laser-engraved inside the 3D heart crystal:"
    },
    {
        id: "wooden-engraving-custom",
        name: "Custom Wooden Nameplate",
        price: 999,
        displayPrice: "₹999",
        image: categoryWooden,
        category: "Wooden Engravings",
        description: "Add a rustic charm to their desk or wall with this precision laser-cut wooden engraving. Personalize with names or quotes.",
        features: ["Natural birch wood", "High-precision laser engraving", "Eco-friendly finish", "Table stand included"],
        rating: 4.7,
        reviewsCount: 89,
        customizationPrompt: "Enter the exact name (and optional designation) to be precision-carved on the wooden plate:"
    },
    {
        id: "photo-mug-set",
        name: "Magic Photo Mug Set",
        price: 699,
        displayPrice: "₹699",
        image: categoryPhoto,
        category: "Photo Gifts",
        description: "A magical mug that reveals your hidden photo and message when hot liquid is poured. Contains a set of 2 premium ceramic mugs.",
        features: ["Color-changing magic effect", "Set of 2 mugs", "Microwave safe", "High-definition print"],
        rating: 4.5,
        reviewsCount: 312,
        customizationPrompt: "Briefly describe the theme or text you want printed on these magic mugs:"
    },
    {
        id: "canvas-portrait-painted",
        name: "Hand-Painted Canvas Portrait",
        price: 1799,
        displayPrice: "₹1,799",
        image: categoryArtistic,
        category: "Artistic Gifts",
        description: "Transform your favorite picture into a beautifully hand-painted canvas art piece crafted by our digital artists.",
        features: ["Stretched gallery-wrapped canvas", "UV-resistant inks", "Custom digital painting", "Ready to hang"],
        rating: 4.9,
        reviewsCount: 56,
        customizationPrompt: "Specify any color preferences or special notes (e.g., 'Make background solid black') for the painting team:"
    },
    {
        id: "photo-cushion-decor",
        name: "Personalized Photo Cushion",
        price: 899,
        displayPrice: "₹899",
        image: categoryHomeDecor,
        category: "Home Decor",
        description: "Cozy up your living space with a soft, personalized photo cushion. Perfect for anniversaries and birthdays.",
        features: ["Soft plush fabric", "Washable cover", "Vibrant edge-to-edge printing", "Zipper closure"],
        rating: 4.6,
        reviewsCount: 140,
        customizationPrompt: "Enter any specific text or date you want overlaid on your cushion photo:"
    },
    {
        id: "led-name-lamp",
        name: "Personalized LED Name Lamp",
        price: 1499,
        displayPrice: "₹1,499",
        image: categoryLed,
        category: "LED Gifts",
        description: "An intricate custom name cutout that lights up elegantly to bring warmth and aesthetic appeal into any bedroom.",
        features: ["16-color RGB remote control", "Dimmable", "Shatterproof acrylic", "5V USB adapter"],
        rating: 4.8,
        reviewsCount: 95,
        customizationPrompt: "Enter the EXACT name you want cut out of the acrylic for the lamp (Max 12 characters):"
    },
    {
        id: "crystal-keychain-set",
        name: "Crystal Photo Keychain Set",
        price: 499,
        displayPrice: "₹499",
        image: categoryCrystal,
        category: "Crystal Gifts",
        description: "Carry your loved ones wherever you go with this miniature 3D crystal keychain that glows seamlessly.",
        features: ["Set of 2 keychains", "Button-cell powered LED", "Durable split ring", "Scratch-resistant"],
        rating: 4.4,
        reviewsCount: 215,
        customizationPrompt: "Provide the names or initials you want to include alongside the photo in the crystals:"
    },
    {
        id: "wooden-photo-plaque",
        name: "Engraved Photo Plaque",
        price: 1199,
        displayPrice: "₹1,199",
        image: categoryWooden,
        category: "Wooden Engravings",
        description: "Your favorite photograph etched forever into solid wood. A timeless piece of art that blends with any home decor.",
        features: ["Solid wood construction", "Deep set engraving", "Wall mounting hooks", "Natural grain finish"],
        rating: 4.7,
        reviewsCount: 175,
        customizationPrompt: "Enter any special message, poem, or dedication (max 4 lines) to engrave below the photo:"
    },
    {
        id: "polaroid-photo-strings",
        name: "Retro Polaroid String Lights",
        price: 799,
        displayPrice: "₹799",
        image: categoryPhoto,
        category: "Photo Gifts",
        description: "30 custom printed polaroid style photos packed with warm white fairy LED clips to create a beautiful memory wall.",
        features: ["30 custom photo prints", "3-meter LED clip string", "Battery operated", "Glossy photo finish"],
        rating: 4.8,
        reviewsCount: 420,
        customizationPrompt: "Provide any short titles or dates you want printed at the bottom edge of the polaroids:"
    },
    {
        id: "wooden-photo-keychain",
        name: "Engraved Wooden Keychain",
        price: 299,
        displayPrice: "₹299",
        image: categoryWooden,
        category: "Wooden Engravings",
        description: "A pocket-sized lightweight wooden block precisely engraved with your photo on one side and a short text on the reverse.",
        features: ["Double-sided engraving", "Sanded smooth finish", "Sturdy metal clasp", "Eco-friendly material"],
        rating: 4.6,
        reviewsCount: 340,
        customizationPrompt: "Enter the text to be engraved on the back of the keychain (Max 20 chars):"
    },
    {
        id: "metal-photo-keychain",
        name: "Premium Metal Photo Keychain",
        price: 399,
        displayPrice: "₹399",
        image: categoryPhoto,
        category: "Photo Gifts",
        description: "A sleek, heavy-duty metallic keychain with a vibrant, high-gloss photo print encased in scratch-resistant resin.",
        features: ["Rust-proof alloy", "Resin coating", "Long-lasting vivid print", "Elegant gift box"],
        rating: 4.7,
        reviewsCount: 184,
        customizationPrompt: "Do you want any special date added to the bottom corner of the photo? If yes, provide it here:"
    },
    {
        id: "custom-leather-wallet",
        name: "Personalized Men's Leather Wallet",
        price: 899,
        displayPrice: "₹899",
        image: categoryArtistic,
        category: "Artistic Gifts",
        description: "A classic high-quality faux leather wallet featuring an elegantly embossed name and a hidden custom message inside.",
        features: ["Multiple card slots", "Premium texture", "Laser embossed details", "RFID protection"],
        rating: 4.8,
        reviewsCount: 412,
        customizationPrompt: "Enter the Name to emboss outside, and the Secret Message to engrave inside:"
    },
    {
        id: "acrylic-desk-block",
        name: "Glassy Acrylic Desk Block",
        price: 999,
        displayPrice: "₹999",
        image: categoryHomeDecor,
        category: "Home Decor",
        description: "A thick set, high-gloss acyclic block featuring a premium HD-printed photo. It stands perfectly on desks and shelves.",
        features: ["1-inch thick acrylic", "Vibrant edge-to-edge printing", "Polished borders", "Free-standing"],
        rating: 4.9,
        reviewsCount: 202,
        customizationPrompt: "Enter any short caption you'd like floating over the image:"
    }
];
