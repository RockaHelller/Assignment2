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
    if (direction === 'next' && activeTab < tabs.length - 1) {
        tabs[activeTab + 1].click();
        setTimeout(function() {
            tabs[activeTab + 1].scrollIntoView({behavior: 'smooth', block: 'nearest'});
        }, 100); // Delay of 100ms
    } else if (direction === 'prev' && activeTab > 0) {
        tabs[activeTab - 1].click();
        setTimeout(function() {
            tabs[activeTab - 1].scrollIntoView({behavior: 'smooth', block: 'nearest'});
        }, 100); // Delay of 100ms
    }
}


document.getElementById('nextButton').onclick = function() { navigateTabs('next'); };
document.getElementById('prevButton').onclick = function() { navigateTabs('prev'); };

