require(['SyntaxParser', 'TemplGenerator', 'DomParser', 'TextGenerator', 'text!syntax.html', 'text!edit.html', 'text!model.syntax'], 
function (syntaxParser, TemplGenerator, domParser, TextGenerator, templOutput, templEdit, modelSyntax) {
    'use strict'
    $(function(){
        $.Mustache.add('templ-output', templOutput);
        $.Mustache.add('templ-edit', templEdit);
        var foundTokens = {};
        var templGenerator = new TemplGenerator(foundTokens);
        var textGenerator = new TextGenerator(foundTokens);
        function refreshExtraTokens(){
            var $extraTokens = $('.extra-tokens').empty();
            for(var token in foundTokens){
                if(document.getElementById('rule-'+token) || foundTokens[token] <= 0){
                    continue;
                }
                $extraTokens.append('<span id="rule-'+token+'">'+token+'</span>');
            }
        }

        $('.jAdd').click(function(){
            var even = true;
            var bruteText = $('#input').val().trim();
            if(!bruteText)
                return;
            var rules = syntaxParser.parse(bruteText, templGenerator);
            $('.buttons').show();
            $('#output').mustache('templ-output', {rules:rules});
            resizeTextArea($('#input').val(''));
            refreshExtraTokens();
        });
        $('.jEditAll').click(function(){
            var spaces = 0;
            $('#output .rule .name').each(function(){
                var length =$(this).text().trim().length;
                if(length >= spaces){
                    spaces = length + 1;
                }
            });

            textGenerator.spaces(spaces);
            var input = domParser.parse($('#output'), textGenerator);
            $('.buttons').hide();
            $('#input').val(input);
            $('#output').empty();
            resizeTextArea($('#input'));
        });
        $('.jToogle').click(function(){
            $('.semantic').toggle();
        });
        function getRuleClass($button){
            return '.' + $button.closest('.rule').attr('id');
        }
        $('#output').on('click', '.jUp', function(){
            var $currentHead = $(this).closest('.rule');
            var $current = $(getRuleClass($currentHead));
            var $prevHead = $currentHead.prevAll('.head').first();
            var $prev = $(getRuleClass($prevHead));
            $prev.toggleClass('even');
            $current.toggleClass('even');
            $current.each(function(){
                $prevHead.before($(this));
            });
        });

        $('#output').on('click', '.jDown', function(){
            var $currentHead = $(this).closest('.rule');
            var $current = $(getRuleClass($currentHead));
            var $nextHead = $currentHead.nextAll('.head').first();
            var $next = $(getRuleClass($nextHead));
            $next.toggleClass('even');
            $current.toggleClass('even');
            $next.each(function(){
                $currentHead.before($(this));
            });
        });

        $('#output').on('click', '.jEdit', function(){
            var className = getRuleClass($(this));
            var $current = $(className);
            var newVal = '';
            $current.each(function(){
                newVal += domParser.parseDefinition($(this), textGenerator) + '\n';
            });
            
            var $currentHead = $current.first();
            $currentHead.children(':not(.name)').remove();
            $currentHead.mustache('templ-edit', {
                value:newVal.slice(0, -1)
            });
            $currentHead.data('even', $current.hasClass('even'));
            $current.not($currentHead).remove();

            resizeTextArea($currentHead.find('textarea'));
        });
        $('#output').on('click', '.jDelete', function(){
            var $this = $(getRuleClass($(this)));
            $this.find('.def-item').each(function () {
                domParser.parseToken($(this), textGenerator);
            })
            $this.nextAll().toggleClass('even');
            $this.remove();
            refreshExtraTokens();
        });

        $('#output').on('click', '.jResetEdit', function(){
            var $value = $(this).closest('.rule').find('.value');
            $value.val($value.text());
        });
        $('#output').on('click', '.jOkEdit', function(){
            var $editRule = $(this).closest('.rule');
            var $value = $editRule.find('.value');
            var newVal = $value.val().trim();
            var name = $editRule.find('.name').text().trim();
            var rules = newVal.split('\n').map(function(v){
                return v.trim();
            }).filter(function(cline){
                if(!cline.trim() || cline[0]==='#'){
                    return false;
                }
                return true;
            }).map(function(ruleDef, i){
                return {
                    ruleName: name,
                    even: $editRule.data('even'),
                    newRule: i==0,
                    ruleDef: syntaxParser.parseDefinition(ruleDef, templGenerator),
                };
            });
            if(rules.length){
                $editRule.before($.Mustache.render('templ-output', {
                    rules: rules
                }));
            } else {
                $editRule.nextAll().toggleClass('even');
            }
            $editRule.remove();
            refreshExtraTokens();
        });
        function resizeTextArea($textarea){
            var lines = $textarea.val().split('\n');
            var nrows = lines.length;
            var ncols = lines.reduce(function(prev, curr){
                return Math.max(prev, curr.length);
            }, 0);
            $textarea.attr('rows', Math.max(1, nrows-1));
            $textarea.attr('cols', Math.max(ncols, 40));
        }
        $('body').on('input', 'textarea', function(){
            var $this = $(this);
            resizeTextArea($this);
        });

        $('.export-json').click(function(event) {
            'use strict'
            //event.preventDefault();
            /* Act on the event */
            var productions = {};
            var terminals = {};
            var $output = $('#output');
            var start = $output.find('.rule.head:first .name').text().trim();
            var initialization = [];
            $output.find('.rule.head').each(function(index, el) {
                var $this = $(this);
                var name = $this.find('.name').text().trim();
                var initial = name[0];
                if(initial == initial.toUpperCase()){
                    terminals[name] = $this.find('.definition').text().trim();
                } else {
                    var variants = [];
                    $output.find('.rule-'+name).each(function() {
                        var items = [];
                        $(this).find('.def-item').each(function() {
                            var $item = $(this);
                            if($item.hasClass('semantic')){
                                var text = $item.text().trim();
                                var matches = text.match(/\{(?:(begin|end)\-)?([\w\d_]+)?(?:-([\w\d_-]+))?(\[(\$|[\w\d_]+)\])?\}/);
                                if(!matches){
                                    throw new Error('Wrong Format:'+text);
                                }
                                var call = {
                                    type:   matches[1]||'call',
                                    object: matches[2],
                                    action: matches[3]||null,
                                    param:  matches[4]?(matches[5]=='$'?true:matches[5]):(false)
                                };
                                if(items.length){
                                    var last = items[items.length-1]; 
                                    last.actions.push(call);
                                } else if(name === start){
                                    initialization.push(call);
                                } else {
                                    throw new Error('invalid semantic location');
                                }
                            }else {
                                items.push({
                                    item: $item.text().trim(),
                                    actions: []
                                }); 
                            }
                        });
                        variants.push(items);
                    });
                    productions[name] = variants;
                }
            });
            var result = {
                productions: productions,
                terminals: terminals,
                start: start,
                initialization: initialization
            };
            this.href = 'data:,'+JSON.stringify(result);
            //return false;
        });

        //Dirt trick
        $('#input').val($('#input').val()||modelSyntax);
        $('.jAdd').click();
    });
});