// Pancake Stack Data Structure (same as before)
class PancakeStack {
    constructor() {
        this.stack = [];
    }

    add(size) {
        this.stack.push(size);
    }

    serve() {
        if (this.stack.length === 0) {
            return -1;
        }
        return this.stack.pop();
    }

    asArray() {
        return [...this.stack];
    }
}

// Basic pancake visualization
function drawPancakeStack(pancakes) {
    const canvas = document.getElementById('pancakeCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const centerX = canvas.width / 2;
    const baseY = canvas.height - 20;
    const pancakeHeight = 20;
    pancakes.slice().reverse().forEach((size, idx) => {
        const y = baseY - idx * (pancakeHeight + 2);
        ctx.beginPath();
        ctx.ellipse(centerX, y, size * 2, pancakeHeight / 2, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#DEB887';
        ctx.fill();
        ctx.strokeStyle = '#A0522D';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.font = 'bold 12px Arial';
        ctx.fillStyle = '#574028';
        ctx.fillText(size, centerX - 8, y + 4);
    });
}

// Handler for running commands AND visualizing each step
function runCommands() {
    const commandsInput = document.getElementById('commands').value.trim();
    if (!commandsInput) {
        document.getElementById('output').textContent = "Please enter commands first.";
        drawPancakeStack([]);
        return;
    }

    const commands = commandsInput.split('\n').map(cmd => cmd.trim()).filter(cmd => cmd);
    const stack = new PancakeStack();
    const results = [];
    let visualSteps = [];

    // Precompute steps for animation
    commands.forEach(command => {
        if (command.startsWith('ADD')) {
            const size = parseInt(command.split(' ')[1]);
            if (!isNaN(size)) {
                stack.add(size);
                visualSteps.push(stack.asArray());
            }
        } else if (command === 'SERVE') {
            stack.serve();
            visualSteps.push(stack.asArray());
            results.push(stack.stack.length ? stack.stack[stack.stack.length] : -1);
        }
    });

    // Output
    document.getElementById('output').textContent = results.length > 0
        ? results.join(', ')
        : "No SERVE commands executed.";

    // Animate stack steps
    let i = 0;
    function animateStack() {
        if (i < visualSteps.length) {
            drawPancakeStack(visualSteps[i]);
            i++;
            setTimeout(animateStack, 500); // Adjust speed as you like
        } else {
            drawPancakeStack(stack.asArray()); // Final state
        }
    }
    animateStack();
}

function resetStack() {
    document.getElementById('commands').value = '';
    document.getElementById('output').textContent = '';
    drawPancakeStack([]);
}

// Draw empty stack at load
window.onload = function() {
    drawPancakeStack([]);
};
