const buttonSimulateLoan = document.getElementById('button-simulate-loan');

const buttonSendData = document.getElementById('button-send-data');

const inputLoanValue = document.getElementById('input-loan-value');

const inputMonthlyIncome = document.getElementById('input-monthly-income');

const inputLoanInstallments = document.getElementById('input-loan-installments');

const inputName = document.getElementById('input-name');

const inputCpf = document.getElementById('input-cpf');

const inputEmail = document.getElementById('input-email');

const outputLoanSimulation = document.getElementById('output-loan-simulation');

const formUserData = document.getElementById('form-user-data');

formUserData.style.display = 'none';

let tabelaEmprestimo = {};

const promise = (async () => {

    // lê a tabela de juros e parcelas vinda do servidor
    const request = await fetch('/calculadora/tabela', {
        method: 'GET',
    });

    const tabela = await request.json();

    // constrói os elementos HTML
    tabela.forEach((linha) => {

        const { parcelas, juro  } = linha;

        tabelaEmprestimo[parcelas] = juro;

        const option = document.createElement('option');
        option.setAttribute('name', linha.parcelas);
        option.innerText = `${ linha.parcelas } vezes`

        inputLoanInstallments.append(option);

    });

})();

promise.catch((error) => {

    console.log('ERROR: ', error);

    outputLoanSimulation.innerText = error.toString();

});

let serverData = null;

buttonSimulateLoan.onclick = (event) => {

    if (!tabelaEmprestimo) {
        outputLoanSimulation.innerText = 'ERRO: não foi possível carregar a tabela de juros do servidor!';
        formUserData.style.display = 'none';
        return;
    }

    const loan = parseInt(inputLoanValue.value);

    if (isNaN(loan)) {
        outputLoanSimulation.innerText = 'ERRO: empréstimo precisa ser um número inteiro!';
        formUserData.style.display = 'none';
        return;
    }

    const income = parseInt(inputMonthlyIncome.value);

    if (isNaN(income)) {
        outputLoanSimulation.innerText = 'ERRO: salário precisa ser um número inteiro!';
        formUserData.style.display = 'none';
        return;
    }

    const loanIndex = inputLoanInstallments.selectedIndex;

    if (loanIndex < 0) {
        outputLoanSimulation.innerText = 'ERRO: selecione a quantidade de parcelas!';
        formUserData.style.display = 'none';
        return;
    }

    const loanOption = inputLoanInstallments.options[loanIndex];

    const installments = parseInt(loanOption.getAttribute('name'));

    const interestRate = tabelaEmprestimo[installments];

    const fullLoan = loan * ((100 + interestRate) / 100);

    const installmentValue = fullLoan / installments;

    // a parcela pode ser, no máximo, 30% da renda de quem faz o empréstimo
    const incomeThreshold = income * 0.30;

    if (installmentValue > incomeThreshold) {
        outputLoanSimulation.innerText = `A parcela desse empréstimo (R$ ${ installmentValue.toFixed(2) }) passa dos 30% do seu salário! Não é possível aprovar esse empréstimo!`;
        
        formUserData.style.display = 'none';
        return;
    }

    serverData = {
        'installments': installments,
        'income': income,
    };

    const information = `JURO: ${ interestRate }%, PARCELA: R$ ${ installmentValue.toFixed(2) }, MONTANTE TOTAL: R$ ${ fullLoan.toFixed(2) }`;

    outputLoanSimulation.innerText = information;

    formUserData.style.removeProperty('display');

};

buttonSendData.onclick = () => {

    const name = inputName.value;

    const cpf = inputCpf.value;

    const email = inputEmail.value;

    const promise = (async () => {

        const userData = {
            name: name,
            cpf: cpf,
            email: email,
        };
        
        const fullServerData = { ...userData, ...serverData };
        
        const response = await fetch('/cadastros/', {
            method: 'POST',
            body: JSON.stringify(fullServerData),
            credentials: 'same-origin',
        });

        if (response.status === 200) {

            // OK!
            formUserData.style.display = 'none';
            outputLoanSimulation.innerText = 'Cadastro com sucesso!';
            
        } else {

            outputLoanSimulation.innerText = 'Algum erro aconteceu!';    
            
        }

    })();

    promise.catch((error) => {

        statusUserData.innerText = 'Algum erro aconteceu!';

    });

};
