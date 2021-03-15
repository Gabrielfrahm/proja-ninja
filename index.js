(function(win, doc)  {

    function app() {

        // tipo da aposta
        let betType = ''; 
        // dados do json
        let gamesJson = [];
        // item no carrinho
        let itemInCart = [];
        // numero das apostas
        let bets = [];

        

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

        // pega o range de cada jogo
        const getRange = (range) => { 
            remove(doc.querySelector('[data-js="numbers"]'));
            for (let i = 1; i <= range; i++) {
                const input = doc.createElement('input');
                input.setAttribute('value', i );
                input.setAttribute('readonly', true);
                input.setAttribute('data-input', i);
                doc.querySelector('[data-js="numbers"]').appendChild(input);
            }
        }

        // gera números aleatórios e únicos 
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
            
            arr = [...uniqNumber];
            return bets = [...uniqNumber];
        }

        // procura os botoes
        const findButton = (data) => {
            data.filter((item, index) => {
                const title = doc.createElement('button');
                const titleText = doc.createTextNode(item.type);
                title.setAttribute('class', `${item.type}`);
                title.setAttribute('data-title', item.type)
                title.appendChild(titleText);
                doc.querySelector('[data-js="chose-game"]').appendChild(title);
            }); 
        }

        const toggle = (bet) => {
            const buttons =  doc.querySelector(`[class="${bet.type}"]`);
            if(buttons){
                buttons.removeAttribute('class');
                buttons.classList.toggle(`${bet.type}-toggle`);
                return
            }  
        }

        // escolhe o tipo de aposta
        const game = (type) => {
            bets= [];
            gamesJson.filter( (bet) => {
                if (bet.type === type) {
                    toggle(bet);
                    doc.querySelector('[data-js="desc"]').textContent = bet.description;
                    doc.querySelector('[data-js="name-bet"]').textContent = ` ${type}`;
                    getRange(bet.range);
                    betType = type;
                }
            });
            
        }

        //clear game
        const clear = () => {   
            bets = [];
            const inputs = doc.querySelector(`input.selected-${betType}`);

            if(!doc.querySelector(`[class="selected-${betType}"]`)){
                return alert('gere um jogo antes de limpar');
            }

            for(let i = 0 ; i <= bets.length; i++){
                inputs.removeAttribute('class');
            }

            if(doc.querySelector(`[class="selected-${betType}"]`)){
                return clear();
            } 
        }

        // faz a aposta
        const completeGame = () => {
            // bets = [];
            if(betType === ''){
                return alert('Escolha um jogo!');
            }

            gamesJson.filter((bet) => {
                if(betType === bet.type){
                    if(doc.querySelector(`[class="selected-${bet.type}"]`)){
                        return alert('Limpe antes de gerar um novo jogo');
                    }
                    const arr = generateBet(bet.range, bet["max-number"]);
                    const inputs = doc.querySelectorAll('input');
                    
                    for(let i = 0 ; i < arr.length; i++ ){                          
                        inputs[arr[i] - 1].setAttribute('class',`selected-${bet.type}`);
                    }
                    return;
                }
            });
            
        }

        const removeFeedBack =  () => {
            const pVoid = doc.querySelector(`[data-js="void"]`);
            if(pVoid){
                return doc.querySelector('[data-js="cart-div"]').removeChild(pVoid);
            }
            return;
        }

        // cria o html dentro do carrinho
        const cartItem = (game, bet) => {
            removeFeedBack()
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
            // return mainDiv;
        }

        const sum = (arr) => {
            let sum = 0;
            arr.map(item => {
                if(item){
                    return sum += item.price
                }
                return sum = 0;
            })
            return sum; 
        }

        // remove os itens do carrinho
        const removeItemCart = (item) => {
            doc.querySelector('[class="games"]').remove(item.parentElement);
            itemInCart.splice(item,1);
            doc.querySelector('[class="final-text"]').textContent =  `TOTAL: R$ ${sum(itemInCart)}`;
        }
        
        // calcula o preço no carrinho 
        const calculateTotalCart = () => {
            doc.querySelector('[class="final-text"]').textContent =  `TOTAL: R$ ${sum(itemInCart)}`;
        }
        
        // botao de add no cart
        const addToCart = (bets) => {
            if(bets.length === 0){
                return alert('Faça um Novo jogo para adicionar no carrinho');
            }

            clear();
            
            gamesJson.map((i) => {
                if(i.type === betType){
                    if(bets.length < i['max-number']){
                        return alert(`voce tem que selecionar ${i['max-number']} numeros`)
                    }
                    itemInCart.push(i);
                    return cartItem(i, bets);
                }
            })
            calculateTotalCart();
        }

        const userSelected = (value) => {
            if(betType === ''){
                return alert('Escolha um jogo!');
            }

            gamesJson.filter((bet) => {
                if(betType === bet.type){

                    const input = doc.querySelector(`[data-input="${value}"]`);
                    
                    if(bets.length >= bet['max-number']){
                        return alert(`voce so pode selecionar ${bet['max-number']} números, seus números sao  ${bets}`);
                    }
                    
                    let number = input.value;
                    const check = bets.some(item => {
                        return item === number;
                    });

                    if(check){
                        return alert('voce ja tem esse numero, por favor escolha outro')
                    }
                    bets.push(input.value); 
                    input.setAttribute('class', `selected-${betType}`);    
                }
            });
        }
        
        // le o json
        ajax.onreadystatechange = () => {
            if (ajax.readyState === 4) {
                gamesJson = JSON.parse(ajax.response).types;
                findButton(gamesJson);
                game('Lotofácil')
            }
        }

        // add event
        doc.addEventListener(
            'click', (e) => {
              const event = e.target; 
              if (event.dataset.title ) {
                return game(event.dataset.title);
              }
              if (event.dataset.input) {
                return userSelected(event.dataset.input);
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
                return removeItemCart(event.dataset.delete);
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