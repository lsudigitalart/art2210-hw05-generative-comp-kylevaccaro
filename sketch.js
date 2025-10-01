// Cat Scratch Interactive Art
// Kyle Vaccaro - ART2210 HW05

let scratches = []; // Array to store all scratch marks
let isScratching = false;
let sensitivity = 0.8; // How sensitive the scratching is (0.5-1.0)
let lastScratchDistance = 0; // Track distance since last scratch

// Fish tank elements
let bubbles = [];
let fish = [];
let seaweed = [];

function setup() {
  createCanvas(800, 600);
  
  // Draw fish tank background
  drawFishTank();
  
  // Change cursor to crosshair to feel more like a paw
  cursor(CROSS);
}

function draw() {
  // Update and draw fish tank elements (behind scratches)
  updateFishTank();
  
  // Draw all existing scratches (on top of fish tank)
  for (let scratch of scratches) {
    drawScratch(scratch);
  }
  
  // If mouse is pressed and moving, create new scratch marks
  if (mouseIsPressed) {
    // Calculate distance moved since last frame
    let distance = dist(mouseX, mouseY, pmouseX, pmouseY);
    lastScratchDistance += distance;
    
    // Only create new scratches after moving a smaller distance (less dotting but still continuous)
    if (lastScratchDistance > 5) {
      createScratchMarks(mouseX, mouseY, pmouseX, pmouseY);
      lastScratchDistance = 0; // Reset distance counter
    }
  }
}

function createScratchMarks(x, y, px, py) {
  // Create 2-3 claw marks (cats typically have 3 main claws that show)
  let numClaws = floor(random(2, 4));
  
  for (let i = 0; i < numClaws; i++) {
    // Calculate perpendicular offset for parallel scratches
    let angle = atan2(y - py, x - px);
    let perpAngle = angle + PI/2;
    
    // Wider spacing between claws (scaled up claw marks)
    let offset = (i - numClaws/2) * random(10, 16);
    let offsetX = cos(perpAngle) * offset;
    let offsetY = sin(perpAngle) * offset;
    
    // Add some chaos/jitter to make it look more frantic (scaled up slightly)
    let jitterX = random(-3, 3) * sensitivity;
    let jitterY = random(-3, 3) * sensitivity;
    
    // Create scratch object (back to original approach but with slight spacing control)
    let scratch = {
      x1: px + offsetX + jitterX,
      y1: py + offsetY + jitterY,
      x2: x + offsetX + jitterX,
      y2: y + offsetY + jitterY,
      thickness: random(2, 4)
    };
    
    scratches.push(scratch);
  }
  
  // Keep array from getting too long (performance)
  if (scratches.length > 1000) {
    scratches.splice(0, 100); // Remove oldest scratches
  }
}

function drawScratch(scratch) {
  // Draw white scratch marks (no fading - permanent until cleared)
  stroke(255, 255, 255);
  strokeWeight(scratch.thickness);
  strokeCap(ROUND);
  
  line(scratch.x1, scratch.y1, scratch.x2, scratch.y2);
}

function keyPressed() {
  // Press 'c' to clear all scratches
  if (key === 'c' || key === 'C') {
    scratches = [];
    drawFishTank(); // Redraw the fish tank
  }
  
  // Press 's' to save the current scratch art
  if (key === 's' || key === 'S') {
    saveCanvas('cat-scratches', 'png');
  }
  
  // Press spacebar to change sensitivity
  if (key === ' ') {
    sensitivity = random(0.3, 1.0);
    console.log("Scratch sensitivity: " + sensitivity.toFixed(2));
  }
}

function drawFishTank() {
  // Simple gradient water background
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(120, 200, 255), color(40, 140, 200), inter);
    stroke(c);
    line(0, y, width, y);
  }
  
  // Add tank floor
  drawTankFloor();
  
  // Draw static fish (pixel art style)
  drawFish(200, 150, 80, color(255, 150, 50)); // Orange fish
  drawFish(500, 350, 70, color(50, 150, 255)); // Blue fish
  
  // Add glass reflection effect
  drawGlassReflection();
  
  // Add tank frame at top and bottom
  drawTankFrame();
}

function updateFishTank() {
  // Static tank - no updates needed for now
  // We can add simple animations later if you like the design
}

function drawFish(x, y, size, fishColor) {
  push();
  translate(x, y);
  
  // Fish body (clean, no stroke)
  fill(fishColor);
  noStroke();
  ellipse(0, 0, size, size * 0.6);
  
  // Fish tail (darker shade of same color)
  fill(red(fishColor) - 50, green(fishColor) - 50, blue(fishColor) - 50);
  triangle(-size/2, 0, -size * 0.8, -size/3, -size * 0.8, size/3);
  
  // Small fins
  fill(fishColor);
  ellipse(0, size/4, size/3, size/6); // Bottom fin
  
  pop();
}

function drawGlassReflection() {
  // Large glass reflection effects across the whole surface
  stroke(255, 255, 255, 100);
  strokeWeight(8);
  
  // Main large reflection streaks across the glass
  line(0, 0, width/2, height/2);
  line(width/4, 0, width * 0.75, height/2);
  
  // Secondary reflection streaks
  stroke(255, 255, 255, 60);
  strokeWeight(6);
  line(width/2, 0, width, height/3);
  line(0, height/4, width/3, height);
  
  // Horizontal reflections (like light bars)
  stroke(255, 255, 255, 80);
  strokeWeight(5);
  line(0, height/6, width, height/6);
  line(0, height/2, width/2, height/2);
  
  // Subtle highlight along edges
  stroke(255, 255, 255, 70);
  strokeWeight(6);
  line(0, 35, width, 35); // Top edge (moved down to account for frame)
  line(15, 30, 15, height - 30); // Left edge (adjusted for frames)
}

function drawTankFrame() {
  // Top frame
  fill(80, 80, 80);
  noStroke();
  rect(0, 0, width, 30);
  
  // Bottom frame
  rect(0, height - 30, width, 30);
  
  // Add some depth/shadow to frames
  fill(60, 60, 60);
  rect(0, 25, width, 5); // Top frame shadow
  rect(0, height - 30, width, 5); // Bottom frame highlight
  
  fill(100, 100, 100);
  rect(0, 30, width, 5); // Top frame highlight
  rect(0, height - 5, width, 5); // Bottom frame shadow
}

function drawTankFloor() {
  // Tank floor - darker blue band above the bottom frame
  fill(20, 80, 120);
  noStroke();
  rect(0, height - 80, width, 50);
  
  // Add some texture/gradient to the floor
  for (let y = height - 80; y < height - 30; y += 2) {
    let alpha = map(y, height - 80, height - 30, 60, 20);
    stroke(10, 50, 80, alpha);
    line(0, y, width, y);
  }
  
  // Optional: add a few small rocks/pebbles on the floor
  fill(40, 60, 80);
  noStroke();
  ellipse(150, height - 50, 8, 6);
  ellipse(300, height - 45, 6, 4);
  ellipse(500, height - 55, 10, 8);
  ellipse(650, height - 48, 7, 5);
}
