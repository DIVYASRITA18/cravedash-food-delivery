const foods = [
  {id:1,name:"Truffle Margherita",restaurant:"La Piazza",category:"Pizza",price:349,rating:4.9,time:"25-30 min",image:"https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",badge:"Bestseller"},
  {id:2,name:"Smoky Chicken Burger",restaurant:"Burger House",category:"Burger",price:279,rating:4.8,time:"20-25 min",image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",badge:"Popular"},
  {id:3,name:"Spicy Ramen Bowl",restaurant:"Tokyo Bowl",category:"Asian",price:319,rating:4.7,time:"25-35 min",image:"https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",badge:"Chef's pick"},
  {id:4,name:"Peri Peri Chicken",restaurant:"Fire & Grill",category:"Chicken",price:399,rating:4.8,time:"30-35 min",image:"https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80",badge:"Trending"},
  {id:5,name:"Green Goddess Bowl",restaurant:"Fresh Fork",category:"Healthy",price:289,rating:4.6,time:"20-25 min",image:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",badge:"Healthy"},
  {id:6,name:"Classic Cheesecake",restaurant:"Sweet Crumbs",category:"Dessert",price:219,rating:4.9,time:"20-30 min",image:"https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80",badge:"Loved"},
  {id:7,name:"Creamy Alfredo Pasta",restaurant:"Casa Verde",category:"Pizza",price:329,rating:4.7,time:"25-30 min",image:"https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=800&q=80",badge:"New"},
  {id:8,name:"Mango Bubble Tea",restaurant:"Tea Street",category:"Drinks",price:159,rating:4.8,time:"15-20 min",image:"https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=800&q=80",badge:"Refreshing"}
];

let cart = JSON.parse(localStorage.getItem("craveCart") || "[]");
let currentCategory = "All";

function enterStore(){
  const intro=document.getElementById("intro");
  intro.style.opacity="0";
  intro.style.transition="opacity .5s";
  setTimeout(()=>{intro.classList.add("hidden");document.getElementById("app").classList.remove("hidden");},500);
}

function foodCard(f){
  return `<article class="food-card">
    <div class="food-img">
      <img src="${f.image}" alt="${f.name}">
      <span class="badge">${f.badge}</span>
      <button class="heart" onclick="toast('Added to favorites ❤️')">♡</button>
    </div>
    <div class="food-info">
      <h4>${f.name}</h4><p>${f.restaurant} • ${f.time}</p>
      <div class="food-meta"><span class="rating">⭐ ${f.rating}</span><span class="price">₹${f.price}</span></div>
      <button class="add-btn" style="margin-top:12px;width:100%" onclick="addToCart(${f.id})">+ Add to cart</button>
    </div>
  </article>`;
}

function renderFoods(list=foods){
  document.getElementById("foodGrid").innerHTML = list.length ? list.map(foodCard).join("") : `<div style="grid-column:1/-1;text-align:center;padding:50px;color:#888">No food found. Try another search.</div>`;
}

function renderRestaurants(){
  document.getElementById("allRestaurants").innerHTML=foods.map(foodCard).join("");
}

function filterCategory(category,btn){
  currentCategory=category;
  document.querySelectorAll(".category").forEach(x=>x.classList.remove("active"));
  btn.classList.add("active");
  const result=category==="All"?foods:foods.filter(f=>f.category===category);
  renderFoods(result);
}

function searchFood(){
  const q=document.getElementById("searchInput").value.toLowerCase().trim();
  const base=currentCategory==="All"?foods:foods.filter(f=>f.category===currentCategory);
  renderFoods(base.filter(f=>(f.name+" "+f.restaurant+" "+f.category).toLowerCase().includes(q)));
}

function addToCart(id){
  const item=cart.find(x=>x.id===id);
  if(item)item.qty++;
  else cart.push({...foods.find(x=>x.id===id),qty:1});
  saveCart(); renderCart(); updateCount(); toast("Added to your cart 🛒");
}

function changeQty(id,delta){
  const item=cart.find(x=>x.id===id); if(!item)return;
  item.qty+=delta;
  if(item.qty<=0)cart=cart.filter(x=>x.id!==id);
  saveCart();renderCart();updateCount();
}

function saveCart(){localStorage.setItem("craveCart",JSON.stringify(cart))}
function updateCount(){document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0)}

function renderCart(){
  const box=document.getElementById("cartItems"),bottom=document.getElementById("cartBottom");
  if(!cart.length){
    box.innerHTML=`<div style="text-align:center;padding:80px 15px;color:#888"><div style="font-size:55px">🛒</div><h3 style="color:#222;margin:15px">Your cart is empty</h3><p>Add something delicious to get started.</p></div>`;
    bottom.innerHTML=""; return;
  }
  box.innerHTML=cart.map(x=>`<div class="cart-item">
    <img src="${x.image}" alt="${x.name}">
    <div class="cart-item-main"><strong>${x.name}</strong><small>₹${x.price} each</small>
    <div class="qty"><button onclick="changeQty(${x.id},-1)">−</button><span>${x.qty}</span><button onclick="changeQty(${x.id},1)">+</button></div></div>
    <span class="cart-item-price">₹${x.price*x.qty}</span>
  </div>`).join("");
  const total=cart.reduce((s,x)=>s+x.price*x.qty,0);
  bottom.innerHTML=`<div class="total-row"><span>Total</span><span>₹${total}</span></div><button class="checkout" onclick="checkout()">Proceed to checkout →</button>`;
}

function toggleCart(){
  document.getElementById("cart").classList.toggle("open");
  document.getElementById("overlay").classList.toggle("show");
  renderCart();
}

function checkout(){
  if(!cart.length)return;
  toast("Order placed successfully! 🎉");
  cart=[];saveCart();renderCart();updateCount();
  setTimeout(()=>toggleCart(),900);
}

function showPage(page){
  document.getElementById("homePage").classList.toggle("hidden",page!=="home");
  document.getElementById("restaurantsPage").classList.toggle("hidden",page!=="restaurants");
  document.getElementById("ordersPage").classList.toggle("hidden",page!=="orders");
  document.querySelectorAll(".navbar nav a").forEach(a=>a.classList.remove("active"));
  if(page==="home")document.querySelector('.navbar nav a[href="#home"]').classList.add("active");
  if(page==="restaurants")document.querySelector('.navbar nav a[href="#restaurants"]').classList.add("active");
  if(page==="orders")document.querySelector('.navbar nav a[href="#orders"]').classList.add("active");
  if(page==="restaurants")renderRestaurants();
  window.scrollTo({top:0,behavior:"smooth"});
}

function scrollToOffers(){
  showPage("home");
  setTimeout(()=>document.getElementById("offers").scrollIntoView({behavior:"smooth"}),50);
}

function copyCoupon(){
  navigator.clipboard?.writeText("CRAVE50");
  toast("Coupon CRAVE50 copied! 🎟️");
}

let toastTimer;
function toast(message){
  const el=document.getElementById("toast");
  el.textContent=message;el.classList.add("show");
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2200);
}

