(function(win, doc)  {

    

    function app() {

        let betType = ''; 
        const ajax = new XMLHttpRequest();
        let games = [];

        const loadJson= (endpoint) => {
            ajax.open('GET', endpoint, true);
            ajax.send();
        }

        // procura os botoes
        const findButton = (data) => {
            data.map((item, index) => {
                const title = doc.createElement('button');
                const titleText = doc.createTextNode(item.type);
                title.setAttribute('class', `${item.type}`);
                title.setAttribute('data-title', item.type)
                title.appendChild(titleText);
                doc.querySelector('[data-js="chose-game"]').appendChild(title);
            }); 
        }
        

        // remove os elementos filhos
        const remove = (element) =>  {
            while (element.firstChild) {
              element.removeChild(element.firstChild)
            }
        }

        //pega o range de cada jogo
        const getRange = (range) => { 
            remove(doc.querySelector('[data-js="numbers"]'));
            for (let i = 1; i <= range; i++) {
                const input = doc.createElement('input');
                input.setAttribute('value', i );
                input.setAttribute('readonly', true);
                doc.querySelector('[data-js="numbers"]').appendChild(input);
            }
        }

        const generateBet = (range, limit) => {
            for(let i = 1; i <= limit; i++){
                console.log(Math.floor(Math.random() * range))
            }
        }

        const game = (type) => {
            games.map( (bet) => {
                if (bet.type === type) {
                    doc.querySelector('[data-js="desc"]').textContent = bet.description;
                    getRange(bet.range); 
                }
                betType = type;
            });
        }

        const completeGame = () => {
            if(betType === ''){
                return alert('Escolha um jogo!');
            }
        
            games.map((bet) => {
                if(betType === bet.type){
                    generateBet(bet.range, bet["max-number"]);
                    console.log(betType);
                }
                
            });
            
        }
        
        // le o json
        ajax.onreadystatechange = () => {
            if (ajax.readyState === 4) {
                games = JSON.parse(ajax.response).types;
                findButton(games);
            }
        }

        // add event
        doc.addEventListener(
            'click', (e) => {
              const element = e.target; 
              if (element.dataset.title ) {
                return game(element.dataset.title);
              }
              if (element.dataset.complete === 'complete' ) {
                return completeGame(element.dataset.complete);
              }
            },
            false
        );

        win.addEventListener('load', () => {
            loadJson('games.json');
        });
    }
    app();
})(window, document)