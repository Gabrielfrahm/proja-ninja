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
        // objeto do jogo selecionado
        let gameSelected = {};

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
                if( i < 10) {
                  input.setAttribute('value', '0' + i );

                  input.setAttribute('readonly', true);
                  input.setAttribute('data-input', i);
                  doc.querySelector('[data-js="numbers"]').appendChild(input);
                }
                if( i >= 10){
                  input.setAttribute('value', i );
                  input.setAttribute('readonly', true);
                  input.setAttribute('data-input', i);
                  doc.querySelector('[data-js="numbers"]').appendChild(input);
                }
            }
            return range;
        }

        // gera números aleatórios e únicos
        const generateBet = (range, limit) => {
            let arr = [];
            let curNumb = 0;
            for(let i = 1; i <= limit; i++){
              let number = Math.ceil(Math.random() * range);
              const check = arr.some(item => {
                return item === number;
              });
              if(check)  i--;
              curNumb = number;
              arr.push(number);
            }

            const uniqNumber = new Set(arr);
            arr = [...uniqNumber];

            // caso o user ja tenho escolhido numeros
            if(bets.length > 0){
              const checkNumb = arr.some(item => {
                return item === curNumb
              });
              if(checkNumb){
                arr.splice(checkNumb,1);
              }
              console.log(arr);
              console.log(bets);
              const result = arr.length - bets.length;
              return bets = bets.concat(arr.slice(0,result));
            }

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
                const button = doc.querySelector(`[data-title="${item.type}"]`)
                //css
                button.style.border = `2px solid ${item.color}`;
                button.style.width = `113px`;
                button.style.height = `34px`;
                button.style.borderRadius = `100px`;
                button.style.marginTop = `20px`;
                button.style.backgroundColor = `transparent`;
                button.style.color = `${item.color}`;
                button.style.fontWeight = `bold`;
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
                    range = getRange(bet.range);
                    betType = type;
                    gameSelected = bet;
                    console.log(gameSelected)
                }
            });
        }

        //clear game
        const clear = () => {
            bets = [];
            const inputs = doc.querySelector(`input.selected`);

            if(!doc.querySelector(`[class="selected"]`)){
                return alert('gere um jogo antes de limpar');
            }

            for(let i = 0 ; i <= bets.length; i++){
                inputs.removeAttribute('class');
            }

            if(doc.querySelector(`[class="selected"]`)){
                return clear();
            }
        }

        // faz a aposta
        const completeGame = () => {
            // bets = [];
            if(betType === ''){
                return alert('Escolha um jogo!');
            }
                if(betType === gameSelected.type){
                    // if(doc.querySelectorAll(`[class="selected-${gameSelected.type}"]`)){
                    //     return alert('Limpe antes de gerar um novo jogo');
                    // }
                    if(bets.length > 0 ){
                      const arr = generateBet(gameSelected.range, gameSelected["max-number"]);
                      const inputs = doc.querySelectorAll('input');

                      for(let i = 0 ; i < arr.length ; i++ ){
                        inputs[arr[i] - 1].setAttribute('class',`selected`);
                      }
                      return;
                    }

                    const arr = generateBet(gameSelected.range, gameSelected["max-number"]);
                    const inputs = doc.querySelectorAll('input');

                    for(let i = 0 ; i < arr.length; i++ ){
                      inputs[arr[i] - 1].setAttribute('class',`selected`);
                    }
                }
        }

        // remove o feedback
        const removeFeedBack =  () => {
            const pVoid = doc.querySelector(`[data-js="void"]`);
            if(pVoid){
                return doc.querySelector('[data-js="cart-div"]').removeChild(pVoid);
            }
            return;
        }

        // add o feedback
        const addFeedBack = () => {
                const p = doc.createElement('p');
                const text = doc.createTextNode('Seu carrinho esta vazio =(');
                p.setAttribute('class', 'cart-title');
                p.style.fontSize = '17px'
                p.setAttribute('data-js', 'void');
                p.appendChild(text);
                const div = doc.querySelector('[data-js="cart-div"]');
                return div.appendChild(p);
        }

        // cria o html dentro do carrinho
        const cartItem = (game, bet) => {
            removeFeedBack();
            const mainDiv = doc.createElement('div');
            mainDiv.setAttribute('class', 'games');

            const button = doc.createElement('button');
            const textButton = doc.createTextNode('🗑');
            button.setAttribute('data-delete', 'delete');
            button.appendChild(textButton);

            const secondDiv = doc.createElement('div');
            secondDiv.setAttribute('class', `${game.type}-div`);
            secondDiv.setAttribute('data-js', 'second');
            //css
            secondDiv.style.display = 'flex';
            secondDiv.style.flexDirection = 'column';
            secondDiv.style.borderLeft = `4px solid ${game.color}`;
            secondDiv.style.borderRadius = `5px`;
            secondDiv.style.fontSize = `19px`;
            secondDiv.style.color = `#868686`;

            const pNumbers = doc.createElement('p');
            const textNumbers = doc.createTextNode(`${bet}`);
            pNumbers.appendChild(textNumbers);

            const pTypeGame = doc.createElement('p');
            pTypeGame.setAttribute('class', `game-name-${game.type}`);
            pTypeGame.style.color = `${game.color}`
            pTypeGame.style.fontWeight = `bold`
            const textTyeGame = doc.createTextNode(game.type);
            pTypeGame.appendChild(textTyeGame)

            const pPrice = doc.createElement('p');
            pPrice.setAttribute('class', 'price');

            const textPrice = doc.createTextNode(` ${game.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`);
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
            doc.querySelector('[class="final-text"]').textContent =  `TOTAL:  ${sum(itemInCart).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`;
           if(itemInCart.length === 0){
            addFeedBack();
           }
        }

        // calcula o preço no carrinho
        const calculateTotalCart = () => {
          return doc.querySelector('[class="final-text"]').textContent =  `TOTAL: ${sum(itemInCart).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`;
        }

        // botao de add no cart
        const addToCart = (bets) => {
            if(bets.length === 0){
                return alert('Faça um Novo jogo para adicionar no carrinho');
            }
            clear();
            if(gameSelected.type === betType){
              if(bets.length < gameSelected['max-number']){
                  return alert(`voce tem que selecionar ${gameSelected['max-number']} numeros`)
              }
              itemInCart.push(gameSelected);
              calculateTotalCart();
              return cartItem(gameSelected, bets);
            }
        }

        const userSelected = (value) => {
            if(betType === ''){
                return alert('Escolha um jogo!');
            }
                if(betType === gameSelected.type){
                    const input = doc.querySelector(`[data-input="${value}"]`);
                    if(bets.length >= gameSelected['max-number']){
                        return alert(`voce so pode selecionar ${gameSelected['max-number']} números, seus números sao  ${bets}`);
                    }
                    let number = Number(input.value);
                    const check = bets.some(item => {
                        return item === number;
                    });
                    if(check){
                        return alert('voce ja tem esse numero, por favor escolha outro')
                    }
                    bets.push(Number(input.value));
                    console.log(bets);
                    input.setAttribute('class', `selected`);

                }
        }

        // le o json
        ajax.onreadystatechange = () => {
            if (ajax.readyState === 4) {
                gamesJson = JSON.parse(ajax.response).types;
                findButton(gamesJson);
                game('Lotofácil');
                addFeedBack();

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
