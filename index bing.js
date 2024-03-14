function roll(d) {
    return Math.floor(Math.random() * d + 1)
}

class Atributes {
    #Mod
    constructor(tipo, valor) {
        this.Tipo = tipo
        this.Valor = Number(valor)
        this.#Mod = Math.floor((this.Valor - 10) / 2)
    }

    get Mod() {
        return this.#Mod
    }
}

class Personagem {
    #nome
    #life
    #ac
    constructor(nome, Des, For, Con, Car, Int, Sab) {
        this.#nome = nome
        this.des = new Atributes('Des', Des)
        this.for = new Atributes('For', For)
        this.con = new Atributes('Con', Con)
        this.car = new Atributes('Car', Car)
        this.int = new Atributes('Int', Int)
        this.sab = new Atributes('Sab', Sab)
        this.#life = roll(60) + 20
        this.#ac = roll(10) + 1
    }

    get life() {
        return this.#life
    }
    set life(newValue) {
        this.#life = newValue
    }

    get ac() {
        return this.#ac
    }

    get nome() {
        return this.#nome
    }

    attack(enemy) {
        const dice = roll(20)
        if (dice + this.des.Mod > enemy.ac) {
            //Successful attack
            const damage = roll(8)
            enemy.life -= (damage + this.des.Mod)

            return `Dano causado: ${damage + this.des.Mod}<br>
            Dado arma: ${damage}<br>
            Mod: ${this.des.Mod}`
        }
        else{
            return 'Ataque falho'
        }
    }
}

var num = 1
const ordem = []
let btnOrdenar = document.getElementById('ordenar')
let btnAtacar = document.getElementById('atacar')

function addPersonagem() {
    var personagem = new Personagem("Personagem: " + num, roll(10) + 8, roll(10) + 8, roll(10) + 8, roll(10) + 8, roll(10) + 8, roll(10) + 8)
    ordem.push(personagem)

    // Cria um novo parágrafo NOME
    var pNome = document.createElement("p");
    var pText = document.createTextNode(`Nome: ${personagem.nome} --- Vida: ${personagem.life} --- CA: ${personagem.ac}`);
    pNome.appendChild(pText);
    pNome.id = "n" + num

    // Cria um novo parágrafo INICIATIVA
    var pINICIATIVA = document.createElement("p");
    var pText = document.createTextNode(`Des: ${personagem.des.Mod} --- For: ${personagem.for.Mod} --- Con: ${personagem.con.Mod} --- Int: ${personagem.int.Mod} --- Sab: ${personagem.sab.Mod} --- Car: ${personagem.car.Mod}`);
    pINICIATIVA.appendChild(pText);
    pINICIATIVA.id = "i" + num

    var pDivs = document.createElement("p");
    var pText = document.createTextNode(`--------------------------------------------------------------------------`);
    pDivs.appendChild(pText);
    pDivs.id = "divso" + num

    // Adiciona o novo parágrafo à div
    var div = document.getElementById("myDiv");
    div.appendChild(pNome);
    div.appendChild(pINICIATIVA);
    div.appendChild(pDivs);


    //Adiciona o atributo 'valorIniciativa' para cada personagem no Array ordem, sendo o valor dele = roll(20) + perso.des.Mod
    ordem.forEach(perso => {
        perso['valorIniciativa'] = roll(20) + perso.des.Mod
    })

    num++
}

function compare(a, b) {
    if (a.valorIniciativa < b.valorIniciativa) {
        return -1
    }
    else if (a.valorIniciativa > b.valorIniciativa) {
        return 1;
    }
    else if (a.valorIniciativa == b.valorIniciativa) {
        a['desempate'] = roll(20) + a.des.Mod
        b['desempate'] = roll(20) + b.des.Mod

        if (a.desempate < b.desempate) {
            return -1;
        }
        else if (a.desempate > b.desempate) {
            return 1;
        }
    }
}


let turno = 0
let nomeTurno = ordem[turno]
let tab = document.getElementById('turno')
let tb = document.createElement('select')
let titulo = document.getElementById('quem')
let oponentes = ordem


function ordenar() {
    document.getElementById("ordem").innerHTML = ''

    ordem.sort(compare)
    ordem.reverse()

    for (i in ordem) {
        document.getElementById("ordem").innerHTML += `Valor total: ${ordem[i].valorIniciativa} - ${ordem[i].nome} - VALOR DESEMPATE: ${ordem[i].desempate}<br>`
    }

//----------------------------------------------------------------------------

    btnOrdenar.style.visibility='hidden'
    btnAtacar.style.visibility='visible'
    nomeTurno = ordem[turno].nome
    titulo.innerText = `Turno de ${nomeTurno}`
    oponentes = [...ordem]
    oponentes.splice(0, 1)
    tb.setAttribute('id', 'tab')
    tb.setAttribute('size', '10')
    tab.appendChild(tb)

    for (i in oponentes){
        let item = document.createElement('option')
        item.text = oponentes[i].nome
        item.value = i
        tb.appendChild(item)
    }

}

//teste de progressão de turno

let res = document.getElementById("result")

function atacar() {
    // Obtém o índice do personagem alvo da lista suspensa
    let indiceAlvo = parseInt(tb.value);
  
    // O personagem do turno atual ataca o personagem alvo
    let resultado = ordem[turno].attack(ordem[indiceAlvo]);
  
    // Atualiza a vida do personagem alvo na interface do usuário
    document.getElementById(`n${indiceAlvo + 1}`).innerText = `Nome: ${ordem[indiceAlvo].nome} --- Vida: ${ordem[indiceAlvo].life} --- CA: ${ordem[indiceAlvo].ac}`;
  
    // Imprime o resultado do ataque
    res.innerText = resultado;
  
    // Move para o próximo turno
    turno = (turno + 1) % ordem.length;
  
    // Atualiza o nome do turno na interface do usuário
    titulo.innerText = `Turno de ${ordem[turno].nome}`;
  
    // Atualiza a lista suspensa de oponentes
    tb.innerHTML = ''
    oponentes = [...ordem]
    oponentes.splice(turno, 1)
  
      // Adiciona o personagem à lista suspensa
      for (i in oponentes){
        let item = document.createElement('option')
        item.text = oponentes[i].nome
        item.value = i
        tb.appendChild(item)
    }

    
  }
  
