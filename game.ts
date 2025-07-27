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

interface Position {
    x: number;
    y: number;
}

class Cell {
    type: CellType;
    element: HTMLElement;

    constructor(type: CellType = CellType.EMPTY) {
        this.type = type;
        this.element = document.createElement('div');
        this.element.className = `cell ${type}`;
        this.updateDisplay();
    }

    setType(type: CellType) {
        this.type = type;
        this.element.className = `cell ${type}`;
        this.updateDisplay();
    }

    private updateDisplay() {
        switch (this.type) {
            case CellType.EMPTY:
                this.element.textContent = '';
                break;
            case CellType.OBSTACLE:
                this.element.textContent = '🧱';
                break;
            case CellType.FOOD:
                this.element.textContent = '🦴';
                break;
            case CellType.PUPPY:
                this.element.textContent = '🐶';
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
        const arrows = ['⬆️', '➡️', '⬇️', '⬅️'];
        this.element.textContent = `${arrows[this.direction]}🐶`;
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
    }
}

class Instruction {
    type: InstructionType;
    element: HTMLElement;
    id: string;

    constructor(type: InstructionType) {
        this.type = type;
        this.id = Math.random().toString(36).substr(2, 9);
        this.element = document.createElement('div');
        this.element.className = 'program-instruction';
        this.element.draggable = true;
        this.updateDisplay();
        this.setupEvents();
    }

    private updateDisplay() {
        const icons = {
            [InstructionType.FORWARD]: '⬆ Forward',
            [InstructionType.TURN_LEFT]: '↺ Turn Left',
            [InstructionType.TURN_RIGHT]: '↻ Turn Right',
            [InstructionType.JUMP]: '🦘 Jump'
        };
        
        this.element.innerHTML = `
            ${icons[this.type]}
            <button class="remove-btn">×</button>
        `;
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
    }
}

class Game {
    board: GameBoard;
    program: Instruction[];
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
        document.getElementById('clear-button')!.addEventListener('click', () => this.clearProgram());
    }

    private setupDragAndDrop() {
        const instructionBlocks = document.querySelectorAll('.instruction-block');
        const programContainer = document.getElementById('program-container')!;

        instructionBlocks.forEach(block => {
            block.addEventListener('dragstart', (e: DragEvent) => {
                const target = e.target as HTMLElement;
                e.dataTransfer!.setData('text/plain', target.dataset.instruction!);
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
            
            if (instructionId) {
                // Reordering existing instruction
                const insertIndex = this.getDropInsertIndex(e, programContainer);
                this.removeInstructionById(instructionId);
                this.addInstruction(instructionType, insertIndex > 0 ? insertIndex - 1 : 0);
            } else if (paletteType) {
                // Adding new instruction from palette
                const insertIndex = this.getDropInsertIndex(e, programContainer);
                this.addInstruction(paletteType, insertIndex);
            }
        });

        // Handle remove instruction events
        programContainer.addEventListener('remove-instruction', (e: CustomEvent) => {
            this.removeInstructionById(e.detail.id);
        });
    }

    private addInstruction(type: InstructionType, insertIndex?: number) {
        const instruction = new Instruction(type);
        
        if (insertIndex !== undefined && insertIndex >= 0 && insertIndex <= this.program.length) {
            this.program.splice(insertIndex, 0, instruction);
        } else {
            this.program.push(instruction);
        }
        
        this.rebuildProgramDisplay();
    }

    private rebuildProgramDisplay() {
        const programContainer = document.getElementById('program-container')!;
        programContainer.innerHTML = '';
        
        if (this.program.length === 0) {
            programContainer.innerHTML = '<div class="drop-zone">Drop instructions here</div>';
        } else {
            this.program.forEach(instruction => {
                programContainer.appendChild(instruction.element);
            });
        }
    }

    private removeInstructionById(id: string) {
        const index = this.program.findIndex(instruction => instruction.id === id);
        if (index !== -1) {
            this.program.splice(index, 1);
            this.rebuildProgramDisplay();
        }
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

        for (const instruction of this.program) {
            instruction.element.classList.add('executing');
            
            await this.executeInstruction(instruction.type);
            await this.delay(800);
            
            instruction.element.classList.remove('executing');
        }

        this.isRunning = false;
        runButton.disabled = false;
        runButton.textContent = '▶ Run Program';
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
                this.updatePuppyDisplay();
                break;
                
            case InstructionType.TURN_RIGHT:
                this.board.puppy.turnRight();
                this.updatePuppyDisplay();
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

    private updatePuppyDisplay() {
        const { x, y } = this.board.puppy.position;
        const cell = this.board.cells[y][x];
        const arrows = ['⬆️', '➡️', '⬇️', '⬅️'];
        cell.element.textContent = `${arrows[this.board.puppy.direction]}🐶`;
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
        this.clearProgram();
        this.showMessage('Game reset! Ready to play! 🎮');
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Game();
});