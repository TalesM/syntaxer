function Parser(tokenizer){
    var look = {
        head: tokenizer.parse(), 
        tail: null
    };
    function next() {
        var result = look.head;
        if(!look.tail){
            look = {
                head: tokenizer.parse(), 
                tail: null
            };
        }else {
            look = look.tail;
        }
        return result;
    }
    var current = null;
    function checkToken(type) {
        if(look.head.type === type){
            var n = {
                head: next(),
                tail: current,
            };
            current = n;
            return true;
        }
        return false;
    }
    function unroll () {
        while(current){
            var l = look;
            look = {
                head: current.head,
                tail: l,
            }
            current = current.tail;
        }
    }
    {{#productions}}
    this.{{name}}: function() {
        {{#definitions}}
        if( true {{#.}}
            &&{{#terminal}} checkToken('{{{item}}}') {{/terminal}}{{!
            }}{{^terminal}} this.{{item}}() {{/terminal}}{{!
            }}{{/.}}
        ){
            return true;
        }
        unroll();
        {{/definitions}}
        return false;
    };
    {{/productions}}
}