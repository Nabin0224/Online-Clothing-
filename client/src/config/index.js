
import bag from '../assets/category/bag.jpg'
import dress from '../assets/category/dress.PNG'
import accessories from '../assets/category/accessories.PNG'
import foot from '../assets/category/foot.PNG'

export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "dress", label: "Dress" },
      { id: "bag", label: "Bags" },
      // { id: "women", label: "Women" },
      // { id: "kids", label: "Kids" },
      // { id: "accessories", label: "Accessories" },
      // { id: "footwear", label: "Footwear" },
    ],
  },
  {
    label: "Brand",
    name: "brand",
    componentType: "select",
    options: [
      { id: "no brand", label: "No Brand" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Colors",
    name: "colors",
    componentType: "color-quantity",
     options : [
      { id: "red", label: "Red", code: "#FF0000" },
      { id: "blue", label: "Blue", code: "#0000FF" },
      { id: "green", label: "Green", code: "#008000" },
      { id: "black", label: "Black", code: "#000000" },
      { id: "white", label: "White", code: "#FFFFFF" },
      { id: "pink", label: "Pink", code: "#FFC0CB" },
      { id: "brown", label: "Brown", code: "#8B4513" },
      { id: "light-brown", label: "Light Brown", code: "#D2B48C" },
      { id: "purple", label: "Purple", code: "#800080" },
      { id: "orange", label: "Orange", code: "#FFA500" },
      { id: "yellow", label: "Yellow", code: "#FFFF00" },
      { id: "grey", label: "Grey", code: "#808080" },
      { id: "navy", label: "Navy", code: "#000080" },
      { id: "maroon", label: "Maroon", code: "#800000" },
      { id: "beige", label: "Beige", code: "#F5F5DC" },
      { id: "olive", label: "Olive", code: "#808000" },
      // { id: "teal", label: "Teal", code: "#008080" },
      { id: "sky-blue", label: "Sky Blue", code: "#87CEEB" },
      { id: "peach", label: "Peach", code: "#FFE5B4" },
      // { id: "mint", label: "Mint", code: "#98FF98" },
      // { id: "mustard", label: "Mustard", code: "#FFDB58" },
      { id: "wine", label: "Wine", code: "#722F37" },
      { id: "cream", label: "Cream", code: "#FFFDD0" },
      // { id: "charcoal", label: "Charcoal", code: "#36454F" },
      // { id: "coral", label: "Coral", code: "#FF7F50" },
      // { id: "lavender", label: "Lavender", code: "#E6E6FA" },
      { id: "gold", label: "Gold", code: "#FFD700" },
      // { id: "silver", label: "Silver", code: "#C0C0C0" }
    ],
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: 'home',
    label: 'Home',
    path: '/'

  },

  {
    id: "products",
    label: "All Products",
    path: '/listing'
  },

  // {
  //   id: 'dress',
  //   label: 'Dress',
  //   path: '/listing'

  // },

  {
    id: 'bags',
    label: 'Bags',
    path: '/listing'

  },

  // {
  //   id: 'footwear',
  //   label: 'Footwear',
  //   path: '/listing'

  // },
  // {
  //   id: 'accessories',
  //   label: 'Accessories',
  //   path: '/listing'
  // },
  {
    id: 'search',
    label: 'Search',
    path: '/search'
  }
];

export const categoryOptionsMap = {
  dress: "Dress",
  bag: "Bags"
  // kids: "Kids",
  // accessories: "Accessories",
  // footwear: "Footwear",
};

export const brandOptionsMap = {
  nike: "Nike",
  adidas: "Adidas",
  puma: "Puma",
  levi: "Levi",
  zara: "Zara",
  "h&m": "H&M",
};

export const filterOptions = {
  category: [
    { id: "dress", label: "Dress" },
    { id: "bags", label: "Bags" },
    // { id: "accessories", label: "Accessories" },
    // { id: "footwear", label: "Footwear" },
  ],
  brand: [
    { id: "no brand", label: "No Brand" },
   
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [
  {
    label: "Full Name",
    name: "fullName",
    componentType: "input",
    type: "text",
    placeholder: "Enter your full name",
  },
  {
    label: "Select",
    name: "city",
    componentType: "select",
     options : [
      { id: "kathmandu", label: "Kathmandu" },
      { id: "lalitpur", label: "Lalitpur" },
      
      { id: "bhaktapur", label: "Bhaktapur" },
      { id: "achham", label: "Achham" },
      { id: "amargadhi", label: "Amargadhi" },
      { id: "arghakhanchi", label: "Arghakhanchi" },
      { id: "baglung", label: "Baglung" },
      { id: "baitadi", label: "Baitadi" },
      { id: "banepa", label: "Banepa" },
      { id: "bara", label: "Bara" },
      { id: "bardibas", label: "Bardibas" },
      { id: "bardiya", label: "Bardiya" },
      { id: "bharatpur", label: "Bharatpur" },
      { id: "bhadrapur", label: "Bhadrapur" },
      { id: "bhairahawa", label: "Bhairahawa" },
      
      { id: "bhojpur", label: "Bhojpur" },
      { id: "biratnagar", label: "Biratnagar" },
      { id: "birgunj", label: "Birgunj" },
      { id: "birtamode", label: "Birtamode" },
      { id: "chandrapur", label: "Chandrapur" },
      { id: "charikot", label: "Charikot" },
      { id: "chautara", label: "Chautara" },
      { id: "chitwan", label: "Chitwan" },
      { id: "dadeldhura", label: "Dadeldhura" },
      { id: "dailekh", label: "Dailekh" },
      { id: "damauli", label: "Damauli" },
      { id: "damak", label: "Damak" },
      { id: "dang", label: "Dang" },
      { id: "darchula", label: "Darchula" },
      { id: "dasharathchand", label: "Dasharathchand" },
      { id: "dhanusha", label: "Dhanusha" },
      { id: "dharan", label: "Dharan" },
      { id: "dhading", label: "Dhading" },
      { id: "dhankuta", label: "Dhankuta" },
      { id: "dholkha", label: "Dolakha" },
      { id: "dolpa", label: "Dolpa" },
      { id: "diktel", label: "Diktel" },
      { id: "dipayal silgadhi", label: "Dipayal Silgadhi" },
      { id: "doti", label: "Doti" },
      { id: "dhulikhel", label: "Dhulikhel" },
      { id: "dhunche", label: "Dhunche" },
      { id: "gorkha", label: "Gorkha" },
      { id: "gaighat", label: "Gaighat" },
      { id: "ghorahi", label: "Ghorahi" },
      { id: "gulariya", label: "Gulariya" },
      { id: "gulmi", label: "Gulmi" },
      { id: "hetauda", label: "Hetauda" },
      { id: "humla", label: "Humla" },
      { id: "ilam", label: "Ilam" },
      { id: "inaruwa", label: "Inaruwa" },
      { id: "itahari", label: "Itahari" },
      { id: "jajarkot", label: "Jajarkot" },
      { id: "janakpur", label: "Janakpur" },
      { id: "jaleshwar", label: "Jaleshwar" },
      { id: "jhapa", label: "Jhapa" },
      { id: "jhumla", label: "Jumla" },
      { id: "jiri", label: "Jiri" },
      { id: "kailali", label: "Kailali" },
      { id: "kalaiya", label: "Kalaiya" },
      { id: "kalikot", label: "Kalikot" },
      { id: "kaski", label: "Kaski" },
      
      { id: "kanchanpur", label: "Kanchanpur" },
      { id: "kapilvastu", label: "Kapilvastu" },
      { id: "kawasoti", label: "Kawasoti" },
      { id: "kavrepalanchok", label: "Kavrepalanchok" },
      { id: "khandbari", label: "Khandbari" },
      { id: "khotang", label: "Khotang" },
      { id: "lahan", label: "Lahan" },
     
      { id: "lamjung", label: "Lamjung" },
      { id: "mahendranagar", label: "Mahendranagar" },
      { id: "mahottari", label: "Mahottari" },
      { id: "malangwa", label: "Malangwa" },
      { id: "manang", label: "Manang" },
      { id: "manma", label: "Manma" },
      { id: "makwanpur", label: "Makwanpur" },
      { id: "mangalsen", label: "Mangalsen" },
      { id: "martadi", label: "Martadi" },
      { id: "mechinagar", label: "Mechinagar" },
      { id: "morag", label: "Morang" },
      { id: "musikot", label: "Musikot" },
      { id: "mugu", label: "Mugu" },
      { id: "mustang", label: "Mustang" },
      { id: "myagdi", label: "Myagdi" },
      { id: "nawalpur", label: "Nawalpur" },
      { id: "nepalgunj", label: "Nepalgunj" },
      { id: "nuwakot", label: "Nuwakot" },
      { id: "okhaldhunga", label: "Okhaldhunga" },
      { id: "palpa", label: "Palpa" },
      { id: "panchthar", label: "Panchthar" },
      { id: "panauti", label: "Panauti" },
      { id: "parbat", label: "Parbat" },
      { id: "parsa", label: "Parsa" },
      { id: "parasi", label: "Parasi" },
      { id: "phidim", label: "Phidim" },
      { id: "pokhara", label: "Pokhara" },
      { id: "putalibazar", label: "Putalibazar" },
      { id: "pyuthan", label: "Pyuthan" },
      { id: "rajapur", label: "Rajapur" },
      { id: "rajbiraj", label: "Rajbiraj" },
      { id: "ramechhap", label: "Ramechhap" },
      { id: "rasuwa", label: "Rasuwa" },
      { id: "rautahat", label: "Rautahat" },
      { id: "rolpa", label: "Rolpa" },
      { id: "rukum east", label: "Rukum East" },
      { id: "rukum west", label: "Rukum West" },
      { id: "rukumkot", label: "Rukumkot" },
      { id: "rupandehi", label: "Rupandehi" },
      { id: "salyan", label: "Salyan" },
      { id: "sankhuwasabha", label: "Sankhuwasabha" },
      { id: "sandhikharka", label: "Sandhikharka" },
      { id: "saptari", label: "Saptari" },
      { id: "sarlahi", label: "Sarlahi" },
      { id: "sindhuli", label: "Sindhuli" },
      { id: "sindhupalchok", label: "Sindhupalchok" },
      { id: "siraha", label: "Siraha" },
      { id: "solukhumbu", label: "Solukhumbu" },
      { id: "simikot", label: "Simikot" },
      { id: "sunari", label: "Sunsari" },
      { id: "syangja", label: "Syangja" },
      { id: "tanahun", label: "Tanahun" },
      { id: "taplejung", label: "Taplejung" },
      { id: "tansen", label: "Tansen" },
      { id: "terhathum", label: "Terhathum" },
      { id: "tikapur", label: "Tikapur" },
      { id: "triveni", label: "Triveni" },
      { id: "tulsipur", label: "Tulsipur" },
      { id: "udayapur", label: "Udayapur" },
      { id: "waling", label: "Waling" }
    ]
    
    // placeholder: "Enter your city",
  },

  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
 
  
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Nearest Landmark",
    name: "nearest_landmark",
    componentType: "textarea",
    type: "text",
    placeholder: "Enter any additional notes",
  },
];

 export const categoriesWithImage = [
    { id: "dress", label: "Dress", image  : dress},
      { id: "bag", label: "Bag" , image : bag},
      { id: "footwear", label: "Footwear", image : foot },
      { id: "accessories", label: "Accessories", image : accessories },
  
]

