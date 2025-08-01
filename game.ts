enum CellType {
    EMPTY = 'empty',
    OBSTACLE = 'obstacle',
    FOOD = 'food',
    PUPPY = 'puppy'
}

enum Direction {
    NORTH = 0,
    EAST = 1,
    SOUTH = 2,
    WEST = 3
}

enum InstructionType {
    FORWARD = 'forward',
    TURN_LEFT = 'turnLeft',
    TURN_RIGHT = 'turnRight',
    JUMP = 'jump'
}

enum ProgramElementType {
    INSTRUCTION = 'instruction',
    LOOP = 'loop'
}

interface Position {
    x: number;
    y: number;
}

class Cell {
    type: CellType;
    element: HTMLElement;
    private emoji: string;

    constructor(type: CellType = CellType.EMPTY) {
        this.type = type;
        this.element = document.createElement('div');
        this.element.className = `cell ${type}`;
        this.emoji = '';
        this.updateDisplay();
    }

    setType(type: CellType) {
        this.type = type;
        this.element.className = `cell ${type}`;
        
        // Generate new emoji when type changes (except for puppy)
        if (type === CellType.OBSTACLE) {
            const obstacleEmojis = ['🌲', '🌳'];
            this.emoji = obstacleEmojis[Math.floor(Math.random() * obstacleEmojis.length)];
        } else if (type === CellType.FOOD) {
            const foodEmojis = ['🍖', '🍗', '🥓'];
            this.emoji = foodEmojis[Math.floor(Math.random() * foodEmojis.length)];
        } else {
            this.emoji = '';
        }
        
        this.updateDisplay();
    }

    private updateDisplay() {
        switch (this.type) {
            case CellType.EMPTY:
                this.element.textContent = '';
                break;
            case CellType.OBSTACLE:
                this.element.textContent = this.emoji;
                break;
            case CellType.FOOD:
                this.element.textContent = this.emoji;
                break;
            case CellType.PUPPY:
                // Puppy display will be handled by the puppy object itself
                this.element.textContent = '';
                break;
        }
    }
}

class Puppy {
    position: Position;
    direction: Direction;
    element: HTMLElement;

    constructor(x: number, y: number) {
        this.position = { x, y };
        this.direction = Direction.NORTH;
        this.element = document.createElement('div');
        this.element.className = 'puppy';
        this.updateDisplay();
    }

    turnLeft() {
        this.direction = (this.direction + 3) % 4;
        this.updateDisplay();
    }

    turnRight() {
        this.direction = (this.direction + 1) % 4;
        this.updateDisplay();
    }

    getNextPosition(steps: number = 1): Position {
        const { x, y } = this.position;
        switch (this.direction) {
            case Direction.NORTH:
                return { x, y: y - steps };
            case Direction.EAST:
                return { x: x + steps, y };
            case Direction.SOUTH:
                return { x, y: y + steps };
            case Direction.WEST:
                return { x: x - steps, y };
            default:
                return { x, y };
        }
    }

    private updateDisplay() {
        const arrows = ['↑', '→', '↓', '←'];
        this.element.textContent = `🐶${arrows[this.direction]}`;
    }
}

class SeededRandom {
    private seed: number;

    constructor(seed: number) {
        this.seed = seed;
    }

    next(): number {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }

    nextInt(min: number, max: number): number {
        return Math.floor(this.next() * (max - min)) + min;
    }
}

class GameBoard {
    width: number;
    height: number;
    cells: Cell[][];
    puppy: Puppy;
    element: HTMLElement;
    foodCount: number;
    seed: number;
    random: SeededRandom;

    constructor(width: number = 5, height: number = 5, seed?: number) {
        this.width = width;
        this.height = height;
        this.cells = [];
        this.foodCount = 0;
        this.element = document.getElementById('game-board')!;
        this.puppy = new Puppy(0, 0);
        
        // Get seed from URL parameter or generate random one
        const urlParams = new URLSearchParams(window.location.search);
        const seedParam = urlParams.get('seed');
        this.seed = seed || (seedParam ? parseInt(seedParam) : Math.floor(Math.random() * 1000000));
        this.random = new SeededRandom(this.seed);
        
        // Update URL with current seed if not present
        if (!seedParam && !seed) {
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set('seed', this.seed.toString());
            window.history.replaceState({}, '', newUrl);
        }
        
        this.initializeBoard();
        this.setupLevel();
        this.updateSeedDisplay();
    }