renderFoods();renderCart();updateCount();


let authMode="login";
let currentUser=JSON.parse(localStorage.getItem("craveUser")||"null");
let users=JSON.parse(localStorage.getItem("craveUsers")||"[]");
let savedOrders=JSON.parse(localStorage.getItem("craveOrders")||"[]");

function openAuth(mode="login"){
 authMode=mode;document.getElementById("authModal").classList.add("show");
 document.getElementById("authTitle").textContent=mode==="login"?"Welcome back":"Create account";
 document.getElementById("authSub").textContent=mode==="login"?"Login to continue ordering.":"Create your CraveDash account.";
 document.getElementById("nameField").classList.toggle("hidden",mode==="login");
 document.getElementById("authSubmit").textContent=mode==="login"?"Login":"Register";
 document.getElementById("authSwitchText").textContent=mode==="login"?"Don't have an account?":"Already have an account?";
 document.querySelector(".auth-switch button").textContent=mode==="login"?"Register":"Login";
}
function switchAuth(){openAuth(authMode==="login"?"register":"login")}
function closeAuth(){document.getElementById("authModal").classList.remove("show")}
function submitAuth(e){
 e.preventDefault();
 const email=document.getElementById("authEmail").value.trim().toLowerCase();
 const password=document.getElementById("authPassword").value;
 const name=document.getElementById("authName").value.trim();
 if(authMode==="register"){
  if(!name){toast("Please enter your name");return}
  if(users.some(u=>u.email===email)){toast("Email already registered");return}
  users.push({name,email,password});localStorage.setItem("craveUsers",JSON.stringify(users));
  currentUser={name,email};localStorage.setItem("craveUser",JSON.stringify(currentUser));
  closeAuth();updateProfile();toast("Account created successfully 🎉");
 }else{
  const u=users.find(u=>u.email===email&&u.password===password);
  if(!u){toast("Invalid email or password");return}
  currentUser={name:u.name,email:u.email};localStorage.setItem("craveUser",JSON.stringify(currentUser));
  closeAuth();updateProfile();toast("Welcome back, "+u.name+" 👋");
 }
}
function updateProfile(){
 const p=document.getElementById("profileBtn");if(!p)return;
 if(currentUser){p.textContent=currentUser.name.slice(0,2).toUpperCase();document.getElementById("menuName").textContent=currentUser.name}
 else{p.textContent="?";document.getElementById("menuName").textContent="Guest"}
}
function toggleUserMenu(){if(!currentUser){openAuth("login");return}document.getElementById("userMenu").classList.toggle("show")}
function logout(){currentUser=null;localStorage.removeItem("craveUser");document.getElementById("userMenu").classList.remove("show");updateProfile();toast("Logged out successfully")}

