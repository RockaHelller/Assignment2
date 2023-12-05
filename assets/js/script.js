const link = "https://dummyjson.com/";

// Get all products from the API endpoint
async function fetchAllProductsJSON() {
  const response = await fetch(`${link}products?limit=100`);
  const products = await response.json();
  return products;
}

// Get search results from the API endpoint
async function fetchSearchedProductsJSON(query) {
  const response = await fetch(
    `${link}products/search?q=${query}&limit=100`
  );
  const products = await response.json();
  return products;
}

// Containers and inputs
const categoriesContainer = document.querySelector("ul.categories");
const productsContainer = document.querySelector("#products .inProducts");
const paginationNumbers = document.querySelector("#products .pagination ul");
const searchInput = document.getElementById("searchInput");

//Pagination numbers with dots
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

// Variables
let categoryBtns;
let categories = [];
let checkedCategories = [];
let shownProducts = 100;
let checkedProducts = [];
let allProducts;

document.addEventListener("DOMContentLoaded", () => {
  let activePage = 1;

  //Handle searching
  searchInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      performSearch(searchInput.value);
      searchInput.value = "";
    }
  });

  // Search products
  function performSearch(query) {
    fetchSearchedProductsJSON(query).then((res) => {
      allProducts = res.products;

      if (allProducts.length == 0) {
        productsContainer.innerHTML = "<h2 class='no-result'>There is not any product.</h2>";
        paginate();
        return;
      }

      categories = [];
      //Add product categories to the array
      allProducts.forEach((product) => {
        if (!categories.includes(product.category)) {
          categories.push(product.category);
        }
      });

      categoriesContainer.innerHTML = "";
      //Show categories
      categories.forEach((category) => {
        categoriesContainer.innerHTML += `<li>
                <label class="btncontainer">
                  <input type="checkbox" value="${category}" />
                  <span class="checkmark"></span>
                  ${category[0].toUpperCase() + category.slice(1)}
                </label>
              </li>`;
      });

      //Handle category checkboxes click and show categorized products
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

  //If there is query in localstorage, then search products
  if (localStorage.getItem("search")) {
    performSearch(localStorage.getItem("search"));
    localStorage.removeItem("search");
  } else {
    // Else show all products
    fetchAllProductsJSON().then((res) => {
      allProducts = res.products;

      categories = [];
      //Add product categories to the array
      allProducts.forEach((product) => {
        if (!categories.includes(product.category)) {
          categories.push(product.category);
        }
      });

      categoriesContainer.innerHTML = "";
      //Show product categories
      categories.forEach((category) => {
        categoriesContainer.innerHTML += `<li>
                <label class="btncontainer">
                  <input type="checkbox" value="${category}" />
                  <span class="checkmark"></span>
                  ${category[0].toUpperCase() + category.slice(1)}
                </label>
              </li>`;
      });

      //Handle category checkboxes click and show categorized products
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

  //Show products
  const showProducts = (products, skip) => {
    productsContainer.innerHTML = "";
    //Skip part of products and show 9 items
    products.slice(skip, activePage * 9).forEach((product) => {
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
                    <div class="price mr-1">${product.price.toFixed(2)}$</div>
                    <div class="discount-price mr-1">${(
                      product.price -
                      product.price * (product.discountPercentage / 100)
                    ).toFixed(2)}$</div>
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

    //Handle Product container click
    productsContainer.querySelectorAll("a.product").forEach((product) => {
      product.addEventListener("click", () => {
        localStorage.setItem("productId", product.id.split("-")[1]);
      });
    });

    paginate(products);
  };

  //Show pagination by products
  const paginate = (products) => {
    let paginations = "";
    paginationNumbers.innerHTML = "";

    let pages = 0;

    // Get the page count by product count
    if (products.length > 9) {
      pages = 
        products.length % 9 == 0
          ? products.length / 9
          : Math.floor(products.length / 9) + 1
    ;
    }

    let pageNumbers = pagination(+activePage, +pages);

    //If page count is more than 1
    if (+pages > 1) {
      //Add pagination numbers and check if page count is active or it is dot
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

      //Add page numbers to the page
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

        //pagination Buttons
      const pageBtns = document.querySelectorAll(".page-item.number a");
      const prevBtn = document.querySelector(".page-item.prev-btn a");
      const nextBtn = document.querySelector(".page-item.next-btn a");
      //Handle Page number buttons
      pageBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          activePage = btn.innerHTML;
          paginations = "";
          paginate(products);
          showProducts(products, (activePage - 1) * 9);
        });
      });
      //Handle next button
      nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (activePage < pages) {
          activePage++;
          paginations = "";
          paginate(products);
          showProducts(products, (activePage - 1) * 9);
        }
      });
      //Handle Prev button
      prevBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (activePage > 1) {
          activePage--;
          paginations = "";
          paginate(products);
          showProducts(products, (activePage - 1) * 9);
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