    private initializeBoard() {
        this.element.style.gridTemplateColumns = `repeat(${this.width}, 1fr)`;
        this.element.style.gridTemplateRows = `repeat(${this.height}, 1fr)`;
        
        for (let y = 0; y < this.height; y++) {
            this.cells[y] = [];
            for (let x = 0; x < this.width; x++) {
                const cell = new Cell();
                this.cells[y][x] = cell;
                this.element.appendChild(cell.element);
            }
        }
    }

    private setupLevel() {
        this.generateRandomLevel();
        
        // Place puppy at starting position
        this.placePuppy(0, 0);
        
        this.updateFoodCounter();
    }

    private generateRandomLevel() {
        const totalCells = this.width * this.height;
        const maxObstacles = Math.floor(totalCells * 0.25); // Up to 25% obstacles
        const maxFood = Math.floor(totalCells * 0.3); // Up to 30% food
        
        // Generate obstacles (avoid starting position)
        const numObstacles = this.random.nextInt(2, maxObstacles + 1);
        for (let i = 0; i < numObstacles; i++) {
            let x, y;
            do {
                x = this.random.nextInt(0, this.width);
                y = this.random.nextInt(0, this.height);
            } while ((x === 0 && y === 0) || this.cells[y][x].type !== CellType.EMPTY);
            
            this.setCell(x, y, CellType.OBSTACLE);
        }
        
        // Generate food items (avoid starting position and obstacles)
        const numFood = this.random.nextInt(3, maxFood + 1);
        for (let i = 0; i < numFood; i++) {
            let x, y;
            do {
                x = this.random.nextInt(0, this.width);
                y = this.random.nextInt(0, this.height);
            } while ((x === 0 && y === 0) || this.cells[y][x].type !== CellType.EMPTY);
            
            this.setCell(x, y, CellType.FOOD);
        }
    }

    setCell(x: number, y: number, type: CellType) {
        if (this.isValidPosition(x, y)) {
            this.cells[y][x].setType(type);
            if (type === CellType.FOOD) {
                this.foodCount++;
            }
        }
    }

    placePuppy(x: number, y: number) {
        if (this.isValidPosition(x, y)) {
            // Clear puppy from old position
            if (this.isValidPosition(this.puppy.position.x, this.puppy.position.y)) {
                const oldCell = this.cells[this.puppy.position.y][this.puppy.position.x];
                if (oldCell.type === CellType.PUPPY) {
                    oldCell.setType(CellType.EMPTY);
                }
            }
            
            // Place puppy at new position
            this.puppy.position = { x, y };
            const currentCell = this.cells[y][x];
            
            // Check if puppy found food
            if (currentCell.type === CellType.FOOD) {
                this.foodCount--;
                this.updateFoodCounter();
                this.showMessage('Woof! Found food! 🦴');
            }
            
            currentCell.setType(CellType.PUPPY);
            // Always show puppy with direction arrow
            this.updatePuppyDisplay();
        }
    }

    isValidPosition(x: number, y: number): boolean {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    canMoveTo(x: number, y: number): boolean {
        if (!this.isValidPosition(x, y)) return false;
        const cell = this.cells[y][x];
        return cell.type !== CellType.OBSTACLE;
    }

    movePuppy(newX: number, newY: number): boolean {
        if (this.canMoveTo(newX, newY)) {
            this.placePuppy(newX, newY);
            return true;
        }
        return false;
    }

    private updateFoodCounter() {
        const counter = document.getElementById('food-count')!;
        counter.textContent = this.foodCount.toString();
        
        if (this.foodCount === 0) {
            this.showMessage('🎉 Congratulations! All food collected! 🎉');
        }
    }

    private updateSeedDisplay() {
        const seedElement = document.getElementById('seed-value')!;
        seedElement.textContent = this.seed.toString();
    }

    private showMessage(message: string) {
        const statusElement = document.getElementById('status-message')!;
        statusElement.textContent = message;
        setTimeout(() => {
            if (statusElement.textContent === message) {
                statusElement.textContent = 'Ready to play! 🎮';
            }
        }, 3000);
    }

    reset() {
        // Clear puppy from current position first
        if (this.isValidPosition(this.puppy.position.x, this.puppy.position.y)) {
            const currentCell = this.cells[this.puppy.position.y][this.puppy.position.x];
            if (currentCell.type === CellType.PUPPY) {
                currentCell.setType(CellType.EMPTY);
            }
        }
        
        // Reset puppy to starting position
        this.puppy = new Puppy(0, 0);
        this.placePuppy(0, 0);
        this.showMessage('Game reset! Ready to play! 🎮');
    }

    newLevel() {
        // Generate new seed for a fresh level
        this.seed = Math.floor(Math.random() * 1000000);
        this.random = new SeededRandom(this.seed);
        
        // Update URL with new seed
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('seed', this.seed.toString());
        window.history.replaceState({}, '', newUrl);
        
        // Clear all cells
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.cells[y][x].setType(CellType.EMPTY);
            }
        }
        
