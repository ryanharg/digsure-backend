let map;
let drawingManager;
let selectedPolygon = null;
window.showStep = function(stepNumber) {
    console.log("Switching to step:", stepNumber);

    document.querySelectorAll(".step-content").forEach(step => step.classList.add("hidden"));
    const targetStep = document.getElementById(`step-${stepNumber}`);

    if (targetStep) {
        targetStep.classList.remove("hidden");
        console.log(`Step ${stepNumber} is now visible`);
    } else {
        console.error(`Step ${stepNumber} not found!`);
    }
};


window.initMap = function() {
    console.log("Google Maps API Loaded Successfully");

    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 51.5074, lng: -0.1278 },
        zoom: 13,
    });

    drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ["polygon"],
        },
        polygonOptions: {
            fillColor: "#FF0000",
            fillOpacity: 0.4,
            strokeWeight: 2,
            editable: true,
            draggable: true,
        },
    });

    drawingManager.setMap(map);

    google.maps.event.addListener(drawingManager, "overlaycomplete", function(event) {
        if (selectedPolygon) {
            selectedPolygon.setMap(null);
        }
        selectedPolygon = event.overlay;
        calculatePolygonMetrics(selectedPolygon);
    });

    setTimeout(loadStoredPolygon, 500);
};

console.log("Script.js Loaded");

window.onload = function () {
    initMap();
    setupNavigation();
};

function calculatePolygonMetrics(polygon) {
    const path = polygon.getPath();
    let coordinates = [];

    path.forEach((point) => {
        coordinates.push({ lat: point.lat(), lng: point.lng() });
    });

    let area = google.maps.geometry.spherical.computeArea(path);
    let perimeter = google.maps.geometry.spherical.computeLength(path);

    area = (area / 10000).toFixed(2);
    perimeter = perimeter.toFixed(2);

    localStorage.setItem("polygonData", JSON.stringify({ coordinates, area, perimeter }));

    document.getElementById("polygon-info").innerHTML = 
        `<p><strong>Area:</strong> ${area} ha</p>
         <p><strong>Perimeter:</strong> ${perimeter} m</p>`;

    console.log("Polygon saved to localStorage:", localStorage.getItem("polygonData"));

}

function setupNavigation() {
    console.log("Setting up navigation...");
    const steps = document.querySelectorAll(".step-content");
    const nextButtons = document.querySelectorAll(".next-btn");
    const prevButtons = document.querySelectorAll(".prev-btn");

    function showStep(stepNumber) {
        console.log("Switching to step:", stepNumber);
    
        document.querySelectorAll(".step-content").forEach(step => step.classList.add("hidden"));
        const targetStep = document.getElementById(`step-${stepNumber}`);
    
        if (targetStep) {
            targetStep.classList.remove("hidden");
            console.log(`Step ${stepNumber} is now visible`);
        } else {
            console.error(`Step ${stepNumber} not found!`);
        }
    }
    

    showStep(1);
}
document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript loaded and running");

    const steps = document.querySelectorAll(".step-content");
    const nextButtons = document.querySelectorAll(".next-btn");
    const prevButtons = document.querySelectorAll(".prev-btn");

    function showStep(stepNumber) {
        console.log("Switching to step:", stepNumber);

        steps.forEach(step => step.classList.add("hidden"));
        const targetStep = document.getElementById(`step-${stepNumber}`);
        
        if (targetStep) {
            targetStep.classList.remove("hidden");
            console.log(`Step ${stepNumber} is now visible`);
        } else {
            console.error(`Step ${stepNumber} not found!`);
        }
    }

    nextButtons.forEach(button => {
        button.addEventListener("click", function () {
            console.log("Next button clicked!");
            const nextStep = this.getAttribute("data-next");
            if (nextStep) {
                showStep(parseInt(nextStep));
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener("click", function () {
            console.log("Previous button clicked!");
            const prevStep = this.getAttribute("data-prev");
            if (prevStep) {
                showStep(parseInt(prevStep));
            }
        });
    });

    showStep(1);
});
document.addEventListener("DOMContentLoaded", function () {
    console.log("Price Calculator Loaded");

    let map;

    // Initialize Google Maps
    // For step1.html
window.initDrawingMap = function () {
    console.log("Google Maps API Loaded Successfully");

    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 51.5074, lng: -0.1278 },
        zoom: 13,
    });

    drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ["polygon"],
        },
        polygonOptions: {
            fillColor: "#FF0000",
            fillOpacity: 0.4,
            strokeWeight: 2,
            editable: true,
            draggable: true,
        },
    });

    drawingManager.setMap(map);

    google.maps.event.addListener(drawingManager, "overlaycomplete", function(event) {
        if (selectedPolygon) {
            selectedPolygon.setMap(null);
        }
        selectedPolygon = event.overlay;
        calculatePolygonMetrics(selectedPolygon);
    });

    setTimeout(loadStoredPolygon, 500);
};