const oldCheckout=checkout;
checkout=function(){
 if(!cart.length)return;
 if(!currentUser){openAuth("login");toast("Please login before checkout");return}
 const total=cart.reduce((s,x)=>s+x.price*x.qty,0);
 savedOrders.unshift({id:Date.now(),date:new Date().toLocaleString(),items:cart.map(x=>({name:x.name,qty:x.qty})),total,status:"Preparing"});
 localStorage.setItem("craveOrders",JSON.stringify(savedOrders));
 cart=[];saveCart();renderCart();updateCount();toast("Order placed successfully! 🎉");setTimeout(()=>toggleCart(),900);
};
updateProfile();

/* ===== FULL CART / CHECKOUT FLOW ===== */
(function(){
  const CART_KEY="craveCart";
  const ORDER_KEY="craveOrders";

  function loadCart(){
    try { return JSON.parse(localStorage.getItem(CART_KEY)||"[]"); }
    catch(e){ return []; }
  }
  function saveCart2(){
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }
  function cartTotal(){
    return cart.reduce((sum,item)=>sum+(Number(item.price)||0)*(Number(item.qty)||0),0);
  }
  function cartCount(){
    return cart.reduce((sum,item)=>sum+(Number(item.qty)||0),0);
  }

  cart=loadCart();

  window.addToCart=function(id){
    id=Number(id);
    const food=foods.find(f=>Number(f.id)===id);
    if(!food){toast("Food item not found");return;}
    const existing=cart.find(x=>Number(x.id)===id);
    if(existing) existing.qty=Number(existing.qty)+1;
    else cart.push({...food,qty:1});
    saveCart2();
    renderCart2();
    updateCount2();
    toast(food.name+" added to cart 🛒");
  };

  window.changeQty=function(id,delta){
    const item=cart.find(x=>Number(x.id)===Number(id));
    if(!item)return;
    item.qty=Number(item.qty)+Number(delta);
    if(item.qty<=0) cart=cart.filter(x=>Number(x.id)!==Number(id));
    saveCart2();
    renderCart2();
    updateCount2();
  };

  window.removeFromCart=function(id){
    const item=cart.find(x=>Number(x.id)===Number(id));
    cart=cart.filter(x=>Number(x.id)!==Number(id));
    saveCart2();
    renderCart2();
    updateCount2();
    if(item)toast(item.name+" removed");
  };

  window.clearCart=function(){
    if(!cart.length)return;
    cart=[];
    saveCart2();
    renderCart2();
    updateCount2();
    toast("Cart cleared");
  };

  function updateCount2(){
    const el=document.getElementById("cartCount");
    if(el)el.textContent=cartCount();
  }

  function renderCart2(){
    const box=document.getElementById("cartItems");
    const bottom=document.getElementById("cartBottom");
    if(!box||!bottom)return;

    if(!cart.length){
      box.innerHTML=`
        <div style="text-align:center;padding:70px 15px;color:#888">
          <div style="font-size:58px">🛒</div>
          <h3 style="color:#222;margin:14px 0 8px">Your cart is empty</h3>
          <p>Add something delicious to get started.</p>
        </div>`;
      bottom.innerHTML="";
      return;
    }

    box.innerHTML=cart.map(item=>`
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-main">
          <strong>${item.name}</strong>
          <small>${item.restaurant} • ₹${Number(item.price).toFixed(0)} each</small>
          <div class="qty">
            <button onclick="changeQty(${item.id},-1)">−</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${item.id},1)">+</button>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;justify-content:space-between">
          <span class="cart-item-price">₹${(Number(item.price)*Number(item.qty)).toFixed(0)}</span>
          <button onclick="removeFromCart(${item.id})"
                  style="background:none;color:#999;font-size:12px">Remove</button>
        </div>
      </div>`).join("");

    const subtotal=cartTotal();
    const delivery=subtotal>=499?0:40;
    const total=subtotal+delivery;

    bottom.innerHTML=`
      <div style="font-size:12px;color:#888;display:flex;justify-content:space-between;margin-bottom:8px">
        <span>Subtotal</span><span>₹${subtotal.toFixed(0)}</span>
      </div>
      <div style="font-size:12px;color:#888;display:flex;justify-content:space-between;margin-bottom:12px">
        <span>Delivery</span><span>${delivery===0?"FREE":"₹"+delivery}</span>
      </div>
      <div class="total-row">
        <span>Total</span><span>₹${total.toFixed(0)}</span>
      </div>
      <button class="checkout" onclick="checkout2()">Proceed to checkout →</button>
      <button onclick="clearCart()"
              style="width:100%;margin-top:8px;padding:10px;background:#f5f2ee;border-radius:10px;color:#777;font-weight:700">
        Clear cart
      </button>`;
  }

  window.toggleCart=function(){
    const cartPanel=document.getElementById("cart");
    const overlay=document.getElementById("overlay");
    if(!cartPanel)return;
    cartPanel.classList.toggle("open");
    overlay.classList.toggle("show");
    renderCart2();
  };

  window.checkout2=function(){
    if(!cart.length){
      toast("Your cart is empty");
      return;
    }

    if(!currentUser){
      openAuth("login");
      toast("Please login before checkout");
      return;
    }

    const subtotal=cartTotal();
    const delivery=subtotal>=499?0:40;
    const total=subtotal+delivery;

    const order={
      id:Date.now(),
      orderNo:"CD"+String(Date.now()).slice(-6),
      date:new Date().toLocaleString(),
      customer:currentUser.name,
      items:cart.map(x=>({
        id:x.id,
        name:x.name,
        price:Number(x.price),
        qty:Number(x.qty)
      })),
      subtotal,
      delivery,
      total,
      status:"Order Confirmed"
    };

    let orderList=[];
    try{orderList=JSON.parse(localStorage.getItem(ORDER_KEY)||"[]")}catch(e){}
    orderList.unshift(order);
    localStorage.setItem(ORDER_KEY,JSON.stringify(orderList));

    cart=[];
    saveCart2();
    renderCart2();
    updateCount2();

    document.getElementById("cart").classList.remove("open");
    document.getElementById("overlay").classList.remove("show");

    showOrderSuccess(order);
  };

  function showOrderSuccess(order){
    const existing=document.getElementById("orderSuccessModal");
    if(existing)existing.remove();

    const modal=document.createElement("div");
    modal.id="orderSuccessModal";
    modal.className="auth-modal show";
    modal.innerHTML=`
      <div class="auth-box" style="text-align:center">
        <div style="font-size:58px;margin-bottom:10px">🎉</div>
        <p class="eyebrow">ORDER CONFIRMED</p>
        <h2>Thank you, ${order.customer}!</h2>
        <p class="auth-sub">Your order <strong>#${order.orderNo}</strong> has been placed successfully.</p>
        <div style="background:#f8f4ef;border-radius:14px;padding:15px;margin:18px 0;text-align:left">
          ${order.items.map(i=>`
            <div style="display:flex;justify-content:space-between;font-size:13px;margin:7px 0">
              <span>${i.name} × ${i.qty}</span>
              <strong>₹${(i.price*i.qty).toFixed(0)}</strong>
            </div>`).join("")}
          <hr style="border:0;border-top:1px solid #e5dfd7;margin:12px 0">
          <div style="display:flex;justify-content:space-between;font-weight:800">
            <span>Total</span><span style="color:#f15a29">₹${order.total.toFixed(0)}</span>
          </div>
        </div>
        <p style="font-size:12px;color:#888;margin-bottom:18px">Estimated delivery: 25–35 minutes</p>
        <button class="auth-submit" onclick="document.getElementById('orderSuccessModal').remove();showPage('orders')">
          View My Orders
        </button>
      </div>`;
    document.body.appendChild(modal);
  }

  window.renderOrders=function(){
    const box=document.getElementById("ordersContent");
    if(!box)return;

    if(!currentUser){
      box.innerHTML=`
        <div class="empty-orders">
          <span>🔐</span>
          <h3>Login to see your orders</h3>
          <p>Your completed orders will appear here.</p>
          <button class="primary-btn" onclick="openAuth('login')">Login →</button>
        </div>`;
      return;
    }

    let orderList=[];
    try{orderList=JSON.parse(localStorage.getItem(ORDER_KEY)||"[]")}catch(e){}

    if(!orderList.length){
      box.innerHTML=`
        <div class="empty-orders">
          <span>🧾</span>
          <h3>No orders yet</h3>
          <p>Add food to your cart and place your first order.</p>
          <button class="primary-btn" onclick="showPage('home')">Start ordering →</button>
        </div>`;
      return;
    }

    box.innerHTML=`
      <div class="order-history">
        ${orderList.map(o=>`
          <div class="order-card">
            <div>
              <h4>Order #${o.orderNo||String(o.id).slice(-6)}</h4>
              <p>${o.date}</p>
              <p>${o.items.map(i=>i.name+" × "+i.qty).join(", ")}</p>
            </div>
            <div style="text-align:right">
              <div class="order-status">${o.status}</div>
              <strong>₹${Number(o.total).toFixed(0)}</strong>
            </div>
          </div>`).join("")}
      </div>`;
  };

  // Make initialization use the improved cart.
  renderCart2();
  updateCount2();
})();


/* ===== ROBUST SEARCH ===== */
(function(){
  window.searchFood = function(){
    const input = document.getElementById("searchInput");
    if(!input) return;

    const query = input.value.trim().toLowerCase();

    const base = (typeof currentCategory !== "undefined" && currentCategory !== "All")
      ? foods.filter(f => String(f.category).toLowerCase() === String(currentCategory).toLowerCase())
      : foods;

    const result = query
      ? base.filter(f =>
          [f.name, f.restaurant, f.category]
            .some(value => String(value || "").toLowerCase().includes(query))
        )
      : base;

    if(typeof renderFoods === "function"){
      renderFoods(result);
    }

    // Make the result obvious to the user.
    const grid = document.getElementById("foodGrid");
    if(grid && query){
      grid.scrollIntoView({behavior:"smooth", block:"start"});
    }

    if(typeof toast === "function"){
      toast(result.length
        ? result.length + " food item" + (result.length === 1 ? "" : "s") + " found"
        : "No food found for \"" + input.value + "\"");
    }
  };

  const input = document.getElementById("searchInput");
  if(input){
    input.addEventListener("keydown", function(e){
      if(e.key === "Enter"){
        e.preventDefault();
        window.searchFood();
      }
    });
  }
})();