        this.foodCount = 0;
        this.puppy = new Puppy(0, 0);
        this.setupLevel();
        this.updateSeedDisplay();
        this.showMessage('New level generated! 🎲');
    }

    updatePuppyDisplay() {
        const { x, y } = this.puppy.position;
        const cell = this.cells[y][x];
        const arrows = ['↑', '→', '↓', '←'];
        cell.element.textContent = `🐶${arrows[this.puppy.direction]}`;
    }
}

interface ProgramElement {
    id: string;
    elementType: ProgramElementType;
    element: HTMLElement;
    count: number;
}

class Instruction implements ProgramElement {
    type: InstructionType;
    element: HTMLElement;
    id: string;
    count: number;
    elementType: ProgramElementType = ProgramElementType.INSTRUCTION;

    constructor(type: InstructionType, count: number = 1) {
        this.type = type;
        this.count = count;
        this.id = Math.random().toString(36).substr(2, 9);
        this.element = document.createElement('div');
        this.element.className = 'program-instruction';
        this.element.draggable = true;
        this.updateDisplay();
        this.setupEvents();
    }

    setCount(count: number) {
        this.count = count;
        this.updateDisplay();
    }

    private updateDisplay() {
        const icons = {
            [InstructionType.FORWARD]: '⬆ Forward',
            [InstructionType.TURN_LEFT]: '↺ Turn Left',
            [InstructionType.TURN_RIGHT]: '↻ Turn Right',
            [InstructionType.JUMP]: '🦘 Jump'
        };
        
        const countDisplay = this.count > 1 ? ` ×${this.count}` : '';
        
        this.element.innerHTML = `
            ${icons[this.type]}${countDisplay}
            <button class="remove-btn">×</button>
        `;
        
        // Re-setup events after updating innerHTML
        this.setupEvents();
    }

    private setupEvents() {
        const removeBtn = this.element.querySelector('.remove-btn') as HTMLElement;
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Dispatch custom event to notify Game class
            const removeEvent = new CustomEvent('remove-instruction', { 
                detail: { id: this.id },
                bubbles: true 
            });
            this.element.dispatchEvent(removeEvent);
        });

        // Add drag support for reordering
        this.element.addEventListener('dragstart', (e: DragEvent) => {
            e.dataTransfer!.setData('application/x-instruction-id', this.id);
            e.dataTransfer!.setData('application/x-instruction-type', this.type);
            this.element.classList.add('dragging');
        });

        this.element.addEventListener('dragend', () => {
            this.element.classList.remove('dragging');
        });

        // Add dragover and drop support for multipliers
        this.element.addEventListener('dragover', (e: DragEvent) => {
            const hasMultiplier = Array.from(e.dataTransfer!.types).indexOf('application/x-multiplier') !== -1;
            if (hasMultiplier) {
                e.preventDefault();
                this.element.classList.add('multiplier-target');
            }
        });

        this.element.addEventListener('dragleave', () => {
            this.element.classList.remove('multiplier-target');
        });

        this.element.addEventListener('drop', (e: DragEvent) => {
            e.preventDefault();
            this.element.classList.remove('multiplier-target');
            
            const multiplierValue = e.dataTransfer!.getData('application/x-multiplier');
            if (multiplierValue) {
                this.setCount(parseInt(multiplierValue));
            }
        });
    }
}

class Loop implements ProgramElement {
    element: HTMLElement;
    id: string;
    count: number;
    elementType: ProgramElementType = ProgramElementType.LOOP;
    instructions: ProgramElement[];
    private startElement: HTMLElement;
    private endElement: HTMLElement;
    private contentContainer: HTMLElement;

