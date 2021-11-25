//TODO: Check if user has enough currency to buy shop items
//TODO: EventHandlers for achievements

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//-----------------------------DECLARATIONS----------------------------
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

let currency = 0;
let lifetime_currency = 0;
let total_clicks = 0;
let currency_per_click = 1;
let auto_income_rate = 0;
let game_interval_timer = 1000; //Add auto income every 1000ms = 1s

var pointerX = -1;
var pointerY = -1;

let currencyElement = document.getElementById("current_balance");
let manualIncomeElement = document.getElementById("income_click");
let autoIncomeElement = document.getElementById("income_auto");

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//---------------------------DATA STRUCTURES---------------------------
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//Data Structure for buyItem(), adjust values of buyable items only here
const itemMap = {
    "shampoo" : {
        "name" : "Shampoo",
        "type" : "manual",
        "price" : 10,
        "valueToIncrease" : "currency_per_click",
        "increase" : 5,
        "img_path" : "content/icons/shampoo.jpg"
    },
    "brush" : {
        "name" : "Brush",
        "type" : "manual",
        "price" : 600,
        "valueToIncrease" : "currency_per_click",
        "increase" : 20,
        "img_path" : "content/icons/brush.jpg"
    },
    "treat" : {
        "name" : "Treat",
        "type" : "Manual",
        "price" : 2000,
        "valueToIncrease" : "currency_per_click",
        "increase" : 50,
        "img_path" : "content/icons/treat1.png"
    },
    "tree" : {
        "name" : "Tree",
        "type" : "auto",
        "price" : 200,
        "valueToIncrease" : "auto_income_rate",
        "increase" : 2,
        "img_path" : "content/icons/tree.jpg"
    }, 
    "toy" : {
        "name" : "Katzenangel",
        "type" : "auto",
        "price" : 1000,
        "valueToIncrease" : "auto_income_rate",
        "increase" : 5,
        "img_path" : "content/icons/toy1.jpg"
    },
    "buddy" : {
        "name" : "CatBuddy",
        "type" : "auto",
        "price" : 3000,
        "valueToIncrease" : "auto_income_rate",
        "increase" : 15,
        "img_path" : "content/icons/cat_friend.jpg"
    }
} 

//Data Structure for achievementCheck() adjust achievement values only here
const achievementMap = {
    "achievement1" : {
        "name" : "Achievement 1",
        "valueToCheck" : "currency",
        "valueToReach" : 20,
        "check" : true
    },
    "achievement2" : {
        "name" : "Achievement 2",
        "valueToCheck" : "currency",
        "valueToReach" : 50,
        "check" : true
    },
    "achievement3" : {
        "name" : "TBD",
        "valueToCheck" : "total_clicks",
        "valueToReach" : 100,
        "check" : true
    }
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//------------------------INITIALIZING FUNCTIONS-----------------------
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

window.onload = function() {
        addEventHandlers();
        setInterval(autoAdder, game_interval_timer);
        writeUpdates();
        writeShopPrices();

        document.onmousemove = function(event) {
            pointerX = event.pageX;
            pointerY = event.pageY;
        }
    };

function writeShopPrices() {
    for (const key in itemMap) {
        document.getElementById(key).getElementsByTagName("p1")[0].innerHTML = itemMap[key]["price"] + "$";
    }
}

//Add EventHandlers for shop elements automatically
function addEventHandlers() {
    document.getElementById("main_clicker").addEventListener("click", onMainClickerClick);

    for (const key in itemMap) {
        document.getElementById(key).addEventListener("click", buyItem);
    }
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//--------------------------UPDATE FUNCTIONS---------------------------
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function gameUpdate() {
    pointerCheck();
    writeUpdates();
    achievementCheck();
}

function pointerCheck() {
    //stub
	//console.log('Cursor at: ' + pointerX + ', ' + pointerY);
}

function writeUpdates() {
    currencyElement.innerHTML = currency;
    manualIncomeElement.innerHTML = currency_per_click;
    autoIncomeElement.innerHTML = auto_income_rate;
}

function achievementCheck() {
    for (const key in achievementMap) {
        if (achievementMap[key]["check"] == true) {
            if (eval(achievementMap[key]["valueToCheck"] + ' >= achievementMap[key]["valueToReach"]')) {
                document.getElementById(key).innerHTML = achievementMap[key]["name"] + " achieved!";
                achievementMap[key]["valueToCheck"] = false;
                return;
            }
        }
    }
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//----------------------------SHOP FUNCTIONS---------------------------
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function buyItem(evt) {
    var boughtItem = evt.currentTarget.id;

    if (!checkPrice(boughtItem)) return;
    
    eval(itemMap[boughtItem]["valueToIncrease"] + ' += itemMap[boughtItem]["increase"]');

    evt.currentTarget.removeEventListener("click", buyItem);
    evt.currentTarget.addEventListener("click", itemBoughtMessage);

    document.getElementById(boughtItem).getElementsByTagName("input")[0].src = itemMap[boughtItem]["img_path"];
}

function itemBoughtMessage(evt) {
    document.getElementById("status").innerHTML = "You already bought this item!";
}

function checkPrice(item) {
    var price = itemMap[item]["price"];

    if (price > currency) {
        document.getElementById("status").innerHTML = "You can't buy this! You need " + price + "$!";
        return false;
    } else {
        currency -= price;
        return true;
    }
}

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//-----------------------------MAIN ADDERS-----------------------------
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function onMainClickerClick () {
    currency += currency_per_click;
    total_clicks += currency_per_click;
    gameUpdate();
}

function autoAdder() {
    currency += auto_income_rate;
    gameUpdate();
}
