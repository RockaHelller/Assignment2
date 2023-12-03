async function fetchAllProductsJSON() {
  const response = await fetch(`https://dummyjson.com/products?limit=100`);
  const products = await response.json();
  return products;
}

async function fetchSearchedProductsJSON(query) {
  const response = await fetch(
    `https://dummyjson.com/products/search?q=${query}&limit=100`
  );
  const products = await response.json();
  return products;
}

const categoriesContainer = document.querySelector("ul.categories");
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

let categoryBtns;

let categories = [];

let checkedCategories = [];
let shownProducts = 0;
let checkedProducts = [];

let count = 0;

let allProducts;
document.addEventListener("DOMContentLoaded", () => {
  let activePage = 1;
  shownProducts = 100;

  var searchInput = document.getElementById("searchInput");

  searchInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      performSearch(searchInput.value);
      searchInput.value = "";
    }
  });

  function performSearch(query) {
    fetchSearchedProductsJSON(query).then((res) => {
      allProducts = res.products;

      categories = [];
      allProducts.forEach((product) => {
        if (!categories.includes(product.category)) {
          categories.push(product.category);
        }
      });

      categoriesContainer.innerHTML = "";
      categories.forEach((category) => {
        categoriesContainer.innerHTML += `<li>
                <label class="btncontainer">
                  <input type="checkbox" value="${category}" />
                  <span class="checkmark"></span>
                  ${category[0].toUpperCase() + category.slice(1)}
                </label>
              </li>`;
      });

      categoriesContainer.querySelectorAll("li").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          if (e.target instanceof HTMLInputElement) {
            checkedProducts = [];
            activePage = 1;
            const checkedElement = e.target.parentElement.innerText;
            shownProducts = checkedCategories.length * 5;
            if (e.target.checked) {
              checkedCategories.push(checkedElement);
            } else {
              checkedCategories = checkedCategories.filter((ctgr) => {
                return ctgr != checkedElement;
              });
            }
            allProducts.forEach((product) => {
              checkedCategories.forEach((ctgr) => {
                if (
                  product.category[0].toUpperCase() +
                    product.category.slice(1) ==
                  ctgr
                ) {
                  checkedProducts.push(product);
                }
              });
            });
            if (checkedCategories.length == 0) {
              showProducts(allProducts, 0);
            } else {
              showProducts(checkedProducts, 0);
            }
          }
        });
      });

      showProducts(allProducts, 0);
    });
  }

  fetchAllProductsJSON().then((res) => {
    allProducts = res.products;

    categories = [];
    allProducts.forEach((product) => {
      if (!categories.includes(product.category)) {
        categories.push(product.category);
      }
    });

    categoriesContainer.innerHTML = "";
    categories.forEach((category) => {
      categoriesContainer.innerHTML += `<li>
              <label class="btncontainer">
                <input type="checkbox" value="${category}" />
                <span class="checkmark"></span>
                ${category[0].toUpperCase() + category.slice(1)}
              </label>
            </li>`;
    });

    categoriesContainer.querySelectorAll("li").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        if (e.target instanceof HTMLInputElement) {
          checkedProducts = [];
          activePage = 1;
          const checkedElement = e.target.parentElement.innerText;
          shownProducts = checkedCategories.length * 5;
          if (e.target.checked) {
            checkedCategories.push(checkedElement);
          } else {
            checkedCategories = checkedCategories.filter((ctgr) => {
              return ctgr != checkedElement;
            });
          }
          allProducts.forEach((product) => {
            checkedCategories.forEach((ctgr) => {
              if (
                product.category[0].toUpperCase() + product.category.slice(1) ==
                ctgr
              ) {
                checkedProducts.push(product);
              }
            });
          });
          if (checkedCategories.length == 0) {
            showProducts(allProducts, 0);
          } else {
            showProducts(checkedProducts, 0);
          }
        }
      });
    });

    showProducts(allProducts, 0);
  });

  const showProducts = (products, skip) => {
    productsContainer.innerHTML = "";
    products.slice(skip, activePage * 12).forEach((product) => {
      productsContainer.innerHTML += `<a class="product" href="./product-detail.html" id="p-${
        product.id
      }">
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

    productsContainer.querySelectorAll("a.product").forEach((product) => {
      product.addEventListener("click", () => {
        localStorage.setItem("productId", product.id.split("-")[1]);
      });
    });

    paginate(products);
  };

  const paginate = (products) => {
    let paginations = "";
    paginationNumbers.innerHTML = "";

    let pages = 0;

    if (products.length > 12) {
      pages = (
        products.length % 12 == 0
          ? products.length / 12
          : products.length / 12 + 1
      ).toFixed();
    }

    let pageNumbers = pagination(+activePage, +pages);

    if (+pages > 1) {
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
          paginate(products);
          showProducts(products, (activePage - 1) * 12);
        });
      });
      nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (activePage < pages) {
          activePage++;
          paginations = "";
          paginate(products);
          showProducts(products, (activePage - 1) * 12);
        }
      });
      prevBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (activePage > 1) {
          activePage--;
          paginations = "";
          paginate(products);
          showProducts(products, (activePage - 1) * 12);
        }
      });
    }
  };
});

$(".slick-slider").slick({
  dots: false,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 3000,
  speed: 300,

  prevArrow: '<i class="fal fa-chevron-left"></i>',
  nextArrow: '<i class="fal fa-chevron-right"></i>',
});