    constructor(count: number = 1) {
        this.count = count;
        this.id = Math.random().toString(36).substr(2, 9);
        this.instructions = [];
        this.element = document.createElement('div');
        this.element.className = 'program-loop';
        this.setupLoop();
        this.setupEvents();
    }

    private setupLoop() {
        this.startElement = document.createElement('div');
        this.startElement.className = 'loop-start';
        this.startElement.textContent = '{';

        this.contentContainer = document.createElement('div');
        this.contentContainer.className = 'loop-content';

        this.endElement = document.createElement('div');
        this.endElement.className = 'loop-end';
        this.updateEndDisplay();

        this.element.appendChild(this.startElement);
        this.element.appendChild(this.contentContainer);
        this.element.appendChild(this.endElement);
        
        // Initialize with empty drop zone
        this.rebuildContent();
    }

    setCount(count: number) {
        this.count = count;
        this.updateEndDisplay();
    }

    private updateEndDisplay() {
        const countDisplay = this.count > 1 ? ` ×${this.count}` : '';
        this.endElement.textContent = `}${countDisplay}`;
    }

    addInstruction(instruction: ProgramElement, index?: number) {
        if (index !== undefined && index >= 0 && index <= this.instructions.length) {
            this.instructions.splice(index, 0, instruction);
        } else {
            this.instructions.push(instruction);
        }
        this.rebuildContent();
    }

    removeInstruction(id: string) {
        const index = this.instructions.findIndex(inst => inst.id === id);
        if (index !== -1) {
            this.instructions.splice(index, 1);
            this.rebuildContent();
        }
    }

    private rebuildContent() {
        this.contentContainer.innerHTML = '';
        if (this.instructions.length === 0) {
            const dropZone = document.createElement('div');
            dropZone.className = 'loop-drop-zone';
            dropZone.textContent = 'Drop instructions here';
            this.contentContainer.appendChild(dropZone);
        } else {
            this.instructions.forEach(instruction => {
                this.contentContainer.appendChild(instruction.element);
            });
        }
        
        // Re-setup drag and drop for the content container after rebuild
        this.setupContentEvents();
    }
    
    private setupContentEvents() {
        // Remove any existing event listeners and re-add them
        const contentContainer = this.contentContainer;
        contentContainer.removeEventListener('dragover', this.handleDragOver);
        contentContainer.removeEventListener('drop', this.handleDrop);
        
        contentContainer.addEventListener('dragover', this.handleDragOver);
        contentContainer.addEventListener('drop', this.handleDrop);
    }
    
    private handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }
    
    private handleDrop = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        const instructionType = e.dataTransfer!.getData('text/plain') as InstructionType;
        const instructionId = e.dataTransfer!.getData('application/x-instruction-id');
        const existingInstructionType = e.dataTransfer!.getData('application/x-instruction-type') as InstructionType;
        
        if (instructionType) {
            // Adding new instruction from palette
            const instruction = new Instruction(instructionType);
            this.addInstruction(instruction);
        } else if (instructionId && existingInstructionType) {
            // Moving existing instruction into loop
            const instruction = new Instruction(existingInstructionType);
            this.addInstruction(instruction);
            
            // Notify parent to remove the original instruction
            const removeEvent = new CustomEvent('remove-instruction', {
                detail: { id: instructionId },
                bubbles: true
            });
            this.element.dispatchEvent(removeEvent);
        }
    }

    private setupEvents() {
        // Add drag support for reordering
        this.element.addEventListener('dragstart', (e: DragEvent) => {
            e.dataTransfer!.setData('application/x-loop-id', this.id);
            this.element.classList.add('dragging');
        });

        this.element.addEventListener('dragend', () => {
            this.element.classList.remove('dragging');
        });

        // Add dragover and drop support for multipliers
        this.endElement.addEventListener('dragover', (e: DragEvent) => {
            const hasMultiplier = Array.from(e.dataTransfer!.types).indexOf('application/x-multiplier') !== -1;
            if (hasMultiplier) {
                e.preventDefault();
                this.endElement.classList.add('multiplier-target');
            }
        });

        this.endElement.addEventListener('dragleave', () => {
            this.endElement.classList.remove('multiplier-target');
        });

        this.endElement.addEventListener('drop', (e: DragEvent) => {
            e.preventDefault();
            this.endElement.classList.remove('multiplier-target');
            
            const multiplierValue = e.dataTransfer!.getData('application/x-multiplier');
            if (multiplierValue) {
                this.setCount(parseInt(multiplierValue));
            }
        });
    }
}

