// Pancake Stack Data Structure (same as before)
class PancakeStack {
    constructor() {
        this.stack = [];
    }

    add(size) {
        this.stack.push(size);
        addPancakeImage(size); // Add pancake image to DOM
    }

    serve() {
        if (this.stack.length === 0) {
            return -1;
        }
        const servedSize = this.stack.pop();
        removeTopPancakeImage(); // Remove pancake image from DOM
        return servedSize;
    }

    asArray() {
        return [...this.stack];
    }
}

// Global variables for animation
let currentAnimationFrame = null;
let globalStack = new PancakeStack(); // Persistent stack for interactive serving
let serveOutputResults = []; // Track served pancakes for output
let pancakeImage = null; // Loaded pancake image for canvas
let pancakeImageElements = []; // Array to track DOM pancake image elements

// Load pancake image for canvas
function loadPancakeImage() {
    const img = new Image();
    img.onload = () => {
        pancakeImage = img;
        // Redraw stack if already initialized
        if (globalStack) {
            drawPancakeStack(globalStack.asArray(), false, null);
        }
    };
    img.src = 'pancake.png';
}

// Add pancake image to DOM stack with drop animation
function addPancakeImage(size) {
    const container = document.getElementById('pancakeStackContainer');
    if (!container) return;
    
    // Calculate position based on current stack height
    const stackHeight = pancakeImageElements.length;
    const pancakeSpacing = 25;
    const finalY = stackHeight * pancakeSpacing; // Stack from top down
    const startY = -100; // Start from above the container
    
    const pancakeImg = document.createElement('img');
    pancakeImg.src = 'pancake.png';
    pancakeImg.alt = `Pancake size ${size}`;
    pancakeImg.className = 'stacked-pancake';
    pancakeImg.style.width = `${Math.max(80, size * 5)}px`;
    pancakeImg.style.height = 'auto';
    pancakeImg.style.transition = 'none';
    pancakeImg.style.opacity = '1';
    pancakeImg.style.position = 'absolute';
    pancakeImg.style.left = '50%';
    pancakeImg.style.transform = `translateX(-50%) translateY(${startY}px)`;
    pancakeImg.style.zIndex = stackHeight + 1;
    
    // Add size label
    const label = document.createElement('div');
    label.textContent = size;
    label.className = 'pancake-size-label';
    label.style.position = 'absolute';
    label.style.top = '50%';
    label.style.left = '50%';
    label.style.transform = 'translate(-50%, -50%)';
    label.style.color = '#FFFFFF';
    label.style.fontWeight = 'bold';
    label.style.fontSize = '16px';
    label.style.textShadow = '0 0 6px rgba(0, 0, 0, 0.9)';
    label.style.pointerEvents = 'none';
    label.style.zIndex = stackHeight + 2;
    
    const wrapper = document.createElement('div');
    wrapper.className = 'pancake-wrapper';
    wrapper.style.position = 'absolute';
    wrapper.style.top = '0';
    wrapper.style.left = '50%';
    wrapper.style.transform = `translateX(-50%)`;
    wrapper.style.zIndex = 1000 - stackHeight; // Higher z-index for items at top
    wrapper.appendChild(pancakeImg);
    wrapper.appendChild(label);
    
    container.appendChild(wrapper);
    pancakeImageElements.push(wrapper);
    
    // Animate drop with bounce
    requestAnimationFrame(() => {
        const duration = 600;
        const startTime = Date.now();
        const easeOutBounce = (t) => {
            if (t < 1/2.75) {
                return 7.5625 * t * t;
            } else if (t < 2/2.75) {
                return 7.5625 * (t -= 1.5/2.75) * t + 0.75;
            } else if (t < 2.5/2.75) {
                return 7.5625 * (t -= 2.25/2.75) * t + 0.9375;
            } else {
                return 7.5625 * (t -= 2.625/2.75) * t + 0.984375;
            }
        };
        
        function animateDrop() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutBounce(progress);
            const currentY = startY + (finalY - startY) * eased;
            
            pancakeImg.style.transform = `translateX(-50%) translateY(${currentY}px)`;
            
            if (progress < 1) {
                requestAnimationFrame(animateDrop);
            } else {
                // Final position
                wrapper.style.top = `${finalY}px`;
                pancakeImg.style.position = 'relative';
                pancakeImg.style.transform = 'translateX(-50%)';
            }
        }
        
        animateDrop();
    });
}

