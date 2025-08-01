var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var CellType;
(function (CellType) {
    CellType["EMPTY"] = "empty";
    CellType["OBSTACLE"] = "obstacle";
    CellType["FOOD"] = "food";
    CellType["PUPPY"] = "puppy";
})(CellType || (CellType = {}));
var Direction;
(function (Direction) {
    Direction[Direction["NORTH"] = 0] = "NORTH";
    Direction[Direction["EAST"] = 1] = "EAST";
    Direction[Direction["SOUTH"] = 2] = "SOUTH";
    Direction[Direction["WEST"] = 3] = "WEST";
})(Direction || (Direction = {}));
var InstructionType;
(function (InstructionType) {
    InstructionType["FORWARD"] = "forward";
    InstructionType["TURN_LEFT"] = "turnLeft";
    InstructionType["TURN_RIGHT"] = "turnRight";
    InstructionType["JUMP"] = "jump";
})(InstructionType || (InstructionType = {}));
var ProgramElementType;
(function (ProgramElementType) {
    ProgramElementType["INSTRUCTION"] = "instruction";
    ProgramElementType["LOOP"] = "loop";
})(ProgramElementType || (ProgramElementType = {}));
var Cell = /** @class */ (function () {
    function Cell(type) {
        if (type === void 0) { type = CellType.EMPTY; }
        this.type = type;
        this.element = document.createElement('div');
        this.element.className = "cell ".concat(type);
        this.emoji = '';
        this.updateDisplay();
    }
    Cell.prototype.setType = function (type) {
        this.type = type;
        this.element.className = "cell ".concat(type);
        // Generate new emoji when type changes (except for puppy)
        if (type === CellType.OBSTACLE) {
            var obstacleEmojis = ['🌲', '🌳'];
            this.emoji = obstacleEmojis[Math.floor(Math.random() * obstacleEmojis.length)];
        }
        else if (type === CellType.FOOD) {
            var foodEmojis = ['🍖', '🍗', '🥓'];
            this.emoji = foodEmojis[Math.floor(Math.random() * foodEmojis.length)];
        }
        else {
            this.emoji = '';
        }
        this.updateDisplay();
    };
    Cell.prototype.updateDisplay = function () {
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
    };
    return Cell;
}());
var Puppy = /** @class */ (function () {
    function Puppy(x, y) {
        this.position = { x: x, y: y };
        this.direction = Direction.NORTH;
        this.element = document.createElement('div');
        this.element.className = 'puppy';
        this.updateDisplay();
    }
    Puppy.prototype.turnLeft = function () {
        this.direction = (this.direction + 3) % 4;
        this.updateDisplay();
    };
    Puppy.prototype.turnRight = function () {
        this.direction = (this.direction + 1) % 4;
        this.updateDisplay();
    };
    Puppy.prototype.getNextPosition = function (steps) {
        if (steps === void 0) { steps = 1; }
        var _a = this.position, x = _a.x, y = _a.y;
        switch (this.direction) {
            case Direction.NORTH:
                return { x: x, y: y - steps };
            case Direction.EAST:
                return { x: x + steps, y: y };
            case Direction.SOUTH:
                return { x: x, y: y + steps };
            case Direction.WEST:
                return { x: x - steps, y: y };
            default:
                return { x: x, y: y };
        }
    };
    Puppy.prototype.updateDisplay = function () {
        var arrows = ['↑', '→', '↓', '←'];
        this.element.textContent = "\uD83D\uDC36".concat(arrows[this.direction]);
    };
    return Puppy;
}());
var SeededRandom = /** @class */ (function () {
    function SeededRandom(seed) {
        this.seed = seed;
    }
    SeededRandom.prototype.next = function () {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    };
    SeededRandom.prototype.nextInt = function (min, max) {
        return Math.floor(this.next() * (max - min)) + min;
    };
    return SeededRandom;
}());
var GameBoard = /** @class */ (function () {
    function GameBoard(width, height, seed) {
        if (width === void 0) { width = 5; }
        if (height === void 0) { height = 5; }
        this.width = width;
        this.height = height;
        this.cells = [];
        this.foodCount = 0;
        this.element = document.getElementById('game-board');
        this.puppy = new Puppy(0, 0);
        // Get seed from URL parameter or generate random one
        var urlParams = new URLSearchParams(window.location.search);
        var seedParam = urlParams.get('seed');
        this.seed = seed || (seedParam ? parseInt(seedParam) : Math.floor(Math.random() * 1000000));
        this.random = new SeededRandom(this.seed);
        // Update URL with current seed if not present
        if (!seedParam && !seed) {
            var newUrl = new URL(window.location.href);
            newUrl.searchParams.set('seed', this.seed.toString());
            window.history.replaceState({}, '', newUrl);
        }
        this.initializeBoard();
        this.setupLevel();
        this.updateSeedDisplay();
    }
    GameBoard.prototype.initializeBoard = function () {
        this.element.style.gridTemplateColumns = "repeat(".concat(this.width, ", 1fr)");
        this.element.style.gridTemplateRows = "repeat(".concat(this.height, ", 1fr)");
        for (var y = 0; y < this.height; y++) {
            this.cells[y] = [];
            for (var x = 0; x < this.width; x++) {
                var cell = new Cell();
                this.cells[y][x] = cell;
                this.element.appendChild(cell.element);
            }
        }
    };
    GameBoard.prototype.setupLevel = function () {
        this.generateRandomLevel();
        // Place puppy at starting position
        this.placePuppy(0, 0);
        this.updateFoodCounter();
    };
    GameBoard.prototype.generateRandomLevel = function () {
        var totalCells = this.width * this.height;
        var maxObstacles = Math.floor(totalCells * 0.25); // Up to 25% obstacles
        var maxFood = Math.floor(totalCells * 0.3); // Up to 30% food
        // Generate obstacles (avoid starting position)
        var numObstacles = this.random.nextInt(2, maxObstacles + 1);
        for (var i = 0; i < numObstacles; i++) {
            var x = void 0, y = void 0;
            do {
                x = this.random.nextInt(0, this.width);
                y = this.random.nextInt(0, this.height);
            } while ((x === 0 && y === 0) || this.cells[y][x].type !== CellType.EMPTY);
            this.setCell(x, y, CellType.OBSTACLE);
        }
        // Generate food items (avoid starting position and obstacles)
        var numFood = this.random.nextInt(3, maxFood + 1);
        for (var i = 0; i < numFood; i++) {
            var x = void 0, y = void 0;
            do {
                x = this.random.nextInt(0, this.width);
                y = this.random.nextInt(0, this.height);
            } while ((x === 0 && y === 0) || this.cells[y][x].type !== CellType.EMPTY);
            this.setCell(x, y, CellType.FOOD);
        }
    };
    GameBoard.prototype.setCell = function (x, y, type) {
        if (this.isValidPosition(x, y)) {
            this.cells[y][x].setType(type);
            if (type === CellType.FOOD) {
                this.foodCount++;
            }
        }
    };
    GameBoard.prototype.placePuppy = function (x, y) {
        if (this.isValidPosition(x, y)) {
            // Clear puppy from old position
            if (this.isValidPosition(this.puppy.position.x, this.puppy.position.y)) {
                var oldCell = this.cells[this.puppy.position.y][this.puppy.position.x];
                if (oldCell.type === CellType.PUPPY) {
                    oldCell.setType(CellType.EMPTY);
                }
            }
            // Place puppy at new position
            this.puppy.position = { x: x, y: y };
            var currentCell = this.cells[y][x];
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
    };
    GameBoard.prototype.isValidPosition = function (x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    };
    GameBoard.prototype.canMoveTo = function (x, y) {
        if (!this.isValidPosition(x, y))
            return false;
        var cell = this.cells[y][x];
        return cell.type !== CellType.OBSTACLE;
    };
    GameBoard.prototype.movePuppy = function (newX, newY) {
        if (this.canMoveTo(newX, newY)) {
            this.placePuppy(newX, newY);
            return true;
        }
        return false;
    };
    GameBoard.prototype.updateFoodCounter = function () {
        var counter = document.getElementById('food-count');
        counter.textContent = this.foodCount.toString();
        if (this.foodCount === 0) {
            this.showMessage('🎉 Congratulations! All food collected! 🎉');
        }
    };
    GameBoard.prototype.updateSeedDisplay = function () {
        var seedElement = document.getElementById('seed-value');
        seedElement.textContent = this.seed.toString();
    };
    GameBoard.prototype.showMessage = function (message) {
        var statusElement = document.getElementById('status-message');
        statusElement.textContent = message;
        setTimeout(function () {
            if (statusElement.textContent === message) {
                statusElement.textContent = 'Ready to play! 🎮';
            }
        }, 3000);
    };
    GameBoard.prototype.reset = function () {
        // Clear puppy from current position first
        if (this.isValidPosition(this.puppy.position.x, this.puppy.position.y)) {
            var currentCell = this.cells[this.puppy.position.y][this.puppy.position.x];
            if (currentCell.type === CellType.PUPPY) {
                currentCell.setType(CellType.EMPTY);
            }
        }
        // Reset puppy to starting position
        this.puppy = new Puppy(0, 0);
        this.placePuppy(0, 0);
        this.showMessage('Game reset! Ready to play! 🎮');
    };
    GameBoard.prototype.newLevel = function () {
        // Generate new seed for a fresh level
        this.seed = Math.floor(Math.random() * 1000000);
        this.random = new SeededRandom(this.seed);
        // Update URL with new seed
        var newUrl = new URL(window.location.href);
        newUrl.searchParams.set('seed', this.seed.toString());
        window.history.replaceState({}, '', newUrl);
        // Clear all cells
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                this.cells[y][x].setType(CellType.EMPTY);
            }
        }
        this.foodCount = 0;
        this.puppy = new Puppy(0, 0);
        this.setupLevel();
        this.updateSeedDisplay();
        this.showMessage('New level generated! 🎲');
    };
    GameBoard.prototype.updatePuppyDisplay = function () {
        var _a = this.puppy.position, x = _a.x, y = _a.y;
        var cell = this.cells[y][x];
        var arrows = ['↑', '→', '↓', '←'];
        cell.element.textContent = "\uD83D\uDC36".concat(arrows[this.puppy.direction]);
    };
    return GameBoard;
}());
var Instruction = /** @class */ (function () {
    function Instruction(type, count) {
        if (count === void 0) { count = 1; }
        this.elementType = ProgramElementType.INSTRUCTION;
        this.type = type;
        this.count = count;
        this.id = Math.random().toString(36).substr(2, 9);
        this.element = document.createElement('div');
        this.element.className = 'program-instruction';
        this.element.draggable = true;
        this.updateDisplay();
        this.setupEvents();
    }
    Instruction.prototype.setCount = function (count) {
        this.count = count;
        this.updateDisplay();
    };
    Instruction.prototype.updateDisplay = function () {
        var _a;
        var icons = (_a = {},
            _a[InstructionType.FORWARD] = '⬆ Forward',
            _a[InstructionType.TURN_LEFT] = '↺ Turn Left',
            _a[InstructionType.TURN_RIGHT] = '↻ Turn Right',
            _a[InstructionType.JUMP] = '🦘 Jump',
            _a);
        var countDisplay = this.count > 1 ? " \u00D7".concat(this.count) : '';
        this.element.innerHTML = "\n            ".concat(icons[this.type]).concat(countDisplay, "\n            <button class=\"remove-btn\">\u00D7</button>\n        ");
        // Re-setup events after updating innerHTML
        this.setupEvents();
    };
    Instruction.prototype.setupEvents = function () {
        var _this = this;
        var removeBtn = this.element.querySelector('.remove-btn');
        removeBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            // Dispatch custom event to notify Game class
            var removeEvent = new CustomEvent('remove-instruction', {
                detail: { id: _this.id },
                bubbles: true
            });
            _this.element.dispatchEvent(removeEvent);
        });
        // Add drag support for reordering
        this.element.addEventListener('dragstart', function (e) {
            e.dataTransfer.setData('application/x-instruction-id', _this.id);
            e.dataTransfer.setData('application/x-instruction-type', _this.type);
            _this.element.classList.add('dragging');
        });
        this.element.addEventListener('dragend', function () {
            _this.element.classList.remove('dragging');
        });
        // Add dragover and drop support for multipliers
        this.element.addEventListener('dragover', function (e) {
            var hasMultiplier = Array.from(e.dataTransfer.types).indexOf('application/x-multiplier') !== -1;
            if (hasMultiplier) {
                e.preventDefault();
                _this.element.classList.add('multiplier-target');
            }
        });
        this.element.addEventListener('dragleave', function () {
            _this.element.classList.remove('multiplier-target');
        });
        this.element.addEventListener('drop', function (e) {
            e.preventDefault();
            _this.element.classList.remove('multiplier-target');
            var multiplierValue = e.dataTransfer.getData('application/x-multiplier');
            if (multiplierValue) {
                _this.setCount(parseInt(multiplierValue));
            }
        });
    };
    return Instruction;
}());
var Loop = /** @class */ (function () {
    function Loop(count) {
        if (count === void 0) { count = 1; }
        var _this = this;
        this.elementType = ProgramElementType.LOOP;
        this.handleDragOver = function (e) {
            e.preventDefault();
            e.stopPropagation();
        };
        this.handleDrop = function (e) {
            e.preventDefault();
            e.stopPropagation();
            var instructionType = e.dataTransfer.getData('text/plain');
            var instructionId = e.dataTransfer.getData('application/x-instruction-id');
            var existingInstructionType = e.dataTransfer.getData('application/x-instruction-type');
            if (instructionType) {
                // Adding new instruction from palette
                var instruction = new Instruction(instructionType);
                _this.addInstruction(instruction);
            }
            else if (instructionId && existingInstructionType) {
                // Moving existing instruction into loop
                var instruction = new Instruction(existingInstructionType);
                _this.addInstruction(instruction);
                // Notify parent to remove the original instruction
                var removeEvent = new CustomEvent('remove-instruction', {
                    detail: { id: instructionId },
                    bubbles: true
                });
                _this.element.dispatchEvent(removeEvent);
            }
        };
        this.count = count;
        this.id = Math.random().toString(36).substr(2, 9);
        this.instructions = [];
        this.element = document.createElement('div');
        this.element.className = 'program-loop';
        this.setupLoop();
        this.setupEvents();
    }
    Loop.prototype.setupLoop = function () {
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
    };
    Loop.prototype.setCount = function (count) {
        this.count = count;
        this.updateEndDisplay();
    };
    Loop.prototype.updateEndDisplay = function () {
        var countDisplay = this.count > 1 ? " \u00D7".concat(this.count) : '';
        this.endElement.textContent = "}".concat(countDisplay);
    };
    Loop.prototype.addInstruction = function (instruction, index) {
        if (index !== undefined && index >= 0 && index <= this.instructions.length) {
            this.instructions.splice(index, 0, instruction);
        }
        else {
            this.instructions.push(instruction);
        }
        this.rebuildContent();
    };
    Loop.prototype.removeInstruction = function (id) {
        var index = this.instructions.findIndex(function (inst) { return inst.id === id; });
        if (index !== -1) {
            this.instructions.splice(index, 1);
            this.rebuildContent();
        }
    };
    Loop.prototype.rebuildContent = function () {
        var _this = this;
        this.contentContainer.innerHTML = '';
        if (this.instructions.length === 0) {
            var dropZone = document.createElement('div');
            dropZone.className = 'loop-drop-zone';
            dropZone.textContent = 'Drop instructions here';
            this.contentContainer.appendChild(dropZone);
        }
        else {
            this.instructions.forEach(function (instruction) {
                _this.contentContainer.appendChild(instruction.element);
            });
        }
        // Re-setup drag and drop for the content container after rebuild
        this.setupContentEvents();
    };
    Loop.prototype.setupContentEvents = function () {
        // Remove any existing event listeners and re-add them
        var contentContainer = this.contentContainer;
        contentContainer.removeEventListener('dragover', this.handleDragOver);
        contentContainer.removeEventListener('drop', this.handleDrop);
        contentContainer.addEventListener('dragover', this.handleDragOver);
        contentContainer.addEventListener('drop', this.handleDrop);
    };
    Loop.prototype.setupEvents = function () {
        var _this = this;
        // Add drag support for reordering
        this.element.addEventListener('dragstart', function (e) {
            e.dataTransfer.setData('application/x-loop-id', _this.id);
            _this.element.classList.add('dragging');
        });
        this.element.addEventListener('dragend', function () {
            _this.element.classList.remove('dragging');
        });
        // Add dragover and drop support for multipliers
        this.endElement.addEventListener('dragover', function (e) {
            var hasMultiplier = Array.from(e.dataTransfer.types).indexOf('application/x-multiplier') !== -1;
            if (hasMultiplier) {
                e.preventDefault();
                _this.endElement.classList.add('multiplier-target');
            }
        });
        this.endElement.addEventListener('dragleave', function () {
            _this.endElement.classList.remove('multiplier-target');
        });
        this.endElement.addEventListener('drop', function (e) {
            e.preventDefault();
            _this.endElement.classList.remove('multiplier-target');
            var multiplierValue = e.dataTransfer.getData('application/x-multiplier');
            if (multiplierValue) {
                _this.setCount(parseInt(multiplierValue));
            }
        });
    };
    return Loop;
}());
var Game = /** @class */ (function () {
    function Game() {
        this.board = new GameBoard();
        this.program = [];
        this.isRunning = false;
        this.setupEventListeners();
    }
    Game.prototype.setupEventListeners = function () {
        var _this = this;
        // Drag and drop for instruction blocks
        this.setupDragAndDrop();
        // Control buttons
        document.getElementById('run-button').addEventListener('click', function () { return _this.runProgram(); });
        document.getElementById('reset-button').addEventListener('click', function () { return _this.reset(); });
        document.getElementById('new-level-button').addEventListener('click', function () { return _this.newLevel(); });
        document.getElementById('clear-button').addEventListener('click', function () { return _this.clearProgram(); });
    };
    Game.prototype.setupDragAndDrop = function () {
        var _this = this;
        var instructionBlocks = document.querySelectorAll('.instruction-block');
        var multiplierBlocks = document.querySelectorAll('.multiplier-block');
        var loopBlocks = document.querySelectorAll('.loop-block');
        var programContainer = document.getElementById('program-container');
        instructionBlocks.forEach(function (block) {
            block.addEventListener('dragstart', function (e) {
                var target = e.target;
                e.dataTransfer.setData('text/plain', target.dataset.instruction);
            });
        });
        multiplierBlocks.forEach(function (block) {
            block.addEventListener('dragstart', function (e) {
                var target = e.target;
                e.dataTransfer.setData('application/x-multiplier', target.dataset.multiplier);
            });
        });
        loopBlocks.forEach(function (block) {
            block.addEventListener('dragstart', function (e) {
                e.dataTransfer.setData('application/x-loop-create', 'true');
            });
        });
        programContainer.addEventListener('dragover', function (e) {
            e.preventDefault();
        });
        programContainer.addEventListener('drop', function (e) {
            e.preventDefault();
            var instructionId = e.dataTransfer.getData('application/x-instruction-id');
            var instructionType = e.dataTransfer.getData('application/x-instruction-type');
            var paletteType = e.dataTransfer.getData('text/plain');
            var loopCreate = e.dataTransfer.getData('application/x-loop-create');
            var loopId = e.dataTransfer.getData('application/x-loop-id');
            if (instructionId) {
                // Reordering existing instruction
                var insertIndex = _this.getDropInsertIndex(e, programContainer);
                _this.removeElementById(instructionId);
                _this.addInstruction(instructionType, insertIndex > 0 ? insertIndex - 1 : 0);
            }
            else if (loopId) {
                // Reordering existing loop
                var insertIndex = _this.getDropInsertIndex(e, programContainer);
                var loop = _this.findElementById(loopId);
                if (loop) {
                    _this.removeElementById(loopId);
                    _this.addLoop(loop, insertIndex > 0 ? insertIndex - 1 : 0);
                }
            }
            else if (loopCreate) {
                // Creating new loop
                var insertIndex = _this.getDropInsertIndex(e, programContainer);
                _this.addLoop(new Loop(), insertIndex);
            }
            else if (paletteType) {
                // Adding new instruction from palette
                var insertIndex = _this.getDropInsertIndex(e, programContainer);
                _this.addInstruction(paletteType, insertIndex);
            }
        });
        // Handle remove instruction events
        programContainer.addEventListener('remove-instruction', function (e) {
            _this.removeElementById(e.detail.id);
        });
        // Handle removing instructions from loops
        programContainer.addEventListener('remove-instruction', function (e) {
            // Check if the instruction is inside a loop
            _this.program.forEach(function (element) {
                if (element.elementType === ProgramElementType.LOOP) {
                    var loop = element;
                    loop.removeInstruction(e.detail.id);
                }
            });
        });
    };
    Game.prototype.addInstruction = function (type, insertIndex) {
        var instruction = new Instruction(type);
        this.addProgramElement(instruction, insertIndex);
    };
    Game.prototype.addLoop = function (loop, insertIndex) {
        this.addProgramElement(loop, insertIndex);
    };
    Game.prototype.addProgramElement = function (element, insertIndex) {
        if (insertIndex !== undefined && insertIndex >= 0 && insertIndex <= this.program.length) {
            this.program.splice(insertIndex, 0, element);
        }
        else {
            this.program.push(element);
        }
        this.rebuildProgramDisplay();
    };
    Game.prototype.rebuildProgramDisplay = function () {
        var programContainer = document.getElementById('program-container');
        programContainer.innerHTML = '';
        if (this.program.length === 0) {
            programContainer.innerHTML = '<div class="drop-zone">Drop instructions here</div>';
        }
        else {
            this.program.forEach(function (element) {
                programContainer.appendChild(element.element);
            });
        }
    };
    Game.prototype.removeElementById = function (id) {
        var index = this.program.findIndex(function (element) { return element.id === id; });
        if (index !== -1) {
            this.program.splice(index, 1);
            this.rebuildProgramDisplay();
        }
    };
    Game.prototype.findElementById = function (id) {
        return this.program.find(function (element) { return element.id === id; }) || null;
    };
    Game.prototype.getDropInsertIndex = function (e, container) {
        var afterElement = this.getDragAfterElement(container, e.clientY);
        if (afterElement === null) {
            return this.program.length;
        }
        else {
            var afterInstruction = this.program.find(function (instruction) { return instruction.element === afterElement; });
            return afterInstruction ? this.program.indexOf(afterInstruction) : this.program.length;
        }
    };
    Game.prototype.getDragAfterElement = function (container, y) {
        var draggableElements = Array.from(container.querySelectorAll('.program-instruction:not(.dragging)'));
        return draggableElements.reduce(function (closest, child) {
            var box = child.getBoundingClientRect();
            var offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            }
            else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY, element: null }).element;
    };
    Game.prototype.runProgram = function () {
        return __awaiter(this, void 0, void 0, function () {
            var runButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.isRunning || this.program.length === 0)
                            return [2 /*return*/];
                        this.isRunning = true;
                        runButton = document.getElementById('run-button');
                        runButton.disabled = true;
                        runButton.textContent = '⏸ Running...';
                        return [4 /*yield*/, this.executeProgram(this.program)];
                    case 1:
                        _a.sent();
                        this.isRunning = false;
                        runButton.disabled = false;
                        runButton.textContent = '▶ Run Program';
                        return [2 /*return*/];
                }
            });
        });
    };
    Game.prototype.executeProgram = function (elements) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, elements_1, element, instruction, i, loop, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _i = 0, elements_1 = elements;
                        _a.label = 1;
                    case 1:
                        if (!(_i < elements_1.length)) return [3 /*break*/, 15];
                        element = elements_1[_i];
                        element.element.classList.add('executing');
                        if (!(element.elementType === ProgramElementType.INSTRUCTION)) return [3 /*break*/, 7];
                        instruction = element;
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < instruction.count)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.executeInstruction(instruction.type)];
                    case 3:
                        _a.sent();
                        if (!(i < instruction.count - 1)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.delay(400)];
                    case 4:
                        _a.sent(); // Shorter delay between repeated actions
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 2];
                    case 6: return [3 /*break*/, 12];
                    case 7:
                        if (!(element.elementType === ProgramElementType.LOOP)) return [3 /*break*/, 12];
                        loop = element;
                        i = 0;
                        _a.label = 8;
                    case 8:
                        if (!(i < loop.count)) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.executeProgram(loop.instructions)];
                    case 9:
                        _a.sent();
                        if (!(i < loop.count - 1)) return [3 /*break*/, 11];
                        return [4 /*yield*/, this.delay(400)];
                    case 10:
                        _a.sent(); // Shorter delay between loop iterations
                        _a.label = 11;
                    case 11:
                        i++;
                        return [3 /*break*/, 8];
                    case 12: return [4 /*yield*/, this.delay(800)];
                    case 13:
                        _a.sent();
                        element.element.classList.remove('executing');
                        _a.label = 14;
                    case 14:
                        _i++;
                        return [3 /*break*/, 1];
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    Game.prototype.executeInstruction = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            var nextPos, jumpPos;
            return __generator(this, function (_a) {
                switch (type) {
                    case InstructionType.FORWARD:
                        nextPos = this.board.puppy.getNextPosition();
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
                        jumpPos = this.board.puppy.getNextPosition(2);
                        if (this.board.isValidPosition(jumpPos.x, jumpPos.y)) {
                            this.board.movePuppy(jumpPos.x, jumpPos.y);
                        }
                        else {
                            this.showMessage('Oops! Cannot jump there! 🚫');
                        }
                        break;
                }
                return [2 /*return*/];
            });
        });
    };
    Game.prototype.showMessage = function (message) {
        var statusElement = document.getElementById('status-message');
        statusElement.textContent = message;
    };
    Game.prototype.delay = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    Game.prototype.clearProgram = function () {
        this.program = [];
        var programContainer = document.getElementById('program-container');
        programContainer.innerHTML = '<div class="drop-zone">Drop instructions here</div>';
    };
    Game.prototype.reset = function () {
        this.board.reset();
    };
    Game.prototype.newLevel = function () {
        this.board.newLevel();
        this.clearProgram();
    };
    return Game;
}());
// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', function () {
    new Game();
});