// For step4.html preview
window.initMiniMap = function () {
    const mapContainer = document.getElementById("mini-map");
    if (!mapContainer) {
        console.warn("Map container not found!");
        return;
    }

    map = new google.maps.Map(mapContainer, {
        center: { lat: 51.505, lng: -0.09 },
        zoom: 13,
    });

    let storedPolygon = JSON.parse(localStorage.getItem("polygonData"));
    if (storedPolygon && storedPolygon.coordinates) {
        const polygon = new google.maps.Polygon({
            paths: storedPolygon.coordinates,
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
        });
        polygon.setMap(map);

        const bounds = new google.maps.LatLngBounds();
        storedPolygon.coordinates.forEach(coord => bounds.extend(coord));
        map.fitBounds(bounds);
    }
};

    function updateTotalPrice() {
        console.log("Calculating price...");
        let storedPolygon = JSON.parse(localStorage.getItem("polygonData")) || { area: 1 };
        let area = storedPolygon.area || 1;

        let selectedService = JSON.parse(localStorage.getItem("selectedService")) || { fixedPrice: 0 };
        let basePrice = selectedService.fixedPrice || 0;

        const turnaroundScaling = {
            "24 Hours": 41.16,
            "5 Days": 28.40,
            "10 Days": 17.35,
            "20 Days": 10.88
        };

        let selectedTurnaround = document.querySelector("input[name='turnaroundTime']:checked");
        let perHectareCost = selectedTurnaround ? turnaroundScaling[selectedTurnaround.value] || 0 : 0;

        let extrasCost = 0;
        document.querySelectorAll("input[name='additionalOptions']:checked").forEach((input) => {
            extrasCost += parseFloat(input.getAttribute("data-price") || 0);
        });

        let totalPrice = basePrice + (area * perHectareCost) + extrasCost;

        localStorage.setItem("totalPrice", totalPrice.toFixed(2));
        const priceElement = document.getElementById("dynamic-price");
        if (priceElement) {
            priceElement.innerText = `£${totalPrice.toFixed(2)}`;
        } else {
            console.warn("Price element not found!");
        }

        console.log(`Total Price Updated: £${totalPrice.toFixed(2)}`);
    }

    document.querySelectorAll("input[name='turnaroundTime'], input[name='additionalOptions']").forEach(input => {
        input.addEventListener("change", updateTotalPrice);
    });

    updateTotalPrice(); // Initial calculation
});
document.addEventListener("DOMContentLoaded", function () {
    const submitBtn = document.getElementById("submitOrder");
  
    if (submitBtn) {
      submitBtn.addEventListener("click", async function () {
        const token = localStorage.getItem("token");
  
        if (!token) {
          document.getElementById("loginReminder").style.display = "block";
          return;
        }
  
        const polygonData = JSON.parse(localStorage.getItem("polygonData") || "{}");
        const selectedService = JSON.parse(localStorage.getItem("selectedService") || "{}");
        const totalPrice = localStorage.getItem("calculatedPrice") || "0";
  
        if (!polygonData.coordinates || polygonData.coordinates.length === 0) {
          alert("No polygon data found.");
          return;
        }
  
        // ✅ Generate KML string from polygon coordinates
        const kmlString = `
          <kml xmlns="http://www.opengis.net/kml/2.2">
            <Document>
              <Placemark>
                <name>Digsure Order Area</name>
                <Polygon>
                  <outerBoundaryIs>
                    <LinearRing>
                      <coordinates>
                        ${polygonData.coordinates.map(c => `${c.lng},${c.lat},0`).join(' ')}
                      </coordinates>
                    </LinearRing>
                  </outerBoundaryIs>
                </Polygon>
              </Placemark>
            </Document>
          </kml>
        `.trim();
  
        const orderData = {
          polygon: polygonData,
          service: selectedService,
          price: totalPrice,
          kml: kmlString,
        };
  
        try {
          const res = await fetch("http://localhost:3000/api/submit-order", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(orderData),
          });
  
          const data = await res.json();
  
          if (!res.ok) {
            throw new Error(data.message || "Failed to submit order.");
          }
  
          alert("Order submitted successfully!");
          window.location.href = "orders.html";
        } catch (err) {
          console.error("Order submission error:", err);
          alert("There was an issue submitting your order.");
        }
      });
    }
  });
  
  