// Remove top pancake image from DOM stack with animation
function removeTopPancakeImage() {
    const container = document.getElementById('pancakeStackContainer');
    if (!container || pancakeImageElements.length === 0) return;
    
    const topPancake = pancakeImageElements.pop();
    const img = topPancake.querySelector('img');
    
    // Animate out - slide up and fade
    if (img) {
        img.style.transition = 'all 0.5s ease';
        img.style.opacity = '0';
        img.style.transform = 'translateX(-50%) translateY(-100px) scale(0.8)';
    }
    
    setTimeout(() => {
        if (topPancake.parentNode) {
            topPancake.parentNode.removeChild(topPancake);
        }
    }, 500);
}

// Clear all pancake images
function clearAllPancakeImages() {
    const container = document.getElementById('pancakeStackContainer');
    if (!container) return;
    
    pancakeImageElements.forEach(wrapper => {
        const img = wrapper.querySelector('img');
        if (img) {
            img.style.opacity = '0';
            img.style.transform = 'scale(0.5)';
        }
    });
    
    setTimeout(() => {
        container.innerHTML = '';
        pancakeImageElements = [];
    }, 300);
}

// Draw Mini PEKKA character
function drawMiniPEKKA(ctx, x, y, scale = 1) {
    const size = 40 * scale;
    // Body (simplified PEKKA shape)
    ctx.fillStyle = '#8B0000';
    ctx.beginPath();
    ctx.arc(x, y, size * 0.4, 0, Math.PI * 2);
    ctx.fill();
    
    // Eyes
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.arc(x - size * 0.15, y - size * 0.1, size * 0.08, 0, Math.PI * 2);
    ctx.arc(x + size * 0.15, y - size * 0.1, size * 0.08, 0, Math.PI * 2);
    ctx.fill();
    
    // Arms (receiving position)
    ctx.strokeStyle = '#8B0000';
    ctx.lineWidth = 6 * scale;
    ctx.beginPath();
    ctx.moveTo(x - size * 0.3, y);
    ctx.lineTo(x - size * 0.5, y + size * 0.2);
    ctx.moveTo(x + size * 0.3, y);
    ctx.lineTo(x + size * 0.5, y + size * 0.2);
    ctx.stroke();
}

// Simplified visualization - just draw background/counter
function drawPancakeStack(pancakes, highlightTop = false, servingInfo = null) {
    const canvas = document.getElementById('pancakeCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw kitchen counter with gradient for depth
    const counterGradient = ctx.createLinearGradient(0, canvas.height - 40, 0, canvas.height);
    counterGradient.addColorStop(0, '#A0826D');
    counterGradient.addColorStop(1, '#8B7355');
    ctx.fillStyle = counterGradient;
    ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
    
    // Counter shadow/top edge
    ctx.fillStyle = '#654321';
    ctx.fillRect(0, canvas.height - 40, canvas.width, 3);
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, canvas.height - 40, canvas.width, 40);
    
    // Draw shadow under stack for depth (optional visual effect)
    const centerX = canvas.width / 2;
    const baseY = canvas.height - 50;
    if (pancakes.length > 0) {
        const shadowWidth = 100;
        const shadowGradient = ctx.createRadialGradient(centerX, baseY + 10, 0, centerX, baseY + 10, shadowWidth);
        shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0.2)');
        shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = shadowGradient;
        ctx.fillRect(centerX - shadowWidth, baseY + 5, shadowWidth * 2, shadowWidth * 0.5);
    }
    
    // Pancakes are now DOM elements, not drawn on canvas
}

