---
import Layout from '../layouts/Layout.astro';
// Note: I've updated this import path to be correct after moving data to src/
import productsData from '../data/products.json'; 
const referenceDocs = productsData.products[0].documents;
---

<Layout 
    title="Filter Media Calculator"
    description="Calculate the required volume and weight of filter media for cylindrical, cube, or cuboid tanks with our easy-to-use calculator."
    keywords="filter media calculator, tank volume calculator, media weight calculator, water treatment calculation"
>
    <section class="shop-hero">
        <div class="shop-hero-bg"></div>
        <div class="shop-hero-overlay"></div>
        <div class="shop-hero-content">
            <h1>Filter Media Calculator</h1>
            <p class="shop-hero-subtitle">Precise calculations for your water treatment needs</p>
            <div class="breadcrumbs">
               <a href="/">Home</a><span class="separator">/</span><span class="active">Calculator</span>
            </div>
        </div>
    </section>

    <div class="container" style="padding: 60px 20px;">
        <div class="calculator-modal-layout">
            <div class="calculator-main">
              <h2 id="calculatorTitle">Select a Shape to Begin</h2>
              <div class="form-group">
                <label for="calculatorShapeSelector">Tank Shape</label>
                <select id="calculatorShapeSelector">
                    <option value="" disabled selected>Select a shape...</option>
                    <option value="cylindrical">Cylindrical</option>
                    <option value="cube">Cube</option>
                    <option value="cuboid">Cuboid</option>
                </select>
              </div>
              <div class="form-group">
                <label for="calculatorUnit">Measurement Unit</label>
                <select id="calculatorUnit">
                  <option value="mm">Millimeter (mm)</option>
                  <option value="cm">Centimeter (cm)</option>
                  <option value="m">Meter (m)</option>
                  <option value="in">Inches (in)</option>
                </select>
              </div>
              <div id="calculatorBody">
                </div>
            </div>

            <div class="calculator-promo">
              <h2>Reference Sheets</h2>
              <p>Download our product specification sheets and installation guides for more detailed information.</p>
              <div class="documents-list" style="text-align: left; margin-bottom: 30px;">
                {referenceDocs.map(doc => (
                    <a href={doc.url} target="_blank">{doc.name}</a>
                ))}
              </div>
              <h2>Water Treatment Engineer App</h2>
              <p>Get precise calculations on the go with our dedicated mobile app.</p>
              <a href="https://play.google.com/store/apps/details?id=com.sahil.tankmediacalculator&pcampaignid=web_share" target="_blank" class="promo-download-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 22v-20l18 10-18 10z"></path></svg>
                <span>Download Now</span>
              </a>
            </div>
        </div>
    </div>
    
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const shapeSelector = document.getElementById('calculatorShapeSelector');
            if (!shapeSelector) return;

            const calculatorTitle = document.getElementById('calculatorTitle');
            const calculatorBody = document.getElementById('calculatorBody');
            const unitSelector = document.getElementById('calculatorUnit');

            let currentShape = '';
            let unitMultiplier = 1.0;
            let unitSuffix = 'mm';

            shapeSelector.addEventListener('change', () => handleShapeChange(shapeSelector.value));
            unitSelector.addEventListener('change', () => handleUnitChange(unitSelector.value));

            function handleShapeChange(shape) {
                currentShape = shape;
                if (currentShape) {
                    const shapeName = currentShape.charAt(0).toUpperCase() + currentShape.slice(1);
                    calculatorTitle.textContent = `${shapeName} Tank Calculator`;
                    renderCalculatorBody(currentShape);
                }
            }

            function handleUnitChange(selectedUnit) {
                switch (selectedUnit) {
                    case 'cm': unitMultiplier = 10.0; unitSuffix = 'cm'; break;
                    case 'm': unitMultiplier = 1000.0; unitSuffix = 'm'; break;
                    case 'in': unitMultiplier = 25.4; unitSuffix = 'in'; break;
                    default: unitMultiplier = 1.0; unitSuffix = 'mm'; break;
                }
                if (currentShape) {
                    renderCalculatorBody(currentShape);
                }
            }

            function renderCalculatorBody(shape) {
                let inputsHTML = '';
                // The long HTML strings for inputs are kept the same as before
                switch (shape) {
                     case 'cylindrical':
                        inputsHTML = `<div class="form-group"><label for="calc-input-type">Input Type</label><select id="calc-input-type" class="calc-input"><option value="diameter">Diameter</option><option value="radius">Radius</option><option value="circumference">Circumference</option></select></div><div class="form-group"><label id="calc-main-label" for="calc-main-input">Tank Diameter (${unitSuffix})</label><input type="number" id="calc-main-input" class="calc-input" placeholder="Enter diameter in ${unitSuffix}"></div>`;
                        break;
                    case 'cube':
                        inputsHTML = `<div class="form-group"><label for="calc-side">Side of Cube (${unitSuffix})</label><input type="number" id="calc-side" class="calc-input" placeholder="Enter side in ${unitSuffix}"></div>`;
                        break;
                    case 'cuboid':
                        inputsHTML = `<div class="form-group"><label for="calc-length">Tank Length (${unitSuffix})</label><input type="number" id="calc-length" class="calc-input" placeholder="Enter length in ${unitSuffix}"></div><div class="form-group"><label for="calc-width">Tank Width (${unitSuffix})</label><input type="number" id="calc-width" class="calc-input" placeholder="Enter width in ${unitSuffix}"></div>`;
                        break;
                }
                calculatorBody.innerHTML = `${inputsHTML}<div class="form-group"><label for="calc-height">Total Tank Height (${unitSuffix})</label><input type="number" id="calc-height" class="calc-input" placeholder="Enter total height in ${unitSuffix}"></div><div class="form-group"><label for="calc-percentage">Filling Percentage</label><select id="calc-percentage" class="calc-input"><option value="100">100%</option><option value="90">90%</option><option value="80">80%</option><option value="70">70%</option><option value="60">60%</option><option value="50">50%</option></select></div><div class="form-group"><label for="calc-density-type">Media Type</label><select id="calc-density-type" class="calc-input"><option value="">Select Media</option><option value="1.6">Sand Media (1.6 g/cm³)</option><option value="0.7">Activated Carbon (0.7 g/cm³)</option><option value="manual">Manual Input</option></select></div><div class="form-group"><label for="calc-density">Media Bulk Density (g/cm³)</label><input type="number" id="calc-density" class="calc-input" placeholder="Select media type or enter manually" disabled></div><div class="calc-actions"><button id="calc-calculate-btn" class="btn-solid">Calculate</button><button id="calc-reset-btn" class="btn-outline">Reset</button></div><div id="calc-results" class="calc-results"><p>Volume: <span id="calc-volume-result">0.00</span> Liters</p><p>Media Weight: <span id="calc-weight-result">0</span> kg</p></div>`;
                attachCalculatorEventListeners();
            }

            function attachCalculatorEventListeners() {
                if (currentShape === 'cylindrical') {
                    document.getElementById('calc-input-type').addEventListener('change', (e) => {
                        const label = document.getElementById('calc-main-label');
                        const input = document.getElementById('calc-main-input');
                        const type = e.target.value;
                        const typeCapitalized = type.charAt(0).toUpperCase() + type.slice(1);
                        label.textContent = `Tank ${typeCapitalized} (${unitSuffix})`;
                        input.placeholder = `Enter ${type} in ${unitSuffix}`;
                    });
                }
                document.getElementById('calc-density-type').addEventListener('change', (e) => {
                    const densityInput = document.getElementById('calc-density');
                    if (e.target.value === 'manual') {
                        densityInput.disabled = false;
                        densityInput.value = '';
                        densityInput.focus();
                    } else {
                        densityInput.disabled = true;
                        densityInput.value = e.target.value;
                    }
                });
                document.getElementById('calc-calculate-btn').addEventListener('click', calculate);
                document.getElementById('calc-reset-btn').addEventListener('click', resetCalculator);
            }

            function calculate() {
                const height = parseFloat(document.getElementById('calc-height').value);
                const percentage = parseFloat(document.getElementById('calc-percentage').value);
                const density = parseFloat(document.getElementById('calc-density').value);
                if (isNaN(height) || isNaN(percentage) || isNaN(density)) {
                    alert('Please fill in all required fields with valid numbers.');
                    return;
                }
                const fillingHeight = height * (percentage / 100);
                let rawVolumeMM3 = 0;
                try {
                    switch (currentShape) {
                        case 'cylindrical':
                            const inputType = document.getElementById('calc-input-type').value;
                            const mainInput = parseFloat(document.getElementById('calc-main-input').value);
                            if (isNaN(mainInput)) throw new Error('Invalid input for cylindrical tank.');
                            let radiusMM = 0;
                            if (inputType === 'diameter') { radiusMM = (mainInput * unitMultiplier) / 2; } 
                            else if (inputType === 'radius') { radiusMM = mainInput * unitMultiplier; } 
                            else { radiusMM = (mainInput * unitMultiplier) / (2 * Math.PI); }
                            rawVolumeMM3 = Math.PI * Math.pow(radiusMM, 2) * (fillingHeight * unitMultiplier);
                            break;
                        case 'cube':
                            const side = parseFloat(document.getElementById('calc-side').value);
                            if (isNaN(side)) throw new Error('Invalid input for cube side.');
                            rawVolumeMM3 = Math.pow(side * unitMultiplier, 2) * (fillingHeight * unitMultiplier);
                            break;
                        case 'cuboid':
                            const length = parseFloat(document.getElementById('calc-length').value);
                            const width = parseFloat(document.getElementById('calc-width').value);
                            if (isNaN(length) || isNaN(width)) throw new Error('Invalid input for cuboid dimensions.');
                            rawVolumeMM3 = (length * unitMultiplier) * (width * unitMultiplier) * (fillingHeight * unitMultiplier);
                            break;
                    }
                    const volumeInLiters = rawVolumeMM3 / 1000000;
                    const mediaWeightKg = volumeInLiters * density;
                    document.getElementById('calc-volume-result').textContent = volumeInLiters.toFixed(2);
                    document.getElementById('calc-weight-result').textContent = Math.round(mediaWeightKg);
                } catch (error) {
                    alert(error.message);
                }
            }
            
            function resetCalculator() {
                const inputs = calculatorBody.querySelectorAll('input');
                inputs.forEach(input => input.value = '');
                document.getElementById('calc-volume-result').textContent = '0.00';
                document.getElementById('calc-weight-result').textContent = '0';
            }
        });
    </script>
</Layout>