class Game {
    board: GameBoard;
    program: ProgramElement[];
    isRunning: boolean;

    constructor() {
        this.board = new GameBoard();
        this.program = [];
        this.isRunning = false;
        this.setupEventListeners();
    }

    private setupEventListeners() {
        // Drag and drop for instruction blocks
        this.setupDragAndDrop();
        
        // Control buttons
        document.getElementById('run-button')!.addEventListener('click', () => this.runProgram());
        document.getElementById('reset-button')!.addEventListener('click', () => this.reset());
        document.getElementById('new-level-button')!.addEventListener('click', () => this.newLevel());
        document.getElementById('clear-button')!.addEventListener('click', () => this.clearProgram());
    }

    private setupDragAndDrop() {
        const instructionBlocks = document.querySelectorAll('.instruction-block');
        const multiplierBlocks = document.querySelectorAll('.multiplier-block');
        const loopBlocks = document.querySelectorAll('.loop-block');
        const programContainer = document.getElementById('program-container')!;

        instructionBlocks.forEach(block => {
            block.addEventListener('dragstart', (e: DragEvent) => {
                const target = e.target as HTMLElement;
                e.dataTransfer!.setData('text/plain', target.dataset.instruction!);
            });
        });

        multiplierBlocks.forEach(block => {
            block.addEventListener('dragstart', (e: DragEvent) => {
                const target = e.target as HTMLElement;
                e.dataTransfer!.setData('application/x-multiplier', target.dataset.multiplier!);
            });
        });

        loopBlocks.forEach(block => {
            block.addEventListener('dragstart', (e: DragEvent) => {
                e.dataTransfer!.setData('application/x-loop-create', 'true');
            });
        });

        programContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        programContainer.addEventListener('drop', (e: DragEvent) => {
            e.preventDefault();
            
            const instructionId = e.dataTransfer!.getData('application/x-instruction-id');
            const instructionType = e.dataTransfer!.getData('application/x-instruction-type') as InstructionType;
            const paletteType = e.dataTransfer!.getData('text/plain') as InstructionType;
            const loopCreate = e.dataTransfer!.getData('application/x-loop-create');
            const loopId = e.dataTransfer!.getData('application/x-loop-id');
            
            if (instructionId) {
                // Reordering existing instruction
                const insertIndex = this.getDropInsertIndex(e, programContainer);
                this.removeElementById(instructionId);
                this.addInstruction(instructionType, insertIndex > 0 ? insertIndex - 1 : 0);
            } else if (loopId) {
                // Reordering existing loop
                const insertIndex = this.getDropInsertIndex(e, programContainer);
                const loop = this.findElementById(loopId) as Loop;
                if (loop) {
                    this.removeElementById(loopId);
                    this.addLoop(loop, insertIndex > 0 ? insertIndex - 1 : 0);
                }
            } else if (loopCreate) {
                // Creating new loop
                const insertIndex = this.getDropInsertIndex(e, programContainer);
                this.addLoop(new Loop(), insertIndex);
            } else if (paletteType) {
                // Adding new instruction from palette
                const insertIndex = this.getDropInsertIndex(e, programContainer);
                this.addInstruction(paletteType, insertIndex);
            }
        });

        // Handle remove instruction events
        programContainer.addEventListener('remove-instruction', (e: CustomEvent) => {
            this.removeElementById(e.detail.id);
        });
        
        // Handle removing instructions from loops
        programContainer.addEventListener('remove-instruction', (e: CustomEvent) => {
            // Check if the instruction is inside a loop
            this.program.forEach(element => {
                if (element.elementType === ProgramElementType.LOOP) {
                    const loop = element as Loop;
                    loop.removeInstruction(e.detail.id);
                }
            });
        });
    }

    private addInstruction(type: InstructionType, insertIndex?: number) {
        const instruction = new Instruction(type);
        this.addProgramElement(instruction, insertIndex);
    }

    private addLoop(loop: Loop, insertIndex?: number) {
        this.addProgramElement(loop, insertIndex);
    }