// Draw Mini PEKKA receiving pancake
function drawReceivingPEKKA(hasPancake = false) {
    const canvas = document.getElementById('miniPEKKACanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const x = canvas.width - 80;
    const y = canvas.height - 130;
    
    drawMiniPEKKA(ctx, x, y, 1);
    
    if (hasPancake) {
        // Draw happy expression or pancake in hands
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.ellipse(x, y + 20, 25, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#A0522D';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

// Handler for running commands with proper input format and visualization
function runCommands() {
    const commandsInput = document.getElementById('commands').value.trim();
    if (!commandsInput) {
        document.getElementById('output').textContent = "Please enter commands first.";
        drawPancakeStack([], false, null);
        drawReceivingPEKKA(false);
        return;
    }

    const lines = commandsInput.split('\n').map(cmd => cmd.trim()).filter(cmd => cmd);
    if (lines.length === 0) {
        document.getElementById('output').textContent = "Please enter commands first.";
        return;
    }

    // First line should be N (number of commands)
    const N = parseInt(lines[0]);
    if (isNaN(N) || N < 1 || N > 1000) {
        document.getElementById('output').textContent = "Error: First line must be a number N (1 ≤ N ≤ 1000)";
        return;
    }

    // Get the actual commands (skip first line)
    const commands = lines.slice(1, N + 1);
    
    // Reset global stack when running all commands
    globalStack = new PancakeStack();
    serveOutputResults = [];
    const results = [];
    let visualSteps = [];
    let serveSteps = []; // Track which steps are SERVE operations

    // Process commands and build visualization steps
    commands.forEach((command, index) => {
        if (command.startsWith('ADD')) {
            const size = parseInt(command.split(' ')[1]);
            if (isNaN(size) || size < 1 || size > 100) {
                return; // Skip invalid commands
            }
            // Store stack state before adding
            const stackBefore = globalStack.asArray();
            globalStack.add(size);
            visualSteps.push({
                stack: globalStack.asArray(),
                stackBefore: stackBefore,
                isServe: false,
                isAdd: true,
                addedSize: size,
                servedSize: null
            });
        } else if (command === 'SERVE') {
            const served = globalStack.serve();
            results.push(served);
            if (served !== -1) {
                serveOutputResults.push(served);
            }
            visualSteps.push({
                stack: globalStack.asArray(),
                isServe: true,
                isAdd: false,
                servedSize: served
            });
        }
    });

    // Output format: one number per line for each SERVE
    document.getElementById('output').textContent = results.length > 0
        ? results.join('\n')
        : "No SERVE commands executed.";

    // Animate stack visualization with serving effects
    let stepIndex = 0;
    
    function animateStack() {
        if (stepIndex < visualSteps.length) {
            const step = visualSteps[stepIndex];
            const isServingStep = step.isServe;
            
            if (isServingStep) {
                if (step.servedSize === -1) {
                    // Empty stack - show message briefly
                    drawPancakeStack(step.stack, false, null);
                    drawReceivingPEKKA(false);
                    // Show sad PEKKA or empty hands
                    setTimeout(() => {
                        stepIndex++;
                        setTimeout(animateStack, 600);
                    }, 800);
                } else {
                    // Normal serving - highlight top pancake first
                    // Need to show stack BEFORE serving (with the pancake that will be served)
                    // The stack state after serve doesn't have it, so we need to reconstruct
                    const stackBeforeServe = [...step.stack, step.servedSize];
                    drawPancakeStack(stackBeforeServe, true, null);
                    drawReceivingPEKKA(false);
                    
                    // Then animate the serving
                    setTimeout(() => {
                        animateServing(step.servedSize, step.stack, () => {
                            stepIndex++;
                            setTimeout(animateStack, 300);
                        });
                    }, 400);
                }
            } else {
                // ADD command - animate pancake dropping in
                if (step.isAdd && step.addedSize) {
                    animateAdding(step.stackBefore, step.addedSize, step.stack, () => {
                        stepIndex++;
                        setTimeout(animateStack, 300);
                    });
                } else {
                    drawPancakeStack(step.stack, false, null);
                    drawReceivingPEKKA(false);
                    stepIndex++;
                    setTimeout(animateStack, 600);
                }
            }
        } else {
            // Final state
            const finalStack = globalStack.asArray();
            drawPancakeStack(finalStack, false, null);
            drawReceivingPEKKA(false);
        }
    }
    
    // Animate adding pancake (drop-in effect)
    function animateAdding(stackBefore, addedSize, finalStack, onComplete) {
        let progress = 0;
        const duration = 600;
        const startTime = Date.now();
        const canvas = document.getElementById('pancakeCanvas');
        const centerX = canvas.width / 2;
        const baseY = canvas.height - 50;
        const pancakeSpacing = 30;
        const startY = -50; // Start above canvas
        const finalY = baseY - stackBefore.length * pancakeSpacing;
        const maxSize = Math.max(...finalStack);
        const widthScale = Math.min(1, (canvas.width * 0.35) / (maxSize * 2));
        const pancakeWidth = Math.max(40, addedSize * 2 * widthScale);
        
        function animate() {
            const elapsed = Date.now() - startTime;
            progress = Math.min(elapsed / duration, 1);
            
            // Ease-out bounce effect
            const easeOutBounce = (t) => {
                if (t < 1/2.75) {
                    return 7.5625 * t * t;
                } else if (t < 2/2.75) {
                    return 7.5625 * (t -= 1.5/2.75) * t + 0.75;
                } else if (t < 2.5/2.75) {
                    return 7.5625 * (t -= 2.25/2.75) * t + 0.9375;
                } else {
                    return 7.5625 * (t -= 2.625/2.75) * t + 0.984375;
                }
            };
            
            const eased = easeOutBounce(progress);
            const currentY = startY + (finalY - startY) * eased;
            
            // Draw stack before adding, then overlay the dropping pancake
            if (progress < 1) {
                drawPancakeStack(stackBefore, false, null);
                
                // Draw dropping pancake on top
                const ctx = canvas.getContext('2d');
                const imageHeight = 32 + 4;
                
                if (pancakeImage && pancakeImage.complete) {
                    // Draw actual pancake image
                    ctx.shadowColor = 'rgba(255, 215, 0, 0.5)';
                    ctx.shadowBlur = 10;
                    ctx.drawImage(
                        pancakeImage,
                        centerX - pancakeWidth,
                        currentY - imageHeight / 2,
                        pancakeWidth * 2,
                        imageHeight
                    );
                    ctx.shadowBlur = 0;
                    ctx.strokeStyle = '#8B4513';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.ellipse(centerX, currentY, pancakeWidth, imageHeight / 2, 0, 0, Math.PI * 2);
                    ctx.stroke();
                } else {
                    // Fallback gradient
                    const pancakeGradient = ctx.createLinearGradient(
                        centerX - pancakeWidth, currentY - 16,
                        centerX + pancakeWidth, currentY + 16
                    );
                    pancakeGradient.addColorStop(0, '#F4D03F');
                    pancakeGradient.addColorStop(0.5, '#FFD700');
                    pancakeGradient.addColorStop(1, '#DEB887');
                    
                    ctx.beginPath();
                    ctx.ellipse(centerX, currentY, pancakeWidth, 16, 0, 0, Math.PI * 2);
                    ctx.fillStyle = pancakeGradient;
                    ctx.shadowColor = 'rgba(255, 215, 0, 0.5)';
                    ctx.shadowBlur = 10;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                    ctx.strokeStyle = '#8B4513';
                    ctx.lineWidth = 3;
                    ctx.stroke();
                }
                
                ctx.fillStyle = '#FFFFFF';
                ctx.font = 'bold 14px Arial';
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
                ctx.shadowBlur = 4;
                ctx.fillText(addedSize, centerX, currentY);
                ctx.shadowBlur = 0;
                
                currentAnimationFrame = requestAnimationFrame(animate);
            } else {
                // Final state
                drawPancakeStack(finalStack, false, null);
                if (onComplete) onComplete();
            }
        }
        
        animate();
    }
    
    // Start animation
    animateStack();
}

// Animate serving pancake to Mini PEKKA (global function)
function animateServing(pancakeSize, currentStack, onComplete) {
    let progress = 0;
    const duration = 800; // milliseconds
    const startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        progress = Math.min(elapsed / duration, 1);
        
        // Draw stack without the serving pancake
        drawPancakeStack(currentStack, false, {
            pancakeSize: pancakeSize,
            progress: progress
        });
        
        if (progress < 0.5) {
            drawReceivingPEKKA(false);
        } else {
            drawReceivingPEKKA(true);
        }
        
        if (progress < 1) {
            currentAnimationFrame = requestAnimationFrame(animate);
        } else {
            if (onComplete) onComplete();
        }
    }
    
    animate();
}

// Add pancake directly without typing command
function addPancakeDirectly() {
    // Cancel any ongoing animations
    if (currentAnimationFrame) {
        cancelAnimationFrame(currentAnimationFrame);
        currentAnimationFrame = null;
    }
    
    // Get the current stack to find the last pancake size
    const currentStackArray = globalStack.asArray();
    let pancakeSize;
    
    if (currentStackArray.length === 0) {
        // If stack is empty, start with a random size between 10 and 20
        pancakeSize = Math.floor(Math.random() * 11) + 10;
    } else {
        // Get the last (top) pancake size
        const lastPancakeSize = currentStackArray[currentStackArray.length - 1];
        // Add 2 or 3 randomly
        const increment = Math.random() < 0.5 ? 2 : 3;
        pancakeSize = lastPancakeSize + increment;
    }
    
    // Add to stack
    globalStack.add(pancakeSize);
    
    // Update visualization
    drawPancakeStack(globalStack.asArray(), false, null);
    drawReceivingPEKKA(false);
}

// Serve one pancake interactively
function serveOnePancake() {
    // Cancel any ongoing animations
    if (currentAnimationFrame) {
        cancelAnimationFrame(currentAnimationFrame);
        currentAnimationFrame = null;
    }
    
    const served = globalStack.serve();
    
    // Play the video when serving
    const video = document.getElementById('pekkaEatingVideo');
    if (video) {
        video.currentTime = 0; // Reset to start
        video.play().catch(err => console.log('Video play failed:', err));
    }
    
    if (served === -1) {
        // Empty stack
        document.getElementById('output').textContent = serveOutputResults.length > 0
            ? serveOutputResults.join('\n') + '\n-1'
            : '-1';
        drawPancakeStack([], false, null);
        drawReceivingPEKKA(false);
    } else {
        // Add to output results
        serveOutputResults.push(served);
        document.getElementById('output').textContent = serveOutputResults.join('\n');
        
        // Show stack before serving, then animate
        const stackBeforeServe = [...globalStack.asArray(), served];
        drawPancakeStack(stackBeforeServe, true, null);
        drawReceivingPEKKA(false);
        
        // Animate the serving
        setTimeout(() => {
            animateServing(served, globalStack.asArray(), () => {
                // Animation complete
            });
        }, 400);
    }
}

function resetStack() {
    document.getElementById('commands').value = '';
    document.getElementById('output').textContent = '';
    globalStack = new PancakeStack();
    serveOutputResults = [];
    clearAllPancakeImages(); // Clear all pancake images
    drawPancakeStack([], false, null);
    drawReceivingPEKKA(false);
    // Cancel any ongoing animations
    if (currentAnimationFrame) {
        cancelAnimationFrame(currentAnimationFrame);
        currentAnimationFrame = null;
    }
}

// Initialize visualization on page load
window.addEventListener('DOMContentLoaded', () => {
    globalStack = new PancakeStack();
    serveOutputResults = [];
    pancakeImageElements = [];
    loadPancakeImage(); // Load pancake image for canvas
    drawPancakeStack([], false, null);
    drawReceivingPEKKA(false);
});
