(function(win, doc)  {

    

    function app() {

        // tipo da aposta
        let betType = ''; 
        // dados do json
        let gamesJson = [];
        
        let ItemInCart = [];
        // numero das apostas
        let bets = [];

        let priceCart = 0;

        const ajax = new XMLHttpRequest();
        
        const loadJson= (endpoint) => {
            ajax.open('GET', endpoint, true);
            ajax.send();
        }

        // remove os elementos filhos
        const remove = (item) =>  {
            while (item.firstChild) {
              item.removeChild(item.firstChild)
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

        // gera numeros aleatorios e unicos 
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

        // escolhe o tipo de aposta
        const game = (type) => {
            gamesJson.map( (bet) => {
                if (bet.type === type) {
                    doc.querySelector('[data-js="desc"]').textContent = bet.description;
                    doc.querySelector('[data-js="name-bet"]').textContent = ` ${type}`;
                    getRange(bet.range); 
                }
                betType = type;
            });
        }

        //clear game
        const clear = () => {   
            bets = [];
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

        // faz a aposta
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

        // cria o html dentro do carrinho
        const cartItem = (game, bet) => {
            const mainDiv = doc.createElement('div');
            mainDiv.setAttribute('class', 'games');

            const button = doc.createElement('button');
            const textButton = doc.createTextNode('🗑');
            button.setAttribute('data-delete', 'delete');
            button.appendChild(textButton);

            const secondDiv = doc.createElement('div');
            secondDiv.setAttribute('class', `${game.type}-div`);
            secondDiv.setAttribute('data-js', 'second')

            const pNumbers = doc.createElement('p');
            const textNumbers = doc.createTextNode(`${bet}`);
            pNumbers.appendChild(textNumbers);

            const pTypeGame = doc.createElement('p');
            pTypeGame.setAttribute('class', `game-name-${game.type}`);
            const textTyeGame = doc.createTextNode(game.type);
            pTypeGame.appendChild(textTyeGame)

            const pPrice = doc.createElement('p');
            pPrice.setAttribute('class', 'price');
            const textPrice = doc.createTextNode(` R$ ${game.price}`);
            pPrice.appendChild(textPrice)

            doc.querySelector('[data-js="cart-div"]').appendChild(mainDiv);
            mainDiv.appendChild(button);
            mainDiv.appendChild(secondDiv);
            secondDiv.appendChild(pNumbers);
            secondDiv.appendChild(pTypeGame);
            secondDiv.appendChild(pPrice);
            bets = [];
            return mainDiv;
        }

        // remove os itens do carrinho
        const removeItemCart = (item) => {
            doc.querySelector('[class="games"]').remove(item.parentElement);
            
        }

        const calculateTotalCart = () => {
            ItemInCart.map((itens) => {
                return (priceCart += itens.price)
            });
            doc.querySelector('[class="final-text"]').textContent = priceCart;
        }

        // botao de add no cart
        const addToCart = (bets) => {
            if(bets.length === 0){
                return alert('Faça um Novo jogo para adicionar no carrinho');
            }
            
            gamesJson.map((i) => {
                if(i.type === betType){
                    ItemInCart.push(i);
                    item = cartItem(i, bets);
                }
            })
            calculateTotalCart();
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
              const event = e.target; 
              if (event.dataset.title ) {
                return game(event.dataset.title);
              }
              if (event.dataset.complete === 'complete' ) {
                return completeGame();
              }
              if (event.dataset.clear === 'clear' ) {
                return clear();
              }
              if(event.dataset.add === 'add'){
                  return addToCart(bets);
              }
              if(event.dataset.delete === 'delete'){
                  return removeItemCart(event);
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