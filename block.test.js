const Block = require('./block');
const cryptoHash = require('./crypto_Hash');
const MINE_RATE = 1000;
describe('Block', ()=>{
    const timestamp = 2000;
    const lastHash = 'lastHash';
    const hash = 'current-hash';
    const nonce = 1;
    const difficulty = 1;
    const data = ['blockchain','data'];

    const block = new Block({timestamp,lastHash,hash,data,nonce,difficulty});


    describe('mineBlock', ()=> {
        const lastBlock = Block.genesisBlock();
        const data = 'mined data';
        const minedBlock = Block.mineBlock({lastBlock,data});

        it('sets the `lastHash` to be the `hash` of the lastBlock', ()=>{
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        });

        it('sets the `data`',()=>{
            expect(minedBlock.data).toEqual(data);
        });

        it('sets a `timestamp`', ()=>{
            expect(minedBlock.timestamp).not.toEqual(undefined);
        });

        it('creates a SHA-256 `hash` based on the proper inputs', ()=>{
            expect(minedBlock.hash)
            .toEqual(
                cryptoHash(
                minedBlock.timestamp,
                minedBlock.nonce,
                minedBlock.difficulty,
                lastBlock.hash,
                data));
        });

        it('sets a `hash` that matches the difficulty criteria', ()=>{
            expect(minedBlock.hash.substring(0,minedBlock.difficulty)).toEqual('0'.repeat(minedBlock.difficulty));
        });

        it('changing the difficulty',()=>{
            const results = [lastBlock.difficulty+1, lastBlock.difficulty-1];

            expect(results.includes(minedBlock.difficulty)).toBe(true);
        });


       
    });

    describe('changeDifficulty()',()=>{

        it('raises the difficulty for a quickly mined block',()=>{
            expect(Block.changeDifficulty({
                originalBlock: block, timestamp: block.timestamp + MINE_RATE - 100
            })).toEqual(block.difficulty+1);
        });

        it('lowers the difficulty for a slowly mined block',()=>{
            expect(Block.changeDifficulty({
                originalBlock: block, timestamp: block.timestamp + MINE_RATE + 100
            })).toEqual(block.difficulty-1);
        });
        
        it('has a lower limit of 1',()=>{
            block.difficulty = -1;

            expect(Block.changeDifficulty({originalBlock:block})).toEqual(1);
        });

    });
});