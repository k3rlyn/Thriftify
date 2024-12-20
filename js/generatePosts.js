const postsContainer = document.getElementById("postsContainer");

const postsData = [
  { 
    username: "@khiela", 
    description: "Tas kulit Tory bekas, kualitas 9/10.", 
    image: "../assets/tas.jpg", 
    price: "Rp213.000", 
    profilePicture: "../assets/woman1.jpg" 
  },
  { 
    username: "@mutiarawr", 
    description: "Mau jual baju vintage kayak gini.", 
    image: "../assets/baju.jpg", 
    price: "Rp150.000", 
    profilePicture: "../assets/woman2.jpg" 
  },
  { 
    username: "@vintagegirl", 
    description: "Celana jeans classic size M.", 
    image: "../assets/jeans.jpg", 
    price: "Rp120.000", 
    profilePicture: "../assets/woman3.jpg" 
  },
  { 
    username: "@thriftyfan", 
    description: "Jaket denim Levi's second.", 
    image: "../assets/jaket.jpg", 
    price: "Rp200.000", 
    profilePicture: "../assets/man1.jpg" 
  },
  { 
    username: "@retrolover", 
    description: "Topi vintage model unik.", 
    image: "../assets/topi.jpg", 
    price: "Rp50.000", 
    profilePicture: "../assets/man2.jpg" 
  },
  { 
    username: "@retrolover", 
    description: "Jam tangan.", 
    image: "../assets/jam.jpg", 
    price: "Rp250.000", 
    profilePicture: "../assets/man2.jpg" 
  },
  { 
    username: "@budisetya", 
    description: "Jual buku impor preloved", 
    image: "../assets/buku.jpg", 
    price: "Rp50.000", 
    profilePicture: "../assets/man3.jpg" 
  }
];

// Generate posts
postsData.forEach(post => {
  const postCard = document.createElement("div");
  postCard.classList.add("post");

  postCard.innerHTML = `
    <div class="post-header">
      <img src="${post.profilePicture}" alt="profile-pic" class="profile-pic">
      <div class="post-user">${post.username}</div>
    </div>
    <p class="post-text">${post.description}</p>
    <div class="post-image">
      <img src="${post.image}" alt="product-image">
    </div>
    <div class="post-footer">
      <h3>Harga Produk</h3>
      <p class="price">${post.price}</p>
      <div class="actions">
        <button class="chat-btn">Chat</button>
        <button class="repost-btn">Repost</button>
      </div>
    </div>
  `;

  postsContainer.appendChild(postCard);
});
