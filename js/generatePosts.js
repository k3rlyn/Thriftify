const postsContainer = document.getElementById("postsContainer");

const postsData = [
  { username: "@khiela", description: "Tas kulit Tory bekas, kualitas 9/10.", image: "https://via.placeholder.com/600x300", price: "Rp213.000" },
  { username: "@mutiarawr", description: "Mau jual baju vintage kayak gini.", image: "https://via.placeholder.com/600x300", price: "Rp150.000" },
  { username: "@vintagegirl", description: "Celana jeans classic size M.", image: "https://via.placeholder.com/600x300", price: "Rp120.000" },
  { username: "@thriftyfan", description: "Jaket denim Levi's second.", image: "https://via.placeholder.com/600x300", price: "Rp200.000" },
  { username: "@retrolover", description: "Topi vintage model unik.", image: "https://via.placeholder.com/600x300", price: "Rp50.000" }
];

// Generate posts
postsData.forEach(post => {
  const postCard = document.createElement("div");
  postCard.classList.add("post");

  postCard.innerHTML = `
    <div class="post-header">
      <img src="https://via.placeholder.com/40" alt="profile-pic" class="profile-pic">
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
