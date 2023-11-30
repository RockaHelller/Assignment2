async function fetchProductsJSON(limit, skip) {
  const response = await fetch(
    `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
  );
  const products = await response.json();
  // console.log(products);
  return products;
}

const productsContainer = document.querySelector("#products .inProducts");
const paginationNumbers = document.querySelector("#products .pagination ul");

function pagination(c, m) {
  var current = c,
    last = m,
    delta = 1,
    left = current - delta,
    right = current + delta + 1,
    range = [],
    rangeWithDots = [],
    l;

  for (let i = 1; i <= last; i++) {
    if (i == 1 || i == last || (i >= left && i < right)) {
      range.push(i);
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(i);
    l = i;
  }
  return rangeWithDots;
}


////////////////////////////////
document.addEventListener('DOMContentLoaded', function() {
  var searchInput = document.getElementById('searchInput');

  searchInput.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
          event.preventDefault();
          performSearch(searchInput.value);
          searchInput.value = '';
      }
  });
});

function performSearch(query) {
  console.log("Searching for:", query); // Replace with actual search logic
}

////////////////////////////////


document.addEventListener("DOMContentLoaded", () => {
  let activePage = 1;
  const showProducts = (limit, skip) => {
    productsContainer.innerHTML = "";
    fetchProductsJSON(limit, skip).then((products) => {
      products.products.forEach((product) => {
        productsContainer.innerHTML += `<a class="product" href="./product-detail.html">
              <div class="box">
                <div class="top">
                  <img src="${product.thumbnail}" alt="${product.title}" />
                </div>
                <div class="bottom">
                  <div class="model">${product.title}</div>
                  <div class="total d-flex">
                    <div class="price mr-1">${product.price.toFixed(2)}</div>
                    <div class="discount-price mr-1">${(
                      product.price -
                      product.price * (product.discountPercentage / 100)
                    ).toFixed(2)}</div>
                    <div class="discount">-${product.discountPercentage}%</div>
                  </div>
                  <div class="category">${
                    product.category[0].toUpperCase() +
                    product.category.slice(1)
                  }</div>
                  <div class="stock">In Stock: ${product.stock}</div>
                </div>
              </div>
            </a>`;
      });

      const pages = (
        products.total % 12 == 0 ? products.total / 12 : products.total / 12 + 1
      ).toFixed();
      let paginations = "";

      const paginate = () => {
        let pageNumbers = pagination(+activePage, +pages);

        for (let i = 0; i < pageNumbers.length; i++) {
          if (pageNumbers[i] == activePage) {
            paginations += `
                  <li class="page-item number">
                            <a class="page-link active" href="">${pageNumbers[i]}</a>
                          </li>
                  `;
          } else if (pageNumbers[i] === "...") {
            paginations += `
                  <li class="page-item disabled">
                            <a class="page-link" href="">${pageNumbers[i]}</a>
                          </li>
                  `;
          } else {
            paginations += `
                  <li class="page-item number">
                            <a class="page-link" href="">${pageNumbers[i]}</a>
                          </li>
                  `;
          }
        }
        paginationNumbers.innerHTML = `
                      <li class="page-item ${
                        activePage > 1 ? "" : "disabled"
                      } prev-btn">
                        <a class="page-link" href="" tabindex="-1">Previous</a>
                      </li>
                      ${paginations}
                      <li class="page-item ${
                        activePage < pages ? "" : "disabled"
                      } next-btn">
                        <a class="page-link" href="">Next</a>
                      </li>
          `;
        const pageBtns = document.querySelectorAll(".page-item.number a");
        const prevBtn = document.querySelector(".page-item.prev-btn a");
        const nextBtn = document.querySelector(".page-item.next-btn a");
        pageBtns.forEach((btn) => {
          btn.addEventListener("click", (e) => {
            e.preventDefault();
            activePage = btn.innerHTML;
            paginations = "";
            paginate();
            showProducts(12, (activePage - 1) * 12);
          });
        });
        nextBtn.addEventListener("click", (e) => {
          e.preventDefault();
          if (activePage < pages) {
            activePage++;
            paginations = "";
            paginate();
            showProducts(12, (activePage - 1) * 12);
          }
        });
        prevBtn.addEventListener("click", (e) => {
          e.preventDefault();
          if (activePage > 1) {
            activePage--;
            paginations = "";
            paginate();
            showProducts(12, (activePage - 1) * 12);
          }
        });
      };
      paginate();
    });
  };
  showProducts(12, 0);
});
