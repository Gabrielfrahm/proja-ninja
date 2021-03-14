(function(win, doc)  {

    

    function app() {

        // tipo da aposta
        let betType = ''; 
        const ajax = new XMLHttpRequest();
        // dados do json
        let gamesJson = [];

        // numero das apostas
        let bets = [];

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
            let arr = [];
            for(let i = 1; i <= limit; i++){
                const number = Math.ceil(Math.random() * range);
                const check = arr.some(item => {
                    return item === number;
                });
                if(check) i--;
                arr.push(number);
            }
            const uniqNumber = new Set(arr);
            bets = arr;
            return arr = [...uniqNumber];
        }

        const game = (type) => {
            gamesJson.map( (bet) => {
                if (bet.type === type) {
                    doc.querySelector('[data-js="desc"]').textContent = bet.description;
                    getRange(bet.range); 
                }
                betType = type;
            });
        }

        //clear game
        const clear = () => {   
            const inputs = doc.querySelector('input.selected');

            if(!doc.querySelector('[class="selected"]')){
                return alert('gere um jogo antes de limpar');
            }

            for(let i = 0 ; i <= bets.length; i++){
                inputs.removeAttribute('class');
            }

            if(doc.querySelector('[class="selected"]')){
                clear();
            } 
        }

        const completeGame = () => {
            if(betType === ''){
                return alert('Escolha um jogo!');
            }

            gamesJson.map((bet) => {
                if(betType === bet.type){
                    if(doc.querySelector('[class="selected"]')){
                        return alert('Limpe antes de gerar um novo jogo');
                    }
                    const arr = generateBet(bet.range, bet["max-number"]);
                    
                    const inputs = doc.querySelectorAll('input');
                    
                    for(let i = 0 ; i < arr.length; i++ ){                          
                        inputs[arr[i] - 1].setAttribute('class','selected');
                    }
                    return;
                }
            });
            
        }

       
        
        // le o json
        ajax.onreadystatechange = () => {
            if (ajax.readyState === 4) {
                gamesJson = JSON.parse(ajax.response).types;
                findButton(gamesJson);
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
                return completeGame();
              }
              if (element.dataset.clear === 'clear' ) {
                return clear();
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