    private addProgramElement(element: ProgramElement, insertIndex?: number) {
        if (insertIndex !== undefined && insertIndex >= 0 && insertIndex <= this.program.length) {
            this.program.splice(insertIndex, 0, element);
        } else {
            this.program.push(element);
        }
        
        this.rebuildProgramDisplay();
    }

    private rebuildProgramDisplay() {
        const programContainer = document.getElementById('program-container')!;
        programContainer.innerHTML = '';
        
        if (this.program.length === 0) {
            programContainer.innerHTML = '<div class="drop-zone">Drop instructions here</div>';
        } else {
            this.program.forEach(element => {
                programContainer.appendChild(element.element);
            });
        }
    }

    private removeElementById(id: string) {
        const index = this.program.findIndex(element => element.id === id);
        if (index !== -1) {
            this.program.splice(index, 1);
            this.rebuildProgramDisplay();
        }
    }

    private findElementById(id: string): ProgramElement | null {
        return this.program.find(element => element.id === id) || null;
    }

    private getDropInsertIndex(e: DragEvent, container: HTMLElement): number {
        const afterElement = this.getDragAfterElement(container, e.clientY);
        if (afterElement === null) {
            return this.program.length;
        } else {
            const afterInstruction = this.program.find(instruction => instruction.element === afterElement);
            return afterInstruction ? this.program.indexOf(afterInstruction) : this.program.length;
        }
    }

    private getDragAfterElement(container: HTMLElement, y: number): HTMLElement | null {
        const draggableElements = Array.from(container.querySelectorAll('.program-instruction:not(.dragging)')) as HTMLElement[];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY, element: null as HTMLElement | null }).element;
    }

    private async runProgram() {
        if (this.isRunning || this.program.length === 0) return;
        
        this.isRunning = true;
        const runButton = document.getElementById('run-button')! as HTMLButtonElement;
        runButton.disabled = true;
        runButton.textContent = '⏸ Running...';

        await this.executeProgram(this.program);

        this.isRunning = false;
        runButton.disabled = false;
        runButton.textContent = '▶ Run Program';
    }

    private async executeProgram(elements: ProgramElement[]) {
        for (const element of elements) {
            element.element.classList.add('executing');
            
            if (element.elementType === ProgramElementType.INSTRUCTION) {
                const instruction = element as Instruction;
                // Execute instruction multiple times based on count
                for (let i = 0; i < instruction.count; i++) {
                    await this.executeInstruction(instruction.type);
                    if (i < instruction.count - 1) {
                        await this.delay(400); // Shorter delay between repeated actions
                    }
                }
            } else if (element.elementType === ProgramElementType.LOOP) {
                const loop = element as Loop;
                // Execute loop multiple times based on count
                for (let i = 0; i < loop.count; i++) {
                    await this.executeProgram(loop.instructions);
                    if (i < loop.count - 1) {
                        await this.delay(400); // Shorter delay between loop iterations
                    }
                }
            }
            
            await this.delay(800);
            element.element.classList.remove('executing');
        }
    }

    private async executeInstruction(type: InstructionType) {
        switch (type) {
            case InstructionType.FORWARD:
                const nextPos = this.board.puppy.getNextPosition();
                if (!this.board.movePuppy(nextPos.x, nextPos.y)) {
                    this.showMessage('Oops! Cannot move forward - blocked! 🚫');
                }
                break;
                
            case InstructionType.TURN_LEFT:
                this.board.puppy.turnLeft();
                this.board.updatePuppyDisplay();
                break;
                
            case InstructionType.TURN_RIGHT:
                this.board.puppy.turnRight();
                this.board.updatePuppyDisplay();
                break;
                
            case InstructionType.JUMP:
                const jumpPos = this.board.puppy.getNextPosition(2);
                if (this.board.isValidPosition(jumpPos.x, jumpPos.y)) {
                    this.board.movePuppy(jumpPos.x, jumpPos.y);
                } else {
                    this.showMessage('Oops! Cannot jump there! 🚫');
                }
                break;
        }
    }


    private showMessage(message: string) {
        const statusElement = document.getElementById('status-message')!;
        statusElement.textContent = message;
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private clearProgram() {
        this.program = [];
        const programContainer = document.getElementById('program-container')!;
        programContainer.innerHTML = '<div class="drop-zone">Drop instructions here</div>';
    }

    private reset() {
        this.board.reset();
    }

    private newLevel() {
        this.board.newLevel();
        this.clearProgram();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Game();
});