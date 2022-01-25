const Enum = require('enum')

Enum.register();

function isEnumType(k) {
    return typeof k =='object' && k.constructor && k.constructor.name == 'EnumItem' && typeof k.valueOf == 'function';
}

const cardRank = new Enum({'A':0,'2':1,'3':2,'4':3,'5':4,'6':5,'7':6,'8':7,'9':8,'10':9,'J':10,'Q':11,'K':12}, { ignoreCase: true , freeze : true});

const cardSuit = new Enum({'Heart':0,'Spade':1,'Diamond':2,'Club':3}, { ignoreCase: true , freeze : true});

class Card extends Uint8Array {
    /**
     * 
     * @param {int| CardRank} value 
     * @param {int| CardSuit|undefined} color
     */
    constructor(value, color = undefined) {
        var v = isEnumType(value) && cardRank.isDefined(value) ? value.valueOf() : value;
        super(1);

        if (typeof color == 'undefined') {
            if  (typeof value != 'number' ||  value>52 || value<0)
                throw new Error('Construct should be CardValue or positive interger, less than 52');
            this[0] = v;
        } else if (typeof color == 'number' && color>=0 && color <4) {
            this[0] = color + v * 4;
        } else if (isEnumType(color) && cardSuit.isDefined(color)) {
            this[0] = color.valueOf() + v * 4;
        } else {
            throw new Error('Color should by CardColor enum or positive integer, less than 4')
        } 
    }

    /**
     * return value of card 
     * @returns {string}
     */
    get Rank() {
        return cardRank.get(Math.floor(this[0] / 4)).key;
    }

    /**
     * return card color
     * @returns {string}
     */
    get Suit() {
        return cardSuit.get(this[0] %  4).key;
    }

    get Symbol() {
        switch(this.Suit) {
            case 'Heart' :
                return '♡';
                break;
            case 'Spade' : 
                return '♤';
                break;
            case 'Diamond' :
                return '♢';
                break;
            case 'Club' : 
                return '♣';
        }
    }
};

class CardDeck extends Uint8Array {
   
    constructor() {
        if (arguments.length == 0) {
            super(52);

            for(var i=1;i<this.length;i++)
                this[i] = i;

        } else if (arguments.length ==1 && typeof (arguments[0] == 'number')) {
            super(arguments[0]);

            for(var i=1;i<this.length;i++)
                this[i] = i;
        } else {
            var args = Array.prototype.slice.call(arguments);

            super(args.length);

            for(var i=0;i<args.length;i++) {
                if (args[i] instanceof Card) {
                    this[i] = args[i][0];
                } else {
                    throw new Error('Constructor argument ' + i + ' should be Card');
                }
            }
        }

        
    }

    /**
     * Shufle card 
     * Fisher–Yates shuffle algorithm
     */
    shuffle() {
        var idx = this.length, rnd, rx;
        while(idx!=0) {
            rnd = Math.floor(Math.random() * idx);
            idx--;
            rx = this[idx];
            this[idx] = this[rnd];
            this[rnd] = rx;
        }
    }

    /**
     * 
     * @param {number} idx
     * @returns {Card} card  
     */
    cardAt(idx) {
        if (typeof idx != 'number' || idx<0 || idx >52 )
            throw new Error('Invalid card index');

        return new Card(this[idx]);
    }


    showDeck() {
        var vs = '';

        for(var i=0;i<this.length;i++) {
            var cd = new Card(this[i]);
            vs = vs + cd.Rank + ':' + cd.Symbol + ', ';
        }

        return vs.substring(0,vs.length-2);
    }

    /**
     * verify if all cards are flushed
     * @return {boolean}
     */
    static isFlush() {
        var cnd, 
            _isFlush = true;

        if (arguments.length<2) {
            throw new Error('Minimum 2 cards');
        }

            
        for(var i=0;_isFlush && i<arguments.length;i++) {
            if (arguments[i] instanceof Card) {
               if (!!i) {
                    _isFlush = _isFlush && (cnd == arguments[i][0] %  4)
               } else {
                   cnd = arguments[i][0] %  4;
               }
            } else {
                throw new Error('Argument ' + i + ' should be Card');
            }
        }
        return _isFlush;
    }

    /**
     * verify that is straigth
     * @param - {Cards} x 5
     * @returns {boolean} true or false
     */
    static isStraight() {
        var _isStraigth = true,
            arr = new Uint8Array(5);

        if (arguments.length != 5) {
            throw new Error('Call with 5 cards');
        }

        for(var i =0;i<5;i++) {
            if (arguments[i] instanceof Card) {
                arr[i] = Math.floor(arguments[i][0] / 4);
                if (arr[i]>9) {
                    arr[i] = arr[i] + 1; 
                }
             } else {
                 throw new Error('Argument ' + i + ' should be Card');
             }
        }
        arr.sort();

        for(var i =0;_isStraigth && i<4;i++) {
            _isStraigth = _isStraigth && (arr[i] == arr[i+1] -1);
        }

        if (!_isStraigth && arr[0] ==0) {
            _isStraigth = true;
            arr[0] = 10;
            // try 10 A J sequence
            arr.sort();
            for(var i =0;_isStraigth && i<4;i++) {
                _isStraigth = _isStraigth && (arr[i] == arr[i+1] -1);
            }
        }
        return _isStraigth;
    }
}

module.exports = {
    Card,
    CardDeck,
    CardRank : cardRank,
    CardSuit : cardSuit
}
