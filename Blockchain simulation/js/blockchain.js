function toHex(val) {
    return val.toString(16); // Generer hexadecimal
}

class Block {
    constructor(txs, nonce, prevBlock) {
        // txs : les données 
        this.txs = txs;
        // nonce : nombre géneré aléatoirement pour la validation du block
        this.nonce = nonce;
        // le hash code du block precedent
        this.prevBlockHash = prevBlock;
        // la date generer lors de la creation de block
        this.timestamp = Date.now();
    }
    get getDate() { return Date.now(); }

    get getprevBlock() { return this.prevBlockHash };

    get getNonce() { return this.nonce; }

    getMerkle() {
        // Encryption de l'arbre de merkle (de données) en chaine de caractere
        return CryptoJS.SHA256(this.txs.toString()).toString();
    }

    getHash() {
        // retourne le hash code de tous les données en chaine de caractere
        return '01000000' // Decision de validation
            +
            CryptoJS.SHA256(

                this.prevBlockHash // block precedent en hash
                +
                this.getMerkle() // données en hash 
                +
                toHex(this.timestamp) // date en hexadecimal
                +
                '1' +
                toHex(this.nonce) // nonce 
            ).toString();
    }

}

class Blockchain {
    // genesisBlock : le block principal 
    constructor(genesisBlock) {
        this.blocks = new Array(); // la blockchain sous forme d'un tableau 

        // appel à la fonction get hash du block principal pour le stocker 
        // dans la blockchain
        this.blocks[genesisBlock.getHash()] = genesisBlock;

    }

    // miner un nouveau block
    // c'est à dire chercher et creer un block valide
    mineNewBlock(txs) {
        // generation du Nonce = preuve de travail PoW
        let nonce = Math.floor(Math.random() * 4294967294) + 1;

        // creation du block
        let minedBlock = new Block(txs, nonce, this.getLastBlock().getHash());
        // ajout du block dans la blockchain
        this.blocks[minedBlock.getHash()] = minedBlock;

    }


    getLastBlock() {
        let key = Object.keys(this.blocks)[Object.keys(this.blocks).length - 1];
        return this.blocks[key];
    }

    //prevBlockFrom(currentBlock) {
    // retu//rn this.blocks[currentBlock.prevBlockHash];
    //}
}

function genTxs() {

    return document.getElementById("myForm").value;
}

var genesisBlock = new Block(['genesis', 'block'], 1, null);
var blockchain = new Blockchain(genesisBlock);
let generator;


// instantiation du blockchain

function genBlock() {
    let a = genTxs();

    blockchain.mineNewBlock(genTxs());
    let blk = document.getElementById("blocks");
    blk.insertAdjacentHTML('afterbegin', `<div class="col-3 block">
    <div class="card" style="width: 18rem;">
        <div class="card-body">
            <h5 class="card-title border border-secondary p-2 my-2">Nonce:
                <span class="card-text p-1 my-3">` + blockchain.getLastBlock().getNonce + `</span>
            </h5>

            <h6 class="card-subtitle mb-2 text-muted">hash</h6>
            <p class="card-text border border-dark bg-secondary text-white p-2 my-3">` + blockchain.getLastBlock().getHash() + `</p>

            <h6 class="card-subtitle mb-2 text-muted">prevblockhash</h6>
            <p class="card-text border border-dark bg-secondary text-white p-2 my-3">` + blockchain.getLastBlock().getprevBlock + `</p>
            <h6 class="card-subtitle mb-2 text-muted"> Date</h6>
            <p class="card-text border border-dark bg-secondary text-white p-2 my-3">` + blockchain.getLastBlock().getDate + `</p>
        </div>
    </div>
</div>`);
}

function fun() {
    document.getElementById("myForm").value = "";
}