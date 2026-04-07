async function search() {
  const q = document.getElementById("q").value;
  const category = document.getElementById("category").value;
  const minPrice = document.getElementById("minPrice").value;
  const maxPrice = document.getElementById("maxPrice").value;

  const params = new URLSearchParams({ q, category, minPrice, maxPrice });

  const res = await fetch(`http://localhost:5000/search?${params}`);
  const data = await res.json();

  let html = "<table><tr><th>Product</th><th>Category</th><th>Price</th></tr>";
  data.forEach(i => {
    html += `<tr><td>${i.product}</td><td>${i.category}</td><td>${i.price}</td></tr>`;
  });
  html += "</table>";

  document.getElementById("results").innerHTML = html;
}
