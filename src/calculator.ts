export class Calculator {
    private previousOperandTextElement: HTMLElement;
    private currentOperandTextElement: HTMLElement;
    private currentOperand: string = '';
    private previousOperand: string = '';
    private operation: string | undefined;

    constructor(previousOperandTextElement: HTMLElement, currentOperandTextElement: HTMLElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear(); // Initialize the calculator by clearing its state.
    }

    clear(): void {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete(): void {
        this.currentOperand = this.currentOperand.slice(0, -1);
    }

    appendNumber(number: string): void {
        if (number === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation: string): void {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute(): void {
        let computation: number;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
    }

    getDisplayNumber(number: string): string {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay: string;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay(): void {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandTextElement.innerText =
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const numberButtons = document.querySelectorAll<HTMLElement>('[data-number]');
    const operationButtons = document.querySelectorAll<HTMLElement>('[data-operation]');
    const equalsButton = document.querySelector<HTMLElement>('[data-equals]');
    const deleteButton = document.querySelector<HTMLElement>('[data-delete]');
    const allClearButton = document.querySelector<HTMLElement>('[data-all-clear]');
    const previousOperandTextElement = document.querySelector<HTMLElement>('[data-previous-operand]');
    const currentOperandTextElement = document.querySelector<HTMLElement>('[data-current-operand]');

    if (previousOperandTextElement && currentOperandTextElement) {
        const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

        numberButtons.forEach(button => {
            button.addEventListener('click', () => {
                calculator.appendNumber(button.innerText);
                calculator.updateDisplay();
            });
        });

        operationButtons.forEach(button => {
            button.addEventListener('click', () => {
                calculator.chooseOperation(button.innerText);
                calculator.updateDisplay();
            });
        });

        equalsButton?.addEventListener('click', () => {
            calculator.compute();
            calculator.updateDisplay();
        });

        allClearButton?.addEventListener('click', () => {
            calculator.clear();
            calculator.updateDisplay();
        });

        deleteButton?.addEventListener('click', () => {
            calculator.delete();
            calculator.updateDisplay();
        });
    } else {
        console.error("Could not find required elements in the DOM.");
    }
});
