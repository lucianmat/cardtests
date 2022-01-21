var assert = require('assert');
const {Card, CardDeck, CardRank, CardSuit} = require('./../src/cards');

describe('Cards tests', function() {
  describe('constructors', function() {
    it('Card should construct with integers', function(done) {
        var v = new Card(3);
        
        assert.equal(v[0],3);
        v = new Card(3,2);
        assert.equal(v[0], 3*4 +2);

        assert.throws(()=>{ new Card(100)},Error,'Construct should be CardValue or positive interger, less than 52')
        assert.throws(()=>{ new Card(2,10)},Error,'Color should by CardColor enum or positive integer, less than 4')
        done();
    });

    it('Card should construct with enum values', function(done) {
        var v = new Card(CardRank.J, CardSuit.Heart);
        
        assert.equal(v.Rank,CardRank.J.key);
        assert.equal(v.Suit, CardSuit.Heart.key);

        assert.equal(v[0], CardRank.J.valueOf()* 4 + CardSuit.Heart.valueOf());

        assert.throws(()=>{ new Card(CardSuit.Heart)}, Error);
        assert.throws(()=>{ new Card(CardRank.J,CardRank.J)}, Error);
        
        done();
    });

    it('CardDeck should construct', function(done) {
        var cd = new CardDeck();
        assert.notEqual(cd,null);
        
        cd = new CardDeck(5);
        assert.notEqual(cd,null);
        
        cd = new CardDeck(new Card(1), new Card(3));

        assert.notEqual(cd,null);
        assert.equal(cd[0],1);
        assert.equal(cd[1],3);
      
        done();
    })


  });

  describe('Running tests', function () {

        it('card deck shufle', function (done) {
            var cd = new CardDeck();
            cd.shuffle();
            console.log('shoufle full deck :' + cd.showDeck());

            cd = new CardDeck(new Card(1), new Card(3), new Card(10), new Card(16));
            cd.shuffle();
            console.log('shofle small pack: ' + cd.showDeck());
      
            done();
        });

        it('card deck isFlush', function (done) {

            var toShow = new CardDeck(new Card(CardRank.J, CardSuit.Heart),new Card(CardRank.K, CardSuit.Heart), new Card(CardRank.A, CardSuit.Heart));
            console.log('testing isFlush for ' + toShow.showDeck());

            var vc = CardDeck.isFlush(new Card(CardRank.J, CardSuit.Heart),new Card(CardRank.K, CardSuit.Heart), new Card(CardRank.A, CardSuit.Heart))
            assert.equal(vc, true);

            toShow = new  CardDeck(new Card(CardRank.J, CardSuit.Spade),new Card(CardRank.K, CardSuit.Heart), new Card(CardRank.A, CardSuit.Heart));
            console.log('testing isFlush for ' + toShow.showDeck());

            vc = CardDeck.isFlush(new Card(CardRank.J, CardSuit.Spade),new Card(CardRank.K, CardSuit.Heart), new Card(CardRank.A, CardSuit.Heart));
            assert.equal(vc, false);

            assert.throws(()=>{ CardDeck.isFlush(new Card(CardRank.J, CardSuit.Spade),'a', new Card(CardRank.A, CardSuit.Heart))}, Error);
            done();
        })

        it('card deck isStraight', function (done) { 
            var toShow = new CardDeck(new Card(CardRank['10'], CardSuit.Heart),
                            new Card(CardRank.K, CardSuit.Heart), 
                            new Card(CardRank.A, CardSuit.Heart),
                            new Card(CardRank.J, CardSuit.Spade),
                            new Card(CardRank.Q, CardSuit.Heart));

            var vc = CardDeck.isStraight(new Card(CardRank['10'], CardSuit.Heart),
                                         new Card(CardRank.K, CardSuit.Heart), 
                                        new Card(CardRank.A, CardSuit.Heart),
                                        new Card(CardRank.J, CardSuit.Spade),
                                        new Card(CardRank.Q, CardSuit.Heart)
                                        );
            console.log('testing isStraight for ' + toShow.showDeck());
            assert.equal(vc, true);

            toShow = new CardDeck(new Card(CardRank['6'], CardSuit.Spade),
                    new Card(CardRank['7'], CardSuit.Heart), 
                    new Card(CardRank['8'], CardSuit.Heart),
                    new Card(CardRank['9'], CardSuit.Heart),
                    new Card(CardRank['10'], CardSuit.Heart));
            console.log('testing isStraight for ' + toShow.showDeck());
       
             vc = CardDeck.isStraight(new Card(CardRank['6'], CardSuit.Spade),
                                         new Card(CardRank['7'], CardSuit.Heart), 
                                        new Card(CardRank['8'], CardSuit.Heart),
                                        new Card(CardRank['9'], CardSuit.Heart),
                                        new Card(CardRank['10'], CardSuit.Heart)
                                        );
            assert.equal(vc, true);
           
            toShow = new CardDeck(new Card(CardRank.A, CardSuit.Spade),
                            new Card(CardRank['5'], CardSuit.Heart), 
                        new Card(CardRank['2'], CardSuit.Heart),
                        new Card(CardRank['3'], CardSuit.Heart),
                        new Card(CardRank['4'], CardSuit.Heart));
            console.log('testing isStraight for ' + toShow.showDeck());

            vc = CardDeck.isStraight(new Card(CardRank.A, CardSuit.Spade),
                        new Card(CardRank['5'], CardSuit.Heart), 
                    new Card(CardRank['2'], CardSuit.Heart),
                    new Card(CardRank['3'], CardSuit.Heart),
                    new Card(CardRank['4'], CardSuit.Heart)
                    );
            assert.equal(vc, true);

            toShow = new CardDeck(new Card(CardRank.A, CardSuit.Spade),
            new Card(CardRank['5'], CardSuit.Heart), 
        new Card(CardRank['3'], CardSuit.Heart),
        new Card(CardRank['4'], CardSuit.Heart),
        new Card(CardRank['6'], CardSuit.Heart));
        console.log('testing isStraight for ' + toShow.showDeck());

            vc = CardDeck.isStraight(new Card(CardRank.A, CardSuit.Spade),
                            new Card(CardRank['5'], CardSuit.Heart), 
                        new Card(CardRank['3'], CardSuit.Heart),
                        new Card(CardRank['4'], CardSuit.Heart),
                        new Card(CardRank['6'], CardSuit.Heart)
                        );
                assert.equal(vc, false);
            done();
        });

  });
});