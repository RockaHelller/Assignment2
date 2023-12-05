function openTab(evt, imageName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(imageName).style.display = "block";
  evt.currentTarget.className += " active";
}

async function fetchProductJSON(id) {
  const response = await fetch(`https://dummyjson.com/products/${id}`);
  const product = await response.json();
  return product;
}

document.addEventListener("DOMContentLoaded", () => {
  var searchInput = document.getElementById("searchInput");

  searchInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      performSearch(searchInput.value);
      searchInput.value = "";
    }
  });

  function performSearch(query) {
    localStorage.setItem("search", query);
    window.location.replace("/index.html");
  }

  const id = localStorage.getItem("productId");
  const imagesContainer = document.querySelector(".imagesContainer");
  const tablinksContainer = document.querySelector(".tablinksContainer");
  fetchProductJSON(id).then((product) => {
    document.querySelector(".model").innerHTML = product.title;
    document.querySelector(".description .content").innerHTML =
      product.description;
    document.querySelector(
      ".discount"
    ).innerHTML = `-${product.discountPercentage}%`;
    document.querySelector(".price").innerHTML = `${product.price.toFixed(
      2
    )} $`;
    document.querySelector(".discount-price").innerHTML = `${(
      product.price -
      product.price * (product.discountPercentage / 100)
    ).toFixed(2)} $`;
    document.querySelector(".category").innerHTML =
      product.category[0].toUpperCase() + product.category.slice(1);
    document.querySelector(".stock").innerHTML = `In Stock: ${product.stock}`;
    product.images.forEach((image, i) => {
      tablinksContainer.innerHTML += `<button
          class="tablinks"
          onclick="openTab(event, 'Image${i}')"
          ${i == 0 ? 'id="defaultOpen"' : ""}
        >
          <img src=${image} />
        </button>`;
      imagesContainer.innerHTML += `
        <div id="Image${i}" class="tabcontent">
        <img src=${image} alt=${product.title} />
      </div>
        `;
    });

    function initializeDefaultTab() {
      document.getElementById("defaultOpen").click();
    }

    function navigateTabs(direction) {
      var tabs = document.getElementsByClassName("tablinks");
      var activeTab;
      for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].className.includes("active")) {
          activeTab = i;
          break;
        }
      }
      if (direction === "next" && activeTab < tabs.length - 1) {
        tabs[activeTab + 1].click();
        setTimeout(function () {
          tabs[activeTab + 1].scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }, 100); // Delay of 100ms
      } else if (direction === "prev" && activeTab > 0) {
        tabs[activeTab - 1].click();
        setTimeout(function () {
          tabs[activeTab - 1].scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }, 100); // Delay of 100ms
      }
    }

    document.getElementById("nextButton").onclick = function () {
      navigateTabs("next");
    };
    document.getElementById("prevButton").onclick = function () {
      navigateTabs("prev");
    };

    initializeDefaultTab();
  });
});
